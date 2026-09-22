import { useState } from "react";
import { Check } from "lucide-react";
import Badge from "../components/ui/Badge";
import Field from "../components/ui/Field";
import PageHead from "../components/ui/PageHead";
import { contracts, invoices } from "../data/mockData";
import InvoicePaper from "../features/invoices/InvoicePaper";
import { formatMoney } from "../features/tax/utils/taxEngine";

function ApprovalsPage({ notify }) {
  const [tab, setTab] = useState("Contracts");
  const [done, setDone] = useState(false);
  const contract = contracts.find((item) => item.status === "Pending Approval");
  const contractAssignment = contract.taxAssignments[contract.milestones[0].id];
  const contractTax = contractAssignment.resultSnapshot.lines.map((line) => line.taxName).join(" → ") || "Exempt / zero tax";
  const invoice = invoices.find((item) => item.status === "Pending Approval");
  const snapshot = invoice.taxAssignment.resultSnapshot;
  return <><PageHead eyebrow="Review queue" title="Approvals" desc="Review commercial terms and generated invoices before they become final." /><div className="mb-5 inline-flex rounded-xl bg-slate-200/60 p-1">{["Contracts","Invoices"].map((x)=><button onClick={()=>{setTab(x);setDone(false);}} key={x} className={`rounded-lg px-4 py-2 text-sm font-bold ${tab===x?"bg-white shadow text-ink":"text-slate-500"}`}>{x} <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">1</span></button>)}</div>
    {done ? <div className="panel grid min-h-80 place-items-center p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-moss-50 text-moss-600"><Check size={25}/></div><h2 className="mt-4 text-xl font-bold">All done here</h2><p className="mt-2 text-sm text-slate-400">This item has been approved and the owner was notified.</p></div></div> :
    <div className="grid gap-5 lg:grid-cols-[330px_1fr]"><div className="panel h-fit p-3"><div className="rounded-xl border-2 border-moss-500 bg-moss-50/40 p-4"><div className="flex justify-between"><Badge>Pending Approval</Badge><span className="text-xs text-slate-400">5d</span></div><p className="mt-4 font-bold">{tab==="Contracts"?contract.customer:invoice.customer}</p><p className="mt-1 text-xs text-slate-400">{tab==="Contracts"?`${contract.id} · ${contract.model}`:`${invoice.no} · ${invoice.model}`}</p><p className="mt-4 text-lg font-bold">{tab==="Contracts"?contract.value:formatMoney(invoice.totalDecimal, invoice.currency)}</p></div></div>{tab==="Contracts" ? <div className="panel p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-moss-600">Contract review</p><h2 className="mt-1 text-2xl font-bold">Retail commerce transformation</h2></div><Badge>Pending Approval</Badge></div><div className="my-6 border-t"/><div className="grid gap-5 sm:grid-cols-3">{[["Customer",contract.customer],["Billing model",contract.model],["Tax chain",contractTax],["Rule version",contractAssignment.ruleSetVersionId],["Billing entity",contract.entity],["Submitted by","Atanu Dey"]].map(([a,b])=><div key={a}><p className="text-xs text-slate-400">{a}</p><p className="mt-1 text-sm font-semibold">{b}</p></div>)}</div><Field label="Approval comment (optional)"><textarea className="field min-h-24" placeholder="Add context for the submitter..."/></Field><ApprovalActions tab={tab} setDone={setDone} notify={notify}/></div> : <div className="space-y-4"><div className="panel p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-moss-600">Invoice review</p><h2 className="mt-1 text-xl font-bold">{invoice.lineItem.description}</h2></div><Badge>{invoice.status}</Badge></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{[["Subtotal",formatMoney(invoice.subtotalDecimal, invoice.currency)],["Tax",formatMoney(invoice.taxTotalDecimal, invoice.currency)],["Total",formatMoney(invoice.totalDecimal, invoice.currency)],["Treatment",snapshot.treatment.replaceAll("_", " ")],["Rule version",snapshot.ruleSetVersionId || "Exemption snapshot"],["Evidence",snapshot.evidence.exemptionReason || snapshot.evidence.source]].map(([a,b])=><div key={a}><p className="text-xs text-slate-400">{a}</p><p className="mt-1 text-sm font-semibold">{b}</p></div>)}</div></div><InvoicePaper {...invoice} taxLines={snapshot.lines}/><div className="panel p-5"><Field label="Approval comment (optional)"><textarea className="field min-h-24" placeholder="Add context for the submitter..."/></Field><ApprovalActions tab={tab} setDone={setDone} notify={notify}/></div></div>}</div>}</>;
}

function ApprovalActions({ tab, setDone, notify }) {
  return <div className="mt-5 flex justify-end gap-3"><button onClick={()=>notify(`${tab.slice(0,-1)} sent back for changes`)} className="btn-secondary !text-rose-600">Reject</button><button onClick={()=>{setDone(true);notify(`${tab.slice(0,-1)} approved successfully`);}} className="btn-primary"><Check size={16}/>Approve</button></div>;
}

export default ApprovalsPage;
