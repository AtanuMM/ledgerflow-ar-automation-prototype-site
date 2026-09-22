import { ArrowLeft, Download, GitBranch, LockKeyhole } from "lucide-react";
import { invoices } from "../../data/mockData";
import Badge from "../../components/ui/Badge";
import PageHead from "../../components/ui/PageHead";
import InvoicePaper from "./InvoicePaper";

function InvoiceDetail({ invoice, setPage, notify }) {
  const i = invoice || invoices[0];
  const snapshot = i.taxAssignment.resultSnapshot;
  return <><button onClick={()=>setPage("invoices")} className="btn-ghost mb-4 !px-0"><ArrowLeft size={17}/>All invoices</button><PageHead eyebrow={`${i.contract} · ${i.customer}`} title={i.no} desc={`${i.model} invoice · ${snapshot.totalDecimal} ${i.currency}`} action={<div className="flex gap-2"><button onClick={()=>notify("PDF download started")} className="btn-secondary"><Download size={16}/>Download PDF</button><button onClick={()=>notify("Invoice marked as sent")} className="btn-primary">Mark as sent</button></div>}/><div className="mb-5 panel p-4"><div className="flex items-center gap-3"><Badge>{i.status}</Badge><div className="h-px flex-1 bg-slate-100"/><span className="text-xs text-slate-400">Draft → Proforma → Approved → Final → Sent</span></div></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"><InvoicePaper {...i} taxLines={snapshot.lines}/><aside className="space-y-4">
      <div className="panel p-5"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-moss-50 text-moss-700"><LockKeyhole size={18}/></div><div><h3 className="font-bold">Applied rule snapshot</h3><p className="mt-1 text-xs leading-5 text-slate-500">Frozen when this invoice was created. Current master-rate changes will not recalculate it.</p></div></div>
        <div className="mt-5 grid gap-3 text-xs"><div><span className="text-slate-400">Treatment</span><p className="mt-1 font-semibold">{snapshot.treatment.replaceAll("_", " ")}</p></div><div><span className="text-slate-400">Rule set / version</span><p className="mt-1 break-all font-mono font-semibold">{snapshot.ruleSetId || "Exemption"} · {snapshot.ruleSetVersionId || "Captured evidence"}</p></div><div><span className="text-slate-400">Effective date</span><p className="mt-1 font-semibold">{snapshot.effectiveDate}</p></div><div><span className="text-slate-400">Rounding</span><p className="mt-1 font-semibold">{snapshot.rounding.mode} · {snapshot.rounding.precision} decimals</p></div></div>
      </div>
      <div className="panel p-5"><div className="flex items-center gap-2"><GitBranch size={17} className="text-moss-700"/><h3 className="font-bold">Tax calculation</h3></div><div className="mt-4 space-y-3">{snapshot.lines.length ? snapshot.lines.map((line)=><div key={line.id} className="rounded-xl border p-3 text-xs"><div className="flex items-center justify-between gap-3"><b>{line.sequence}. {line.taxName}</b><b>{line.taxAmountDecimal} {line.currency}</b></div><p className="mt-2 text-slate-500">{line.baseType.replaceAll("_", " ")} · base {line.baseAmountDecimal}</p><p className="mt-1 break-all font-mono text-[10px] text-slate-400">{line.ruleId}</p><p className="mt-1 text-[10px] text-slate-400">{line.dependencySourceIds.length ? `Depends on ${line.dependencySourceIds.join(", ")}` : "Calculated from line subtotal"}</p></div>) : <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><b>Zero tax snapshot</b><p className="mt-1">{snapshot.evidence.exemptionReason}</p></div>}</div></div>
    </aside></div>
  </>;
}
export default InvoiceDetail;
