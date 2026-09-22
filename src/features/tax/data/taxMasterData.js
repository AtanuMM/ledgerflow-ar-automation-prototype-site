export const jurisdictions = [
  { id: "jurisdiction.ae", code: "AE", name: "United Arab Emirates" },
  { id: "jurisdiction.in", code: "IN", name: "India" },
  { id: "jurisdiction.gb", code: "GB", name: "United Kingdom" },
  { id: "jurisdiction.generic-inr", code: "XX-INR", name: "Generic INR example" },
];

export const taxes = [
  { id: "tax.ae.vat", code: "AE_VAT", name: "UAE VAT", category: "VAT" },
  { id: "tax.in.gst", code: "IN_GST", name: "India GST", category: "GST" },
  { id: "tax.in.cess", code: "IN_CESS", name: "Cess", category: "CESS" },
  { id: "tax.gb.vat", code: "GB_VAT", name: "UK VAT", category: "VAT" },
  { id: "tax.gb.service", code: "GB_SERVICE", name: "Service charge", category: "SURCHARGE" },
  { id: "tax.gb.education", code: "GB_EDUCATION", name: "Education levy", category: "LEVY" },
  { id: "tax.example.gst", code: "EXAMPLE_GST", name: "Example GST", category: "GST" },
  { id: "tax.example.service", code: "EXAMPLE_SERVICE", name: "Service charge", category: "SURCHARGE" },
  { id: "tax.example.education", code: "EXAMPLE_EDUCATION", name: "Education levy", category: "LEVY" },
  { id: "tax.prototype.fixed", code: "FIXED_FEE", name: "Prototype fixed tax", category: "FIXED" },
];

export const rates = [
  { id: "rate.percent.5", kind: "PERCENTAGE", value: "5" },
  { id: "rate.percent.10", kind: "PERCENTAGE", value: "10" },
  { id: "rate.percent.18", kind: "PERCENTAGE", value: "18" },
  { id: "rate.percent.20", kind: "PERCENTAGE", value: "20" },
  { id: "rate.fixed.25", kind: "FIXED", value: "25.00", currency: "INR" },
];

export const components = [
  { id: "component.ae.vat", taxId: "tax.ae.vat", code: "VAT", name: "VAT" },
  { id: "component.in.gst", taxId: "tax.in.gst", code: "GST", name: "GST" },
  { id: "component.in.cess", taxId: "tax.in.cess", code: "CESS", name: "Cess" },
  { id: "component.gb.vat", taxId: "tax.gb.vat", code: "VAT", name: "VAT" },
  { id: "component.gb.service", taxId: "tax.gb.service", code: "SERVICE", name: "Service charge" },
  { id: "component.gb.education", taxId: "tax.gb.education", code: "EDUCATION", name: "Education levy" },
  { id: "component.example.gst", taxId: "tax.example.gst", code: "GST", name: "GST" },
  { id: "component.example.service", taxId: "tax.example.service", code: "SERVICE", name: "Service charge" },
  { id: "component.example.education", taxId: "tax.example.education", code: "EDUCATION", name: "Education levy" },
  { id: "component.prototype.fixed", taxId: "tax.prototype.fixed", code: "FIXED_FEE", name: "Fixed fee" },
];

export const treatments = [
  { id: "treatment.ae.vat.standard", taxId: "tax.ae.vat", rateId: "rate.percent.5", calculationType: "PERCENTAGE", baseType: "BASE_AMOUNT", componentIds: ["component.ae.vat"] },
  { id: "treatment.in.gst.standard", taxId: "tax.in.gst", rateId: "rate.percent.18", calculationType: "PERCENTAGE", baseType: "BASE_AMOUNT", componentIds: ["component.in.gst"] },
  { id: "treatment.in.cess.on-gst", taxId: "tax.in.cess", rateId: "rate.percent.10", calculationType: "PERCENTAGE", baseType: "ONE_TAX", dependencyId: "dependency.in.cess.gst", componentIds: ["component.in.cess"] },
  { id: "treatment.gb.vat.standard", taxId: "tax.gb.vat", rateId: "rate.percent.20", calculationType: "PERCENTAGE", baseType: "BASE_AMOUNT", componentIds: ["component.gb.vat"] },
  { id: "treatment.gb.service.on-vat", taxId: "tax.gb.service", rateId: "rate.percent.10", calculationType: "PERCENTAGE", baseType: "ONE_TAX", dependencyId: "dependency.gb.service.vat", componentIds: ["component.gb.service"] },
  { id: "treatment.gb.education.on-selected", taxId: "tax.gb.education", rateId: "rate.percent.10", calculationType: "PERCENTAGE", baseType: "SELECTED_TAX_SUM", dependencyGroupId: "dependency-group.gb.education", componentIds: ["component.gb.education"] },
  { id: "treatment.example.gst", taxId: "tax.example.gst", rateId: "rate.percent.18", calculationType: "PERCENTAGE", baseType: "BASE_AMOUNT", componentIds: ["component.example.gst"] },
  { id: "treatment.example.service.on-gst", taxId: "tax.example.service", rateId: "rate.percent.10", calculationType: "PERCENTAGE", baseType: "ONE_TAX", dependencyId: "dependency.example.service.gst", componentIds: ["component.example.service"] },
  { id: "treatment.example.education.on-selected", taxId: "tax.example.education", rateId: "rate.percent.10", calculationType: "PERCENTAGE", baseType: "SELECTED_TAX_SUM", dependencyGroupId: "dependency-group.example.education", componentIds: ["component.example.education"] },
  { id: "treatment.prototype.fixed", taxId: "tax.prototype.fixed", rateId: "rate.fixed.25", calculationType: "FIXED", baseType: "BASE_AMOUNT", componentIds: ["component.prototype.fixed"] },
];

