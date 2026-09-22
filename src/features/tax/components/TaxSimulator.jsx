import { useMemo, useState } from "react";
import { AlertTriangle, ArrowDown, Calculator, CheckCircle2 } from "lucide-react";
import Field from "../../../components/ui/Field";
import { jurisdictions, ruleSets, sampleContexts } from "../data";
import { calculateTax, formatMoney, validateDependencyGraph } from "../utils/taxEngine";
import { directionOf } from "./taxAdminUtils";

function TaxSimulator() {
  const [direction, setDirection] = useState("Sale");
  const candidates = ruleSets.filter((item) => directionOf(item) === direction);
  const [selectedId, setSelectedId] = useState("rule-set.in.gst-cess");
  const selected = candidates.find((item) => item.id === selectedId) || candidates[0];
  const sample = sampleContexts[selected?.id] || {};
  const [amount, setAmount] = useState("1000.00");
  const [date, setDate] = useState("2026-09-22");
  const [partyStatus, setPartyStatus] = useState("TAXABLE");
  const [productCategory, setProductCategory] = useState("");
  const [jurisdictionCode, setJurisdictionCode] = useState("");
  const context = {
    transaction: { type: direction.toUpperCase(), date },
    party: { taxStatus: partyStatus },
    jurisdiction: { code: jurisdictionCode || sample.jurisdiction?.code },
    product: { taxCategory: productCategory || sample.product?.taxCategory },
  };
  const result = useMemo(() => calculateTax({ ruleSetId: selected?.id, baseAmount: amount, context }), [selected?.id, amount, date, direction, partyStatus, productCategory, jurisdictionCode]);
  const graph = useMemo(() => validateDependencyGraph(selected), [selected]);
  const switchDirection = (next) => {
    const nextSet = ruleSets.find((item) => directionOf(item) === next);
    setDirection(next);
    setSelectedId(nextSet?.id || "");
    setProductCategory("");
    setJurisdictionCode("");
  };

  return <div className="space-y-5">
    <div><h2 className="text-xl font-bold">Tax simulator</h2><p className="mt-1 text-sm text-slate-500">Run the core engine live and inspect matching evidence and calculation order.</p></div>
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="space-y-5 rounded-2xl border bg-slate-50/60 p-5">
        <div className="inline-flex rounded-xl bg-slate-200/70 p-1">{["Sale", "Purchase"].map((item) => <button key={item} onClick={() => switchDirection(item)} className={`rounded-lg px-4 py-2 text-sm font-bold ${direction === item ? "bg-white text-ink shadow-sm" : "text-slate-500"}`}>{item}</button>)}</div>
        {direction === "Purchase" && <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs font-semibold text-violet-700">Prototype only · seeded purchase/import demo; no operational purchase flow is connected.</div>}
        <Field label="Rule set"><select className="field" value={selected?.id || ""} onChange={(e) => { setSelectedId(e.target.value); setProductCategory(""); setJurisdictionCode(""); }}>{candidates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
        <Field label="Taxable amount"><div className="relative"><span className="absolute left-3 top-[21px] text-sm font-bold text-slate-400">{selected?.currency}</span><input className="field pl-14" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)}/></div></Field>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Field label="Transaction date"><input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)}/></Field>
          <Field label="Party tax status"><select className="field" value={partyStatus} onChange={(e) => setPartyStatus(e.target.value)}><option>TAXABLE</option><option>EXEMPT</option><option>UNREGISTERED</option></select></Field>
          <Field label="Jurisdiction"><select className="field" value={jurisdictionCode || sample.jurisdiction?.code || ""} onChange={(e) => setJurisdictionCode(e.target.value)}>{jurisdictions.map((item) => <option key={item.id} value={item.code}>{item.name}</option>)}</select></Field>
          <Field label="Product category"><select className="field" value={productCategory || sample.product?.taxCategory || ""} onChange={(e) => setProductCategory(e.target.value)}><option>STANDARD</option><option>ZERO_RATED</option><option>EXEMPT</option><option>IMPORT</option></select></Field>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Base amount", result.baseAmountDecimal], ["Tax total", result.taxTotalDecimal], ["Grand total", result.totalDecimal]].map(([label, value], index) => <div key={label} className={`rounded-2xl border p-4 ${index === 2 ? "border-moss-200 bg-moss-50" : "bg-white"}`}><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xl font-bold">{value == null ? "—" : formatMoney(value, selected?.currency || "USD")}</p></div>)}
        </div>
        {(result.validationErrors?.length > 0 || !graph.valid) && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="mb-2 flex items-center gap-2 font-bold text-rose-800"><AlertTriangle size={17}/>Validation errors</p>{[...(graph.errors || []), ...(result.validationErrors || [])].filter((item, index, all) => all.findIndex((x) => x.code === item.code && x.message === item.message) === index).map((item) => <p className="mt-1 text-sm text-rose-700" key={`${item.code}-${item.message}`}><span className="font-bold">{item.code}:</span> {item.message}</p>)}</div>}
        {!result.validationErrors?.length && graph.valid && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={17}/>Dependency graph valid · {result.lines.length} matching tax {result.lines.length === 1 ? "line" : "lines"}</div>}
        <div className="rounded-2xl border bg-white p-5"><div className="flex items-center gap-2"><Calculator size={18} className="text-moss-700"/><h3 className="font-bold">Calculation trace</h3></div>
          <div className="mt-5 space-y-2"><div className="rounded-xl bg-slate-100 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">Input base</p><p className="mt-1 font-bold">{result.baseAmountDecimal || amount} {selected?.currency}</p></div>
            {result.lines.map((line) => <div key={line.id}><ArrowDown size={16} className="my-1 ml-5 text-slate-300"/><div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Order {line.calculationOrder} · {line.baseType.replaceAll("_", " ")}</p><p className="mt-1 font-bold text-blue-950">{line.taxName}</p></div><p className="font-bold text-blue-900">{formatMoney(line.amountDecimal, selected.currency)}</p></div><p className="mt-2 text-xs text-blue-700">Base {line.taxableBaseDecimal} {selected.currency}{line.rate != null ? ` × ${line.rate}%` : " · fixed amount"}</p><p className="mt-1 text-[11px] text-blue-500">Matched: {line.evidence.matchedConditionIds.join(", ")}</p></div></div>)}
            {!result.lines.length && !result.validationErrors?.length && <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">No rules match this context. Adjust jurisdiction, status or category.</div>}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default TaxSimulator;
