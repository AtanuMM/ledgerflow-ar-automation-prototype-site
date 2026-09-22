import { calculateTax, getRuleSetById } from "../features/tax/utils/taxEngine";

const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
};

const indiaTaxAssignment = (baseAmount) => {
  const effectiveDate = "2026-10-01";
  const ruleSetId = "rule-set.in.gst-cess";
  const ruleSet = getRuleSetById(ruleSetId);
  const result = calculateTax({
    ruleSetId,
    baseAmount: baseAmount.toFixed(2),
    context: {
      transaction: { type: "SALE", date: effectiveDate },
      party: { taxStatus: "TAXABLE" },
      jurisdiction: { code: "IN" },
      product: { taxCategory: "STANDARD" },
    },
  });

  return deepFreeze({
    mode: "AUTO_MATCH",
    ruleSetId,
    ruleSetVersionId: ruleSet.versionId,
    treatment: "STANDARD",
    overrideReason: "",
    resultSnapshot: {
      ruleSetId,
      ruleSetVersionId: ruleSet.versionId,
      treatment: "STANDARD",
      currency: result.currency,
      effectiveDate,
      baseAmountDecimal: result.baseAmountDecimal,
      taxTotalDecimal: result.taxTotalDecimal,
      totalDecimal: result.totalDecimal,
      rounding: { mode: "HALF_UP", precision: result.precision },
      evidence: { source: "CONTRACT_TAX_ASSIGNMENT", capturedAt: "2026-09-22T10:00:00Z" },
      lines: result.lines.map((line) => ({
        id: line.id,
        ruleId: line.ruleId,
        ruleSetId,
        ruleSetVersionId: ruleSet.versionId,
        treatmentId: line.treatmentId,
        treatment: line.calculationType,
        components: line.components,
        dependencySourceIds: line.evidence.sourceTreatmentIds,
        baseType: line.baseType,
        baseAmountDecimal: line.taxableBaseDecimal,
        rateValueType: line.rate == null ? "FIXED" : "PERCENTAGE",
        rateValue: line.rate,
        taxAmountDecimal: line.amountDecimal,
        amountDecimal: line.amountDecimal,
        currency: result.currency,
        sequence: line.calculationOrder,
        calculationOrder: line.calculationOrder,
        taxName: line.taxName,
        taxCode: line.taxCode,
        rounding: { mode: "HALF_UP", precision: result.precision },
        evidence: line.evidence,
      })),
    },
  });
};

const exemptAssignment = (baseAmount, currency, reason) => deepFreeze({
  mode: "EXEMPT",
  ruleSetId: null,
  ruleSetVersionId: null,
  treatment: "EXPORT_EXEMPT",
  overrideReason: reason,
  resultSnapshot: {
    ruleSetId: null,
    ruleSetVersionId: null,
    treatment: "EXPORT_EXEMPT",
    currency,
    baseAmountDecimal: baseAmount.toFixed(2),
    taxTotalDecimal: "0.00",
    totalDecimal: baseAmount.toFixed(2),
    effectiveDate: "2026-10-01",
    rounding: { mode: "HALF_UP", precision: 2 },
    evidence: { source: "CONTRACT_TAX_ASSIGNMENT", exemptionReason: reason, capturedAt: "2026-09-22T10:00:00Z" },
    lines: [],
  },
});

