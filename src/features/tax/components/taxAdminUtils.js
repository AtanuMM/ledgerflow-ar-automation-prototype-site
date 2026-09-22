import {
  components,
  conditionGroups,
  conditions,
  jurisdictions,
  rates,
  sampleContexts,
  taxes,
  treatments,
  versions,
} from "../data";

export const indexById = (items) => Object.fromEntries(items.map((item) => [item.id, item]));

export const catalog = {
  components: indexById(components),
  conditionGroups: indexById(conditionGroups),
  conditions: indexById(conditions),
  jurisdictions: indexById(jurisdictions),
  rates: indexById(rates),
  taxes: indexById(taxes),
  treatments: indexById(treatments),
  versions: indexById(versions),
};

export const directionOf = (ruleSet) => (
  sampleContexts[ruleSet.id]?.transaction?.type === "PURCHASE"
  || ruleSet.rules?.some((rule) => rule.conditionGroupId === "condition-group.purchase.standard")
    ? "Purchase"
    : "Sale"
);

export const statusOf = (ruleSet) => catalog.versions[ruleSet.versionId]?.status || "DRAFT";

export const pretty = (value = "") => value
  .toLowerCase()
  .replaceAll("_", " ")
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

export function ruleSetSearchText(ruleSet) {
  const jurisdiction = catalog.jurisdictions[ruleSet.jurisdictionId]?.name || "";
  return `${ruleSet.name} ${ruleSet.code} ${jurisdiction} ${directionOf(ruleSet)}`.toLowerCase();
}

export function conditionsForRule(rule) {
  const group = catalog.conditionGroups[rule.conditionGroupId];
  return (group?.conditionIds || []).map((id) => catalog.conditions[id]).filter(Boolean);
}

export function describeTreatment(treatmentId) {
  const treatment = catalog.treatments[treatmentId];
  const tax = catalog.taxes[treatment?.taxId];
  const rate = catalog.rates[treatment?.rateId];
  return {
    treatment,
    tax,
    rate,
    label: `${tax?.name || "Unknown tax"} · ${rate?.kind === "FIXED" ? `${rate.currency} ${rate.value}` : `${rate?.value || "—"}%`}`,
  };
}
