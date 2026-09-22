import { useState } from "react";
import { AlertTriangle, ArrowLeft, GitBranch, Sparkles } from "lucide-react";
import { contracts } from "../../data/mockData";
import Field from "../../components/ui/Field";
import PageHead from "../../components/ui/PageHead";
import InvoicePaper from "./InvoicePaper";

function GenerateInvoice({ setPage, notify }) {
  const [stage, setStage] = useState(0);
  const [contract, setContract] = useState("CTR-2026-041");
  const [lineId, setLineId] = useState("discovery");
  const [showOverride, setShowOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const selected = contracts.find((c) => c.id === contract) || contracts[0];
  const selectedLine = selected.milestones.find((line) => line.id === lineId) || selected.milestones[0];
  const assignment = selected.taxAssignments[selectedLine.id];
  const snapshot = assignment.resultSnapshot;
  const taxLines = [...snapshot.lines].sort((a, b) => a.sequence - b.sequence);
  const generatedInvoice = {
    no: "MM-IN-WB-0185",
    status: "Proforma",
    customer: selected.customer,
    customerAddress: selected.location,
    entity: {
      name: "Matrix Media Solutions",
      address: "22 Park Street, Kolkata, West Bengal 700016",
      taxId: "19AABCM1234F1Z5",
      bank: "HDFC Bank · A/C 50200001234567 · IFSC HDFC0001234",
    },
    lineItem: {
      id: selectedLine.id,
      description: selectedLine.name,
      detail: `${selected.id} · ${selectedLine.label}`,
      quantity: 1,
      unitPriceDecimal: selectedLine.amount.toFixed(2),
      amountDecimal: selectedLine.amount.toFixed(2),
    },
    currency: snapshot.currency,
    subtotalDecimal: snapshot.baseAmountDecimal,
    taxLines,
    taxTotalDecimal: snapshot.taxTotalDecimal,
    totalDecimal: snapshot.totalDecimal,
    issueDate: "22 September 2026",
    due: "22 October 2026",
    terms: "Net 30 days",
  };

  const chooseContract = (id) => {
    const next = contracts.find((item) => item.id === id);
    setContract(id);
    setLineId(next.milestones[0].id);
    setShowOverride(false);
    setOverrideReason("");
  };

  return <><button onClick={() => stage ? setStage(0) : setPage("invoices")} className="btn-ghost mb-4 !px-0"><ArrowLeft size={17} />{stage ? "Change trigger" : "Back to invoices"}</button><PageHead eyebrow={`Generate invoice · ${stage ? "Preview" : "Select trigger"}`} title={stage ? "Proforma invoice" : "What are you billing?"} desc={stage ? "Review the auto-generated invoice before sending it for approval." : "Choose an approved contract and LedgerFlow will apply its billing and tax rules."} />
    {stage === 0 ? <div className="mx-auto max-w-3xl panel p-6 sm:p-8"><div className="mb-6 rounded-2xl bg-moss-50 p-5"><div className="flex gap-3"><Sparkles className="text-moss-600" size={20}/><div><p className="font-bold text-moss-700">Contract-driven invoicing</p><p className="mt-1 text-sm text-moss-700/70">Line items, tax, entity and payment terms will be pulled from the selected contract.</p></div></div></div><div className="space-y-5"><Field label="Approved contract"><select value={contract} onChange={(e)=>chooseContract(e.target.value)} className="field">{contracts.filter((c)=>c.status==="Approved").map((c)=><option key={c.id} value={c.id}>{c.id} · {c.customer} · {c.model}</option>)}</select></Field><div className="grid gap-3 rounded-2xl border p-4 sm:grid-cols-3">{[["Customer",selected.customer],["Billing model",selected.model],["Tax treatment",assignment.treatment.replaceAll("_", " ")]].map(([a,b])=><div key={a}><p className="text-xs text-slate-400">{a}</p><p className="mt-1 text-sm font-bold">{b}</p></div>)}</div><Field label={selected.model === "Project" ? "Milestone to invoice" : "Logical billing line"}><select value={selectedLine.id} onChange={(e)=>setLineId(e.target.value)} className="field">{selected.milestones.map((line)=><option key={line.id} value={line.id}>{line.name} · {line.label}</option>)}</select></Field><div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800"><b>Selected assignment:</b> {assignment.mode} · {assignment.ruleSetId || "No rule set (exempt)"}<p className="mt-1 text-xs text-blue-600">Version {assignment.ruleSetVersionId || "contract exemption"} · snapshot total {snapshot.totalDecimal} {snapshot.currency}</p></div><button onClick={()=>setStage(1)} className="btn-primary w-full !py-3.5"><Sparkles size={17}/>Generate proforma</button></div></div> :
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]"><InvoicePaper {...generatedInvoice}/><div className="space-y-4"><div className="panel p-5"><h3 className="font-bold">Contract tax snapshot</h3><div className="mt-3 rounded-xl bg-moss-50 p-3"><p className="text-sm font-bold text-moss-700">{assignment.treatment.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-moss-600">{assignment.mode} · {assignment.ruleSetVersionId || "Exemption evidence"}</p></div><div className="mt-4 space-y-3">{taxLines.length ? taxLines.map((line)=><div key={line.id} className="rounded-xl border p-3 text-xs"><div className="flex items-center justify-between"><b>{line.sequence}. {line.taxName} · {line.rateValue}%</b><b>{line.taxAmountDecimal} {line.currency}</b></div><p className="mt-1 text-slate-500">Base: {line.baseType} · {line.baseAmountDecimal} {line.currency}</p><p className="mt-1 flex items-center gap-1 text-slate-400"><GitBranch size={12}/>{line.dependencySourceIds.length ? `Depends on ${line.dependencySourceIds.join(", ")}` : "Uses invoice line subtotal"}</p></div>) : <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700"><b>Zero tax</b><p className="mt-1">{snapshot.evidence.exemptionReason}</p></div>}</div><button onClick={()=>setShowOverride(true)} className="mt-4 text-xs font-bold text-amber-600">Request tax override</button>{showOverride && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3"><div className="flex gap-2 text-amber-700"><AlertTriangle className="shrink-0" size={16}/><p className="text-xs leading-5"><b>Override requires approval.</b> The contract snapshot stays unchanged until Finance approves a replacement treatment.</p></div><textarea value={overrideReason} onChange={(e)=>setOverrideReason(e.target.value)} className="field mt-3 min-h-20" placeholder="Required reason and supporting evidence"/><div className="mt-2 flex gap-2"><button onClick={()=>{setShowOverride(false);setOverrideReason("");}} className="btn-secondary flex-1">Cancel</button><button disabled={!overrideReason.trim()} onClick={()=>{notify("Tax override sent to Finance; contract snapshot retained");setShowOverride(false);}} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40">Request</button></div></div>}</div><div className="panel p-5"><h3 className="font-bold">Next step</h3><p className="mt-2 text-sm leading-6 text-slate-500">Finance Approver will receive the invoice with this immutable tax snapshot.</p><button onClick={()=>{notify("Invoice submitted for finance approval");setPage("invoices");}} className="btn-primary mt-4 w-full">Submit for approval</button><button onClick={()=>notify("Draft invoice saved with tax snapshot")} className="btn-secondary mt-2 w-full">Save as draft</button></div></div></div>}</>;
}
export default GenerateInvoice;
