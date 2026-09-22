import { getMilestoneAmount } from "../../../utils/milestones";
import { calculateTax, getRuleSetById, listAvailableRuleSets } from "./taxEngine";

const countryRuleSets = {
  India: { ruleSetId: "rule-set.in.gst-cess", jurisdictionCode: "IN", note: "India customer matched to the active India GST rule set." },
  Netherlands: { ruleSetId: "rule-set.gb.compound-vat", jurisdictionCode: "GB", note: "Demo mapping: European customer uses the available compound VAT prototype." },
  Germany: { ruleSetId: "rule-set.gb.compound-vat", jurisdictionCode: "GB", note: "Demo mapping: European customer uses the available compound VAT prototype." },
  Singapore: { ruleSetId: "rule-set.ae.simple-vat", jurisdictionCode: "AE", note: "Demo mapping: Singapore uses the available simple VAT prototype." },
};

export function getBillableLines(form) {
  if (form.model === "Project") {
    return (form.milestones || []).map((milestone, index) => ({
      id: milestone.id,
      name: milestone.name || `Milestone ${index + 1}`,
      amount: getMilestoneAmount(milestone, form.contractValue),
      dueDate: milestone.dueDate,
    }));
  }
  return [{
    id: `billing-line-${String(form.model || "contract").toLowerCase()}`,
    name: form.model === "SaaS" ? "Subscription billing line" : "License billing line",
    amount: Number(form.contractValue) || 0,
    dueDate: form.effectiveDate,
  }];
}

export function getTaxRecommendation(form) {
  const seeded = countryRuleSets[form.country];
  if (seeded) return { ...seeded, isFallback: form.country !== "India" };
  return {
    ruleSetId: "rule-set.example.inr-selected-sum",
    jurisdictionCode: "XX-INR",
    isFallback: true,
    note: `No direct rule set exists for ${form.country || "this country"}; using the generic demo fallback. Finance review is required.`,
  };
}

export function getTaxContext(form, line, ruleSetId) {
  const ruleSet = getRuleSetById(ruleSetId);
  return {
    transaction: { type: "SALE", date: form.effectiveDate || line.dueDate || "2026-10-01" },
    party: { taxStatus: "TAXABLE", country: form.country, state: form.state },
    jurisdiction: { code: ruleSet?.jurisdictionId === "jurisdiction.in" ? "IN" : ruleSet?.jurisdictionId === "jurisdiction.gb" ? "GB" : ruleSet?.jurisdictionId === "jurisdiction.ae" ? "AE" : "XX-INR" },
    product: { taxCategory: "STANDARD", service: form.title, model: form.model },
    billing: { entity: form.entity, currency: form.currency },
  };
}

function exemptResult(line, form) {
  const base = Number(line.amount || 0).toFixed(2);
  return {
    ruleSetId: null,
    currency: form.currency,
    precision: 2,
    baseAmountDecimal: base,
    taxTotalDecimal: "0.00",
    totalDecimal: base,
    lines: [],
    validationErrors: [],
  };
}

export function calculateContractAssignment(form, line, assignment) {
  if (assignment.mode === "EXEMPT") return exemptResult(line, form);
  const recommendation = getTaxRecommendation(form);
  const ruleSetId = assignment.mode === "SPECIFIC_RULE_SET" ? assignment.ruleSetId : recommendation.ruleSetId;
  return calculateTax({
    ruleSetId,
    baseAmount: Number(line.amount || 0).toFixed(2),
    context: getTaxContext(form, line, ruleSetId),
  });
}

export function makeAssignment(form, line, existing = {}) {
  const recommendation = getTaxRecommendation(form);
  const mode = existing.mode || "AUTO_MATCH";
  const ruleSetId = mode === "SPECIFIC_RULE_SET" ? (existing.ruleSetId || recommendation.ruleSetId) : mode === "EXEMPT" ? null : recommendation.ruleSetId;
  const assignment = { mode, ruleSetId, overrideReason: existing.overrideReason || "" };
  const result = calculateContractAssignment(form, line, assignment);
  return {
    ...assignment,
    resultSnapshot: {
      ...result,
      calculatedAt: new Date().toISOString(),
      effectiveDate: form.effectiveDate || line.dueDate || "2026-10-01",
      sourceAmountDecimal: Number(line.amount || 0).toFixed(2),
    },
  };
}

export function getAssignmentLabel(assignment) {
  if (!assignment) return "Not assigned";
  if (assignment.mode === "EXEMPT") return "Exempt / no tax";
  return getRuleSetById(assignment.ruleSetId)?.name || assignment.ruleSetId || "Rule set unavailable";
}

export function getTaxAssignmentValidation(form) {
  const lines = getBillableLines(form);
  const assignments = form.taxAssignments || {};
  const invalid = lines.some((line) => {
    const assignment = assignments[line.id];
    return !assignment
      || (assignment.mode === "SPECIFIC_RULE_SET" && (!assignment.ruleSetId || !assignment.overrideReason?.trim()))
      || (assignment.mode === "EXEMPT" && !assignment.overrideReason?.trim());
  });
  return {
    invalid,
    message: invalid ? "Complete each tax assignment and provide a reason for overrides or exemptions" : "",
  };
}

export { getRuleSetById, listAvailableRuleSets };
