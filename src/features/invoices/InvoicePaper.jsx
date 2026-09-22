import { ReceiptText } from "lucide-react";
import { formatMoney } from "../tax/utils/taxEngine";

const money = (value, currency) => formatMoney(Number(value || 0), currency);

function InvoicePaper({
  no = "DRAFT",
  status = "Proforma",
  customer,
  customerAddress,
  customerTaxId,
  entity,
  lineItem,
  currency = "INR",
  subtotalDecimal = "0.00",
  taxLines = [],
  taxTotalDecimal = "0.00",
  totalDecimal = "0.00",
  issueDate,
  due,
  terms = "Net 30 days",
}) {
  return <div className="mx-auto max-w-4xl rounded-sm border bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10">
    <div className="flex items-start justify-between border-b pb-7"><div><div className="mb-4 flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white"><ReceiptText size={18}/></div><b>{entity?.name}</b></div><p className="text-xs leading-5 text-slate-500">{entity?.address}<br/>{entity?.taxId && `GSTIN: ${entity.taxId}`}</p></div><div className="text-right"><h2 className="text-3xl font-bold uppercase text-slate-300">{status}</h2><p className="mt-2 text-sm font-bold">{no}</p><p className="mt-1 text-xs text-slate-400">{issueDate}</p></div></div>
    <div className="grid gap-6 border-b py-7 sm:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bill to</p><p className="mt-2 font-bold">{customer}</p><p className="mt-1 text-xs leading-5 text-slate-500">{customerAddress}<br/>{customerTaxId && `Tax ID: ${customerTaxId}`}</p></div><div className="sm:text-right"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment details</p><p className="mt-2 text-sm"><b>Due:</b> {due}</p><p className="mt-1 text-sm"><b>Terms:</b> {terms}</p></div></div>
    <div className="py-7"><div className="grid grid-cols-[1fr_60px_110px_120px] bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400"><span>Description</span><span>Qty</span><span>Rate</span><span className="text-right">Amount</span></div><div className="grid grid-cols-[1fr_60px_110px_120px] px-4 py-5 text-sm"><div><b>{lineItem?.description}</b><p className="mt-1 text-xs text-slate-400">{lineItem?.detail}</p></div><span>{lineItem?.quantity}</span><span>{money(lineItem?.unitPriceDecimal, currency)}</span><b className="text-right">{money(lineItem?.amountDecimal, currency)}</b></div></div>
    <div className="ml-auto w-full max-w-sm space-y-3 border-t pt-5 text-sm"><div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{money(subtotalDecimal, currency)}</span></div>{taxLines.map((line) => <div key={line.id} className="flex justify-between text-slate-500"><span>{line.taxName} · {line.rateValueType === "PERCENTAGE" ? `${line.rateValue}%` : "Fixed"}</span><span>{money(line.taxAmountDecimal, currency)}</span></div>)}{taxLines.length === 0 && <div className="flex justify-between text-slate-500"><span>Tax · Exempt / zero-rated</span><span>{money(taxTotalDecimal, currency)}</span></div>}<div className="flex justify-between border-t pt-4 text-lg font-bold"><span>Total</span><span>{money(totalDecimal, currency)}</span></div></div>
    <div className="mt-10 rounded-xl bg-slate-50 p-4 text-xs text-slate-500"><b className="text-slate-700">Bank details</b><br/>{entity?.bank}</div>
  </div>;
}
export default InvoicePaper;
