import {
  components,
  conditionGroups,
  conditions,
  dependencies,
  dependencyGroups,
  rates,
  ruleSets,
  taxes,
  treatments,
} from "../data/index.js";

const byId = (items) => new Map(items.map((item) => [item.id, item]));
const treatmentById = byId(treatments);
const rateById = byId(rates);
const taxById = byId(taxes);
const componentById = byId(components);
const conditionById = byId(conditions);
const conditionGroupById = byId(conditionGroups);
const dependencyById = byId(dependencies);
const dependencyGroupById = byId(dependencyGroups);

const error = (code, message, details = {}) => ({ code, message, ...details });

function powerOfTen(precision) {
  return 10n ** BigInt(precision);
}

function decimalParts(value) {
  const text = String(value).trim();
  if (!/^-?\d+(?:\.\d+)?$/.test(text)) {
    throw new TypeError(`Invalid decimal value: ${value}`);
  }
  const negative = text.startsWith("-");
  const [whole, fraction = ""] = (negative ? text.slice(1) : text).split(".");
  return { negative, whole, fraction };
}

function divideAndRound(numerator, denominator) {
  if (denominator <= 0n) throw new RangeError("Denominator must be positive");
  const negative = numerator < 0n;
  const absolute = negative ? -numerator : numerator;
  const quotient = absolute / denominator;
  const remainder = absolute % denominator;
  const rounded = remainder * 2n >= denominator ? quotient + 1n : quotient;
  return negative ? -rounded : rounded;
}

function toMinorUnits(value, precision) {
  const { negative, whole, fraction } = decimalParts(value);
  const scale = powerOfTen(precision);
  const kept = fraction.slice(0, precision).padEnd(precision, "0");
  const discarded = fraction.slice(precision);
  let minor = BigInt(whole) * scale + BigInt(kept || "0");
  if (discarded && Number(discarded[0]) >= 5) minor += 1n;
  return negative ? -minor : minor;
}

function decimalRatio(value) {
  const { negative, whole, fraction } = decimalParts(value);
  const denominator = powerOfTen(fraction.length);
  const numerator = BigInt(whole) * denominator + BigInt(fraction || "0");
  return { numerator: negative ? -numerator : numerator, denominator };
}

function minorToString(minor, precision) {
  const negative = minor < 0n;
  const absolute = negative ? -minor : minor;
  const scale = powerOfTen(precision);
  const whole = absolute / scale;
  const fraction = (absolute % scale).toString().padStart(precision, "0");
  return `${negative ? "-" : ""}${whole}${precision ? `.${fraction}` : ""}`;
}

function minorToNumber(minor, precision) {
  return Number(minorToString(minor, precision));
}

function percentageOf(baseMinor, percentage) {
  const ratio = decimalRatio(percentage);
  return divideAndRound(baseMinor * ratio.numerator, ratio.denominator * 100n);
}

function getPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function isWithinDate(date, effectiveFrom, effectiveTo) {
  if (!date) return true;
  return (!effectiveFrom || date >= effectiveFrom) && (!effectiveTo || date <= effectiveTo);
}

function conditionMatches(condition, context) {
  const actual = getPath(context, condition.field);
  switch (condition.operator) {
    case "EQUALS":
      return actual === condition.value;
    case "NOT_EQUALS":
      return actual !== condition.value;
    case "IN":
      return Array.isArray(condition.value) && condition.value.includes(actual);
    case "EXISTS":
      return condition.value ? actual != null : actual == null;
    default:
      return false;
  }
}

function conditionGroupMatches(groupId, context) {
  const group = conditionGroupById.get(groupId);
  if (!group) return false;
  const matches = group.conditionIds.map((id) => {
    const condition = conditionById.get(id);
    return Boolean(condition && conditionMatches(condition, context));
  });
  return group.operator === "ANY" ? matches.some(Boolean) : matches.every(Boolean);
}

export function getRuleSetById(id) {
  return ruleSets.find((ruleSet) => ruleSet.id === id) ?? null;
}

export function listAvailableRuleSets() {
  return ruleSets.map(({ id, code, name, jurisdictionId, versionId, currency, precision }) => ({
    id,
    code,
    name,
    jurisdictionId,
    versionId,
    currency,
    precision,
  }));
}

function resolveRuleSet(ruleSetOrId) {
  return typeof ruleSetOrId === "string" ? getRuleSetById(ruleSetOrId) : ruleSetOrId;
}

