import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2, FileText, History, LayoutList, ReceiptText } from "lucide-react";
import { contracts } from "../../data/mockData";
import ActionMenu from "../../components/ui/ActionMenu";
import Badge from "../../components/ui/Badge";
import PageHead from "../../components/ui/PageHead";
import VersionHistory from "../../components/ui/VersionHistory";
import ContractDocument from "./ContractDocument";

function money(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }).format(Number(value || 0));
}

function ContractDetail({ contract, setPage, notify }) {
  const c = contract || contracts[0];
  const [tab, setTab] = useState("summary");
  const [selectedVersionDocument, setSelectedVersionDocument] = useState(null);
  const versionItems = (c.versions || []).map((version) => ({
    label: version.versionLabel,
    date: version.date,
    editedBy: version.editedBy,
    summary: version.changeSummary,
    documentUrl: version.documentUrl,
    status: version.status,
  }));
  const viewVersion = (version) => {
    setSelectedVersionDocument({
      id: `history-${version.label}`,
      name: `Contract version ${version.label}`,
      type: "Version history",
      version: version.label,
      url: version.documentUrl,
      uploadedAt: version.date,
    });
    setTab("document");
  };
  return <><button onClick={() => setPage("contracts")} className="btn-ghost mb-4 !px-0"><ArrowLeft size={17} />All contracts</button>
    <PageHead eyebrow={c.id} title={c.customer} desc={`${c.location} · ${c.entity}`} action={<div className="flex gap-2"><ActionMenu buttonClassName="btn-secondary !px-3" onEdit={()=>{notify("Contract opened for editing");setPage("new-contract");}} onDelete={()=>{notify("Contract deleted");setPage("contracts");}}/>{c.status === "Approved" && <button onClick={() => setPage("generate-invoice")} className="btn-primary"><ReceiptText size={17} />Generate invoice</button>}</div>} />
    <div className="panel mb-5 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><Badge>{c.status}</Badge><p className="mt-2 text-xs text-slate-400">Last updated 18 Sep 2026, 4:32 PM</p></div><div className="flex min-w-[500px] max-w-2xl flex-1 items-center">{["Draft", "Submitted", "Approved"].map((x, i) => <div key={x} className="flex flex-1 items-center last:flex-none"><div className="text-center"><span className={`mx-auto grid h-8 w-8 place-items-center rounded-full ${i < (c.status === "Approved" ? 3 : 2) ? "bg-moss-600 text-white" : "bg-slate-100 text-slate-400"}`}><Check size={14} /></span><p className="mt-1 text-[10px] font-bold">{x}</p></div>{i < 2 && <div className={`mx-2 h-px flex-1 ${i < (c.status === "Approved" ? 2 : 1) ? "bg-moss-500" : "bg-slate-200"}`} />}</div>)}</div></div></div>
    <div className="panel mb-5 inline-flex gap-1 p-1.5">
      <button type="button" onClick={() => setTab("summary")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === "summary" ? "bg-ink text-white shadow" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><LayoutList size={16} />Summary</button>
      <button type="button" onClick={() => setTab("document")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === "document" ? "bg-ink text-white shadow" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><FileText size={16} />Documents{c.documents?.length > 0 && <span className={`rounded-full px-2 py-0.5 text-[10px] ${tab === "document" ? "bg-white/15 text-white" : "bg-moss-50 text-moss-700"}`}>{c.documents.length}</span>}</button>
      <button type="button" onClick={() => setTab("history")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === "history" ? "bg-ink text-white shadow" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><History size={16} />Version history{versionItems.length > 0 && <span className={`rounded-full px-2 py-0.5 text-[10px] ${tab === "history" ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"}`}>{versionItems.length}</span>}</button>
    </div>
    {tab === "summary" ? <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><div className="panel p-6"><h2 className="text-lg font-bold">Commercial summary</h2><div className="mt-5 grid gap-6 sm:grid-cols-2">{[["Billing model", c.model], ["Contract value", c.value], ["Effective date", "01 Oct 2026"], ["Contract end", "30 Sep 2027"], ["Payment terms", "Net 30 days"], ["Tax assignments", `${Object.keys(c.taxAssignments || {}).length} billable line(s)`]].map(([a,b]) => <div key={a}><p className="text-xs text-slate-400">{a}</p><p className="mt-1 text-sm font-semibold">{b}</p></div>)}</div><div className="my-6 border-t" /><h3 className="font-bold">{c.model === "Project" ? "Milestone billing rules" : "Billing configuration"}</h3>{(c.milestones || []).map((milestone, i) => <div key={milestone.id} className="mt-3 flex items-center rounded-xl bg-slate-50 p-3 text-sm"><span className="mr-3 grid h-7 w-7 place-items-center rounded-lg bg-white text-xs font-bold shadow-sm">{i+1}</span><span className="font-medium">{milestone.name} · {milestone.label}</span><span className="ml-auto font-bold">{money(milestone.amount, milestone.currency)}</span></div>)}</div>
      <div className="space-y-5"><div className="panel p-5"><div className="flex items-center justify-between"><h3 className="font-bold">Tax assignments</h3><span className="rounded-full bg-moss-50 px-2.5 py-1 text-[10px] font-bold text-moss-700">{Object.keys(c.taxAssignments || {}).length} assigned</span></div><div className="mt-4 space-y-3">{(c.milestones || []).map((milestone) => {
        const assignment = c.taxAssignments?.[milestone.id];
        const result = assignment?.resultSnapshot;
        return <div key={milestone.id} className="rounded-xl border p-4"><p className="text-xs font-bold text-slate-700">{milestone.name}</p><p className="mt-1 text-xs font-semibold text-moss-700">{assignment?.mode === "EXEMPT" ? "Exempt / no tax" : assignment?.ruleSetId}</p><div className="mt-3 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-wide text-slate-400">Tax</p><p className="text-sm font-bold">{money(result?.taxTotalDecimal, result?.currency)}</p></div><div className="text-right"><p className="text-[10px] uppercase tracking-wide text-slate-400">Total</p><p className="text-lg font-bold">{money(result?.totalDecimal, result?.currency)}</p></div></div>{result?.lines?.length > 0 && <details className="mt-3 border-t pt-3"><summary className="cursor-pointer text-xs font-bold text-slate-500">Technical tax chain</summary><div className="mt-2 space-y-1">{result.lines.map((line) => <p key={line.id} className="text-[11px] text-slate-500">{line.calculationOrder}. {line.taxCode} · {line.treatmentId} · {money(line.amountDecimal, result.currency)}</p>)}</div></details>}{assignment?.overrideReason && <p className="mt-3 border-t pt-3 text-[11px] text-amber-700">Reason: {assignment.overrideReason}</p>}</div>;
      })}</div></div><div className="panel p-5"><h3 className="font-bold">Notifications</h3><div className="mt-4 space-y-3">{["Milestone due · 7 days before", "Invoice generated · Immediately", "Expiry · 30 days before"].map((x) => <div className="flex gap-2 text-sm text-slate-600" key={x}><CheckCircle2 className="text-moss-500" size={16} />{x}</div>)}</div></div></div></div> : tab === "document" ? <ContractDocument initialDocuments={c.documents} requestedDocument={selectedVersionDocument} contractId={c.id} notify={notify} /> : <VersionHistory items={versionItems} onView={viewVersion} title="Contract version history" />}
  </>;
}
export default ContractDetail;
