export const contracts = [
  { id: "CTR-2026-041", customer: "Anandapur Textiles Pvt Ltd", location: "Kolkata, West Bengal", model: "Project", entity: "Matrix Media — India", value: "₹48,00,000", status: "Approved", date: "18 Sep 2026", tax: "CGST 9% + SGST 9%", accent: "emerald" },
  { id: "CTR-2026-040", customer: "Capital Retail Solutions", location: "New Delhi, India", model: "Project", entity: "Matrix Media — India", value: "₹32,50,000", status: "Pending Approval", date: "16 Sep 2026", tax: "IGST 18%", accent: "amber" },
  { id: "CTR-2026-038", customer: "Amsterdam Analytics B.V.", location: "Amsterdam, Netherlands", model: "SaaS", entity: "Matrix Media — India", value: "€72,000 / yr", status: "Approved", date: "12 Sep 2026", tax: "Export — 0%", accent: "violet" },
  { id: "CTR-2026-035", customer: "Northline Software GmbH", location: "Berlin, Germany", model: "License", entity: "Matrix Media — India", value: "€125,000", status: "Approved", date: "08 Sep 2026", tax: "Export — 0%", accent: "blue" },
  { id: "CTR-2026-031", customer: "Silverline Logistics", location: "Mumbai, Maharashtra", model: "SaaS", entity: "Matrix Media — India", value: "₹18,00,000 / yr", status: "Draft", date: "02 Sep 2026", tax: "IGST 18%", accent: "slate" },
];

export const invoices = [
  { no: "MM-IN-WB-0184", contract: "CTR-2026-041", customer: "Anandapur Textiles Pvt Ltd", model: "Project", amount: "₹12,00,000", tax: "₹2,16,000", total: "₹14,16,000", status: "Final", due: "18 Oct 2026" },
  { no: "MM-IN-WB-0183", contract: "CTR-2026-038", customer: "Amsterdam Analytics B.V.", model: "SaaS", amount: "€6,000", tax: "€0", total: "€6,000", status: "Sent", due: "10 Oct 2026" },
  { no: "MM-IN-WB-0182", contract: "CTR-2026-035", customer: "Northline Software GmbH", model: "License", amount: "€125,000", tax: "€0", total: "€125,000", status: "Pending Approval", due: "30 Sep 2026" },
  { no: "DRAFT-019", contract: "CTR-2026-041", customer: "Anandapur Textiles Pvt Ltd", model: "Project", amount: "₹16,80,000", tax: "₹3,02,400", total: "₹19,82,400", status: "Draft", due: "—" },
  { no: "MM-IN-WB-0179", contract: "CTR-2026-031", customer: "Silverline Logistics", model: "SaaS", amount: "₹18,00,000", tax: "₹3,24,000", total: "₹21,24,000", status: "Sent", due: "28 Sep 2026" },
];

export const badgeStyles = {
  Draft: "bg-slate-100 text-slate-600", "Pending Approval": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", Final: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Sent: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", Project: "bg-orange-50 text-orange-700",
  SaaS: "bg-violet-50 text-violet-700", License: "bg-sky-50 text-sky-700", Active: "bg-emerald-50 text-emerald-700",
};