function graphEdges(ruleSet, validationErrors) {
  const rulesByTreatment = new Map(ruleSet.rules.map((rule) => [rule.treatmentId, rule]));
  const edges = [];

  for (const rule of ruleSet.rules) {
    const treatment = treatmentById.get(rule.treatmentId);
    if (!treatment) {
      validationErrors.push(error("MISSING_TREATMENT", `Rule ${rule.id} references missing treatment ${rule.treatmentId}`, { ruleId: rule.id }));
      continue;
    }
    if (!rateById.has(treatment.rateId)) {
      validationErrors.push(error("MISSING_RATE", `Treatment ${treatment.id} references missing rate ${treatment.rateId}`, { treatmentId: treatment.id }));
    }

    let sourceIds = [];
    if (treatment.baseType === "ONE_TAX") {
      const dependency = dependencyById.get(treatment.dependencyId);
      if (!dependency) {
        validationErrors.push(error("MISSING_SOURCE", `Treatment ${treatment.id} has no valid dependency`, { treatmentId: treatment.id }));
        continue;
      }
      sourceIds = [dependency.sourceTreatmentId];
    } else if (treatment.baseType === "SELECTED_TAX_SUM") {
      const group = dependencyGroupById.get(treatment.dependencyGroupId);
      if (!group || !group.sourceTreatmentIds.length) {
        validationErrors.push(error("MISSING_SOURCE", `Treatment ${treatment.id} has no valid dependency group`, { treatmentId: treatment.id }));
        continue;
      }
      sourceIds = group.sourceTreatmentIds;
    }

    for (const sourceTreatmentId of sourceIds) {
      if (sourceTreatmentId === treatment.id) {
        validationErrors.push(error("SELF_DEPENDENCY", `Treatment ${treatment.id} depends on itself`, { treatmentId: treatment.id }));
        continue;
      }
      const sourceRule = rulesByTreatment.get(sourceTreatmentId);
      if (!sourceRule) {
        validationErrors.push(error("MISSING_SOURCE", `Treatment ${treatment.id} references missing source ${sourceTreatmentId}`, {
          treatmentId: treatment.id,
          sourceTreatmentId,
        }));
        continue;
      }
      if (sourceRule.calculationOrder >= rule.calculationOrder) {
        validationErrors.push(error("INVALID_ORDER", `Source ${sourceTreatmentId} must execute before ${treatment.id}`, {
          treatmentId: treatment.id,
          sourceTreatmentId,
        }));
      }
      edges.push([sourceTreatmentId, treatment.id]);
    }
  }
  return edges;
}