export const exemptions = [
  { id: "exemption.ae.none", jurisdictionId: "jurisdiction.ae", name: "No exemption", effect: "NONE" },
  { id: "exemption.in.none", jurisdictionId: "jurisdiction.in", name: "No exemption", effect: "NONE" },
  { id: "exemption.gb.none", jurisdictionId: "jurisdiction.gb", name: "No exemption", effect: "NONE" },
  { id: "exemption.example.none", jurisdictionId: "jurisdiction.generic-inr", name: "No exemption", effect: "NONE" },
];

export const conditions = [
  { id: "condition.ae.transaction", field: "transaction.type", operator: "EQUALS", value: "SALE" },
  { id: "condition.ae.party", field: "party.taxStatus", operator: "EQUALS", value: "TAXABLE" },
  { id: "condition.ae.jurisdiction", field: "jurisdiction.code", operator: "EQUALS", value: "AE" },
  { id: "condition.ae.product", field: "product.taxCategory", operator: "EQUALS", value: "STANDARD" },
  { id: "condition.in.transaction", field: "transaction.type", operator: "EQUALS", value: "SALE" },
  { id: "condition.in.party", field: "party.taxStatus", operator: "EQUALS", value: "TAXABLE" },
  { id: "condition.in.jurisdiction", field: "jurisdiction.code", operator: "EQUALS", value: "IN" },
  { id: "condition.in.product", field: "product.taxCategory", operator: "EQUALS", value: "STANDARD" },
  { id: "condition.gb.transaction", field: "transaction.type", operator: "EQUALS", value: "SALE" },
  { id: "condition.gb.party", field: "party.taxStatus", operator: "EQUALS", value: "TAXABLE" },
  { id: "condition.gb.jurisdiction", field: "jurisdiction.code", operator: "EQUALS", value: "GB" },
  { id: "condition.gb.product", field: "product.taxCategory", operator: "EQUALS", value: "STANDARD" },
  { id: "condition.example.transaction", field: "transaction.type", operator: "EQUALS", value: "SALE" },
  { id: "condition.example.party", field: "party.taxStatus", operator: "EQUALS", value: "TAXABLE" },
  { id: "condition.example.jurisdiction", field: "jurisdiction.code", operator: "EQUALS", value: "XX-INR" },
  { id: "condition.example.product", field: "product.taxCategory", operator: "EQUALS", value: "STANDARD" },
  { id: "condition.purchase.transaction", field: "transaction.type", operator: "EQUALS", value: "PURCHASE" },
  { id: "condition.purchase.party", field: "party.taxStatus", operator: "EQUALS", value: "TAXABLE" },
  { id: "condition.purchase.jurisdiction", field: "jurisdiction.code", operator: "EQUALS", value: "XX-INR" },
  { id: "condition.purchase.product", field: "product.taxCategory", operator: "EQUALS", value: "IMPORT" },
];

export const conditionGroups = ["ae", "in", "gb", "example", "purchase"].map((key) => ({
  id: `condition-group.${key}.standard`,
  operator: "ALL",
  conditionIds: [
    `condition.${key}.transaction`,
    `condition.${key}.party`,
    `condition.${key}.jurisdiction`,
    `condition.${key}.product`,
  ],
}));

export const dependencies = [
  { id: "dependency.in.cess.gst", targetTreatmentId: "treatment.in.cess.on-gst", sourceTreatmentId: "treatment.in.gst.standard" },
  { id: "dependency.gb.service.vat", targetTreatmentId: "treatment.gb.service.on-vat", sourceTreatmentId: "treatment.gb.vat.standard" },
  { id: "dependency.example.service.gst", targetTreatmentId: "treatment.example.service.on-gst", sourceTreatmentId: "treatment.example.gst" },
];

export const dependencyGroups = [
  { id: "dependency-group.gb.education", targetTreatmentId: "treatment.gb.education.on-selected", operator: "SUM", sourceTreatmentIds: ["treatment.gb.vat.standard", "treatment.gb.service.on-vat"] },
  { id: "dependency-group.example.education", targetTreatmentId: "treatment.example.education.on-selected", operator: "SUM", sourceTreatmentIds: ["treatment.example.gst", "treatment.example.service.on-gst"] },
];

export const versions = [
  { id: "version.ae.2026-01", version: "1.0.0", effectiveFrom: "2026-01-01", effectiveTo: null, status: "ACTIVE" },
  { id: "version.in.2026-01", version: "1.0.0", effectiveFrom: "2026-01-01", effectiveTo: null, status: "ACTIVE" },
  { id: "version.gb.2026-01", version: "1.0.0", effectiveFrom: "2026-01-01", effectiveTo: null, status: "ACTIVE" },
  { id: "version.example.2026-01", version: "1.0.0", effectiveFrom: "2026-01-01", effectiveTo: null, status: "ACTIVE" },
];

export const taxMasterData = {
  jurisdictions,
  taxes,
  rates,
  components,
  treatments,
  exemptions,
  conditions,
  conditionGroups,
  dependencies,
  dependencyGroups,
  versions,
};