export const contracts = [
  {
    id: "CTR-2026-041", customer: "Anandapur Textiles Pvt Ltd", location: "Kolkata, West Bengal", model: "Project", entity: "Matrix Media — India", value: "₹48,00,000", status: "Approved", date: "18 Sep 2026", tax: "CGST 9% + SGST 9%", accent: "emerald",
    milestones: [
      { id: "discovery", name: "Discovery & solution blueprint", label: "25%", amount: 1200000, currency: "INR" },
      { id: "implementation", name: "Implementation & UAT", label: "50%", amount: 2400000, currency: "INR" },
      { id: "go-live", name: "Go-live & handover", label: "25%", amount: 1200000, currency: "INR" },
    ],
    taxAssignments: { discovery: indiaTaxAssignment(1200000), implementation: indiaTaxAssignment(2400000), "go-live": indiaTaxAssignment(1200000) },
    documentUrl: "/documents/anandapur-contract.pdf",
    documents: [
      { id: "doc-041-3", name: "Signed master agreement", type: "Contract", version: "v2", url: "/documents/anandapur-contract.pdf", uploadedAt: "18 Sep 2026" },
      { id: "doc-041-2", name: "Master agreement", type: "Contract", version: "v1", url: "/documents/northline-contract.pdf", uploadedAt: "10 Sep 2026" },
      { id: "doc-041-1", name: "Commercial annexure", type: "Annexure", version: "v1", url: "/documents/amsterdam-contract.pdf", uploadedAt: "08 Sep 2026" },
      { id: "doc-041-4", name: "Milestone 1 proforma", type: "Invoice", version: "v1", url: "/documents/sample-upload.pdf", uploadedAt: "20 Sep 2026" },
    ],
    versions: [
      { versionLabel: "v0.3", date: "18 Sep 2026", editedBy: "Neha Kapoor", changeSummary: "Approved contract and uploaded the signed agreement", documentUrl: "/documents/anandapur-contract.pdf", status: "Current" },
      { versionLabel: "v0.2", date: "15 Sep 2026", editedBy: "Atanu Dey", changeSummary: "Milestone dates revised based on client feedback", documentUrl: "/documents/northline-contract.pdf", status: "Superseded" },
      { versionLabel: "v0.1", date: "10 Sep 2026", editedBy: "Atanu Dey", changeSummary: "Initial draft", documentUrl: "/documents/amsterdam-contract.pdf", status: "Superseded" },
    ],
  },
  {
    id: "CTR-2026-040", customer: "Capital Retail Solutions", location: "New Delhi, India", model: "Project", entity: "Matrix Media — India", value: "₹32,50,000", status: "Pending Approval", date: "16 Sep 2026", tax: "IGST 18%", accent: "amber",
    milestones: [
      { id: "discovery", name: "Discovery & solution blueprint", label: "25%", amount: 812500, currency: "INR" },
      { id: "implementation", name: "Implementation & UAT", label: "50%", amount: 1625000, currency: "INR" },
      { id: "go-live", name: "Go-live & handover", label: "25%", amount: 812500, currency: "INR" },
    ],
    taxAssignments: { discovery: indiaTaxAssignment(812500), implementation: indiaTaxAssignment(1625000), "go-live": indiaTaxAssignment(812500) },
    documentUrl: null, documents: [], versions: [],
  },
  {
    id: "CTR-2026-038", customer: "Amsterdam Analytics B.V.", location: "Amsterdam, Netherlands", model: "SaaS", entity: "Matrix Media — India", value: "€72,000 / yr", status: "Approved", date: "12 Sep 2026", tax: "Export — 0%", accent: "violet",
    milestones: [{ id: "billing-line-saas", name: "Annual SaaS subscription", label: "Annual", amount: 72000, currency: "EUR" }],
    taxAssignments: { "billing-line-saas": exemptAssignment(72000, "EUR", "Export of services; customer is outside India.") },
    documentUrl: "/documents/amsterdam-contract.pdf",
    documents: [
      { id: "doc-038-2", name: "SaaS subscription agreement", type: "Contract", version: "v2", url: "/documents/amsterdam-contract.pdf", uploadedAt: "12 Sep 2026" },
      { id: "doc-038-1", name: "Data processing addendum", type: "Addendum", version: "v1", url: "/documents/sample-upload.pdf", uploadedAt: "11 Sep 2026" },
    ],
    versions: [
      { versionLabel: "v1.1", date: "12 Sep 2026", editedBy: "Neha Kapoor", changeSummary: "Subscription agreement approved", documentUrl: "/documents/amsterdam-contract.pdf", status: "Current" },
      { versionLabel: "v1.0", date: "09 Sep 2026", editedBy: "Atanu Dey", changeSummary: "Initial SaaS commercial terms captured", documentUrl: "/documents/sample-upload.pdf", status: "Superseded" },
    ],
  },
  {
    id: "CTR-2026-035", customer: "Northline Software GmbH", location: "Berlin, Germany", model: "License", entity: "Matrix Media — India", value: "€125,000", status: "Approved", date: "08 Sep 2026", tax: "Export — 0%", accent: "blue",
    milestones: [{ id: "billing-line-license", name: "Perpetual software license", label: "One-time", amount: 125000, currency: "EUR" }],
    taxAssignments: { "billing-line-license": exemptAssignment(125000, "EUR", "Export license supplied to an overseas customer.") },
    documentUrl: "/documents/northline-contract.pdf",
    documents: [
      { id: "doc-035-2", name: "Software license agreement", type: "Contract", version: "v1", url: "/documents/northline-contract.pdf", uploadedAt: "08 Sep 2026" },
      { id: "doc-035-1", name: "AMC schedule", type: "Annexure", version: "v1", url: "/documents/amsterdam-contract.pdf", uploadedAt: "08 Sep 2026" },
    ],
    versions: [
      { versionLabel: "v1.0", date: "08 Sep 2026", editedBy: "Rahul Sen", changeSummary: "License agreement approved", documentUrl: "/documents/northline-contract.pdf", status: "Current" },
    ],
  },
  {
    id: "CTR-2026-031", customer: "Silverline Logistics", location: "Mumbai, Maharashtra", model: "SaaS", entity: "Matrix Media — India", value: "₹18,00,000 / yr", status: "Draft", date: "02 Sep 2026", tax: "IGST 18%", accent: "slate",
    milestones: [{ id: "billing-line-saas", name: "Annual SaaS subscription", label: "Annual", amount: 1800000, currency: "INR" }],
    taxAssignments: { "billing-line-saas": indiaTaxAssignment(1800000) },
    documentUrl: null, documents: [], versions: [],
  },
];