export function validateDependencyGraph(ruleSetOrId) {
  const ruleSet = resolveRuleSet(ruleSetOrId);
  if (!ruleSet) {
    const errors = [error("RULE_SET_NOT_FOUND", `Unknown rule set: ${ruleSetOrId}`)];
    return { valid: false, errors };
  }

  const errors = [];
  const edges = graphEdges(ruleSet, errors);
  const adjacency = new Map();
  for (const [source, target] of edges) {
    adjacency.set(source, [...(adjacency.get(source) ?? []), target]);
  }

  const visiting = new Set();
  const visited = new Set();
  const visit = (node, path) => {
    if (visiting.has(node)) {
      errors.push(error("DEPENDENCY_CYCLE", `Dependency cycle detected: ${[...path, node].join(" -> ")}`, { treatmentId: node }));
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    for (const next of adjacency.get(node) ?? []) visit(next, [...path, node]);
    visiting.delete(node);
    visited.add(node);
  };
  for (const rule of ruleSet.rules) visit(rule.treatmentId, []);

  const signatures = new Map();
  for (const rule of ruleSet.rules) {
    const treatment = treatmentById.get(rule.treatmentId);
    if (!treatment) continue;
    const signature = [treatment.taxId, rule.priority, rule.calculationOrder, rule.conditionGroupId, rule.effectiveFrom, rule.effectiveTo].join("|");
    if (signatures.has(signature)) {
      errors.push(error("AMBIGUOUS_RULE", `Rules ${signatures.get(signature)} and ${rule.id} are indistinguishable`, {
        ruleIds: [signatures.get(signature), rule.id],
      }));
    } else {
      signatures.set(signature, rule.id);
    }
  }

  return { valid: errors.length === 0, errors };
}

function selectRules(ruleSet, context) {
  const date = context?.transaction?.date;
  const candidates = ruleSet.rules.filter((rule) => (
    isWithinDate(date, rule.effectiveFrom, rule.effectiveTo)
    && conditionGroupMatches(rule.conditionGroupId, context)
  ));
  const grouped = new Map();
  for (const rule of candidates) {
    const treatment = treatmentById.get(rule.treatmentId);
    if (!treatment) continue;
    grouped.set(treatment.taxId, [...(grouped.get(treatment.taxId) ?? []), rule]);
  }

  const selected = [];
  const errors = [];
  for (const [taxId, matchingRules] of grouped) {
    const highestPriority = Math.max(...matchingRules.map((rule) => rule.priority ?? 0));
    const winners = matchingRules.filter((rule) => (rule.priority ?? 0) === highestPriority);
    if (winners.length > 1) {
      errors.push(error("AMBIGUOUS_RULE", `Multiple equally ranked rules match ${taxId}`, {
        taxId,
        ruleIds: winners.map((rule) => rule.id),
      }));
    } else {
      selected.push(winners[0]);
    }
  }
  return { rules: selected.sort((a, b) => a.calculationOrder - b.calculationOrder || a.id.localeCompare(b.id)), errors };
}

function resultShell(ruleSet, baseMinor, validationErrors) {
  const precision = ruleSet.precision ?? 2;
  return {
    ruleSetId: ruleSet.id,
    currency: ruleSet.currency,
    precision,
    baseAmount: minorToNumber(baseMinor, precision),
    baseAmountDecimal: minorToString(baseMinor, precision),
    lines: [],
    components: [],
    taxTotal: 0,
    taxTotalDecimal: minorToString(0n, precision),
    total: minorToNumber(baseMinor, precision),
    totalDecimal: minorToString(baseMinor, precision),
    validationErrors,
  };
}

export function calculateTax({ ruleSetId, ruleSet: suppliedRuleSet, baseAmount, context = {} }) {
  const ruleSet = suppliedRuleSet ?? getRuleSetById(ruleSetId);
  if (!ruleSet) {
    return {
      ruleSetId: ruleSetId ?? null,
      lines: [],
      components: [],
      validationErrors: [error("RULE_SET_NOT_FOUND", `Unknown rule set: ${ruleSetId}`)],
    };
  }

  const precision = ruleSet.precision ?? 2;
  let baseMinor;
  try {
    baseMinor = toMinorUnits(baseAmount, precision);
  } catch (caught) {
    return {
      ...resultShell(ruleSet, 0n, [error("INVALID_BASE_AMOUNT", caught.message)]),
      baseAmount,
    };
  }

  const graphValidation = validateDependencyGraph(ruleSet);
  const selection = selectRules(ruleSet, context);
  const validationErrors = [...graphValidation.errors, ...selection.errors];
  const result = resultShell(ruleSet, baseMinor, validationErrors);
  if (validationErrors.length) return result;

  const amountByTreatment = new Map();
  let taxTotalMinor = 0n;

  for (const rule of selection.rules) {
    const treatment = treatmentById.get(rule.treatmentId);
    const rate = rateById.get(treatment.rateId);
    let taxableBaseMinor = baseMinor;
    let sourceTreatmentIds = [];

    if (treatment.baseType === "ONE_TAX") {
      const dependency = dependencyById.get(treatment.dependencyId);
      sourceTreatmentIds = [dependency.sourceTreatmentId];
    } else if (treatment.baseType === "SELECTED_TAX_SUM") {
      sourceTreatmentIds = dependencyGroupById.get(treatment.dependencyGroupId).sourceTreatmentIds;
    }

    if (sourceTreatmentIds.length) {
      const missingSources = sourceTreatmentIds.filter((id) => !amountByTreatment.has(id));
      if (missingSources.length) {
        result.validationErrors.push(error("MISSING_SOURCE", `Sources did not produce values for ${treatment.id}`, {
          treatmentId: treatment.id,
          sourceTreatmentIds: missingSources,
        }));
        continue;
      }
      taxableBaseMinor = sourceTreatmentIds.reduce((sum, id) => sum + amountByTreatment.get(id), 0n);
    }

    let amountMinor;
    if (treatment.calculationType === "FIXED" || rate.kind === "FIXED") {
      amountMinor = toMinorUnits(rate.value, precision);
    } else {
      amountMinor = percentageOf(taxableBaseMinor, rate.value);
    }
    amountByTreatment.set(treatment.id, amountMinor);
    taxTotalMinor += amountMinor;

    const tax = taxById.get(treatment.taxId);
    const line = {
      id: `line.${rule.id}`,
      ruleId: rule.id,
      calculationOrder: rule.calculationOrder,
      taxId: tax.id,
      taxCode: tax.code,
      taxName: tax.name,
      treatmentId: treatment.id,
      calculationType: treatment.calculationType,
      baseType: treatment.baseType,
      rate: rate.kind === "PERCENTAGE" ? Number(rate.value) : null,
      taxableBase: minorToNumber(taxableBaseMinor, precision),
      taxableBaseDecimal: minorToString(taxableBaseMinor, precision),
      amount: minorToNumber(amountMinor, precision),
      amountDecimal: minorToString(amountMinor, precision),
      evidence: {
        conditionGroupId: rule.conditionGroupId,
        matchedConditionIds: conditionGroupById.get(rule.conditionGroupId)?.conditionIds ?? [],
        sourceTreatmentIds,
      },
      components: treatment.componentIds.map((componentId) => {
        const component = componentById.get(componentId);
        return {
          componentId,
          code: component?.code,
          name: component?.name,
          amount: minorToNumber(amountMinor, precision),
          amountDecimal: minorToString(amountMinor, precision),
        };
      }),
    };
    result.lines.push(line);
    result.components.push(...line.components.map((component) => ({ ...component, lineId: line.id, taxId: tax.id })));
  }

  result.taxTotal = minorToNumber(taxTotalMinor, precision);
  result.taxTotalDecimal = minorToString(taxTotalMinor, precision);
  result.total = minorToNumber(baseMinor + taxTotalMinor, precision);
  result.totalDecimal = minorToString(baseMinor + taxTotalMinor, precision);
  return result;
}

export function formatMoney(amount, currency, locale = "en") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
