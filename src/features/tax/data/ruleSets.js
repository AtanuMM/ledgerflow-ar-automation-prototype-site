const makeRule = (id, treatmentId, conditionGroupId, calculationOrder) => ({
  id,
  treatmentId,
  conditionGroupId,
  calculationOrder,
  priority: 100,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
});

export const ruleSets = [
  {
    id: "rule-set.ae.simple-vat",
    code: "AE_SIMPLE_VAT",
    name: "UAE simple VAT",
    jurisdictionId: "jurisdiction.ae",
    versionId: "version.ae.2026-01",
    currency: "AED",
    precision: 2,
    rules: [
      makeRule("rule.ae.vat", "treatment.ae.vat.standard", "condition-group.ae.standard", 10),
    ],
  },
  {
    id: "rule-set.in.gst-cess",
    code: "IN_GST_CESS",
    name: "India GST plus Cess",
    jurisdictionId: "jurisdiction.in",
    versionId: "version.in.2026-01",
    currency: "INR",
    precision: 2,
    rules: [
      makeRule("rule.in.gst", "treatment.in.gst.standard", "condition-group.in.standard", 10),
      makeRule("rule.in.cess", "treatment.in.cess.on-gst", "condition-group.in.standard", 20),
    ],
  },
  {
    id: "rule-set.gb.compound-vat",
    code: "GB_COMPOUND_VAT",
    name: "UK VAT with service charge and education levy",
    jurisdictionId: "jurisdiction.gb",
    versionId: "version.gb.2026-01",
    currency: "GBP",
    precision: 2,
    rules: [
      makeRule("rule.gb.vat", "treatment.gb.vat.standard", "condition-group.gb.standard", 10),
      makeRule("rule.gb.service", "treatment.gb.service.on-vat", "condition-group.gb.standard", 20),
      makeRule("rule.gb.education", "treatment.gb.education.on-selected", "condition-group.gb.standard", 30),
    ],
  },
  {
    id: "rule-set.example.inr-selected-sum",
    code: "INR_SELECTED_SUM_EXAMPLE",
    name: "Generic INR selected-tax-sum example",
    jurisdictionId: "jurisdiction.generic-inr",
    versionId: "version.example.2026-01",
    currency: "INR",
    precision: 2,
    rules: [
      makeRule("rule.example.gst", "treatment.example.gst", "condition-group.example.standard", 10),
      makeRule("rule.example.service", "treatment.example.service.on-gst", "condition-group.example.standard", 20),
      makeRule("rule.example.education", "treatment.example.education.on-selected", "condition-group.example.standard", 30),
    ],
  },
  {
    id: "rule-set.purchase.import-prototype",
    code: "PURCHASE_IMPORT_PROTOTYPE",
    name: "Purchase import fee (prototype)",
    jurisdictionId: "jurisdiction.generic-inr",
    versionId: "version.example.2026-01",
    currency: "INR",
    precision: 2,
    prototype: true,
    rules: [
      makeRule("rule.purchase.import-fee", "treatment.prototype.fixed", "condition-group.purchase.standard", 10),
    ],
  },
];

export const sampleContexts = {
  "rule-set.ae.simple-vat": {
    transaction: { type: "SALE", date: "2026-09-22" },
    party: { taxStatus: "TAXABLE" },
    jurisdiction: { code: "AE" },
    product: { taxCategory: "STANDARD" },
  },
  "rule-set.in.gst-cess": {
    transaction: { type: "SALE", date: "2026-09-22" },
    party: { taxStatus: "TAXABLE" },
    jurisdiction: { code: "IN" },
    product: { taxCategory: "STANDARD" },
  },
  "rule-set.gb.compound-vat": {
    transaction: { type: "SALE", date: "2026-09-22" },
    party: { taxStatus: "TAXABLE" },
    jurisdiction: { code: "GB" },
    product: { taxCategory: "STANDARD" },
  },
  "rule-set.example.inr-selected-sum": {
    transaction: { type: "SALE", date: "2026-09-22" },
    party: { taxStatus: "TAXABLE" },
    jurisdiction: { code: "XX-INR" },
    product: { taxCategory: "STANDARD" },
  },
  "rule-set.purchase.import-prototype": {
    transaction: { type: "PURCHASE", date: "2026-09-22" },
    party: { taxStatus: "TAXABLE" },
    jurisdiction: { code: "XX-INR" },
    product: { taxCategory: "IMPORT" },
  },
};