const entity = {
  name: "Matrix Media Solutions",
  address: "22 Park Street, Kolkata, West Bengal 700016",
  taxId: "19AABCM1234F1Z5",
  bank: "HDFC Bank · A/C 50200001234567 · IFSC HDFC0001234",
};

const invoiceFromAssignment = ({
  no, contract, customer, customerAddress, customerTaxId, model, lineItem,
  assignment, status, issueDate, due, terms = "Net 30 days",
}) => deepFreeze({
  no,
  contract,
  customer,
  customerAddress,
  customerTaxId,
  entity,
  model,
  lineItem: { quantity: 1, ...lineItem },
  currency: assignment.resultSnapshot.currency,
  subtotalDecimal: assignment.resultSnapshot.baseAmountDecimal,
  taxTotalDecimal: assignment.resultSnapshot.taxTotalDecimal,
  totalDecimal: assignment.resultSnapshot.totalDecimal,
  taxAssignment: assignment,
  status,
  issueDate,
  due,
  terms,
});

export const invoices = [
  invoiceFromAssignment({
    no: "MM-IN-WB-0184", contract: "CTR-2026-041", customer: "Anandapur Textiles Pvt Ltd",
    customerAddress: "Kolkata, West Bengal", customerTaxId: "19AAECA4412D1Z6", model: "Project",
    lineItem: { id: "discovery", description: "Discovery & solution blueprint", detail: "Milestone 1 · Project delivery", unitPriceDecimal: "1200000.00", amountDecimal: "1200000.00" },
    assignment: contracts[0].taxAssignments.discovery, status: "Final", issueDate: "18 September 2026", due: "18 Oct 2026",
  }),
  invoiceFromAssignment({
    no: "MM-IN-WB-0183", contract: "CTR-2026-038", customer: "Amsterdam Analytics B.V.",
    customerAddress: "Amsterdam, Netherlands", customerTaxId: "NL009921334B01", model: "SaaS",
    lineItem: { id: "billing-line-saas", description: "Annual SaaS subscription", detail: "Contracted annual billing line", unitPriceDecimal: "72000.00", amountDecimal: "72000.00" },
    assignment: contracts[2].taxAssignments["billing-line-saas"], status: "Sent", issueDate: "10 September 2026", due: "10 Oct 2026",
  }),
  invoiceFromAssignment({
    no: "MM-IN-WB-0182", contract: "CTR-2026-035", customer: "Northline Software GmbH",
    customerAddress: "Berlin, Germany", customerTaxId: "DE321998201", model: "License",
    lineItem: { id: "billing-line-license", description: "Perpetual software license", detail: "Initial perpetual license fee", unitPriceDecimal: "125000.00", amountDecimal: "125000.00" },
    assignment: contracts[3].taxAssignments["billing-line-license"], status: "Pending Approval", issueDate: "31 August 2026", due: "30 Sep 2026",
  }),
  invoiceFromAssignment({
    no: "DRAFT-019", contract: "CTR-2026-041", customer: "Anandapur Textiles Pvt Ltd",
    customerAddress: "Kolkata, West Bengal", customerTaxId: "19AAECA4412D1Z6", model: "Project",
    lineItem: { id: "implementation", description: "Implementation & UAT", detail: "Milestone 2 · Project delivery", unitPriceDecimal: "2400000.00", amountDecimal: "2400000.00" },
    assignment: contracts[0].taxAssignments.implementation, status: "Draft", issueDate: "21 September 2026", due: "—",
  }),
  invoiceFromAssignment({
    no: "MM-IN-WB-0179", contract: "CTR-2026-031", customer: "Silverline Logistics",
    customerAddress: "Mumbai, Maharashtra", customerTaxId: "27AAICS7721H1ZQ", model: "SaaS",
    lineItem: { id: "billing-line-saas", description: "Annual SaaS subscription", detail: "Contracted annual billing line", unitPriceDecimal: "1800000.00", amountDecimal: "1800000.00" },
    assignment: contracts[4].taxAssignments["billing-line-saas"], status: "Sent", issueDate: "29 August 2026", due: "28 Sep 2026",
  }),
];

export const badgeStyles = {
  Draft: "bg-slate-100 text-slate-600", "Pending Approval": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", Final: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Sent: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", Project: "bg-orange-50 text-orange-700",
  SaaS: "bg-violet-50 text-violet-700", License: "bg-sky-50 text-sky-700", Active: "bg-emerald-50 text-emerald-700",
};
