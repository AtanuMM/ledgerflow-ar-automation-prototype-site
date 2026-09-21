import { ArrowRight, CircleDollarSign, Clock3, FileCheck2, FileText, Plus, ReceiptText } from "lucide-react";
import { contracts } from "../data/mockData";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import PageHead from "../components/ui/PageHead";

function OverviewPage({ setPage }) {
  return <>
    <PageHead eyebrow="Monday, 21 September" title="Good afternoon, Atanu" desc="Here’s what needs your attention across contracts and invoicing." action={<button onClick={() => setPage("new-contract")} className="btn-primary"><Plus size={17} />New contract</button>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[["Active contracts", "28", "+4 this month", FileCheck2, "bg-moss-50 text-moss-600"], ["Pending approval", "2", "Needs attention", Clock3, "bg-amber-50 text-amber-600"], ["Invoices this month", "₹74.2L", "12 generated", ReceiptText, "bg-blue-50 text-blue-600"], ["Outstanding", "₹21.8L", "4 invoices", CircleDollarSign, "bg-violet-50 text-violet-600"]].map(([l, v, s, Icon, c]) => <div className="panel p-5" key={l}><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{l}</p><p className="mt-3 text-3xl font-bold">{v}</p></div><div className={`grid h-11 w-11 place-items-center rounded-xl ${c}`}><Icon size={20} /></div></div><p className="mt-3 text-xs font-semibold text-slate-400">{s}</p></div>)}
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
      <div className="panel overflow-hidden"><div className="flex items-center justify-between p-5"><div><h2 className="text-lg font-bold">Recent contracts</h2><p className="text-sm text-slate-400">Latest commercial activity</p></div><button onClick={() => setPage("contracts")} className="btn-ghost">View all <ArrowRight size={15} /></button></div>
        <div className="overflow-x-auto"><table className="w-full"><tbody>{contracts.slice(0, 4).map((c) => <tr key={c.id} className="hover:bg-slate-50"><td className="table-cell"><div className="flex items-center gap-3"><Avatar name={c.customer} /><div><p className="font-semibold">{c.customer}</p><p className="text-xs text-slate-400">{c.id}</p></div></div></td><td className="table-cell"><Badge>{c.model}</Badge></td><td className="table-cell font-semibold">{c.value}</td><td className="table-cell"><Badge>{c.status}</Badge></td></tr>)}</tbody></table></div>
      </div>
      <div className="panel p-5"><h2 className="text-lg font-bold">Needs attention</h2><p className="mb-5 text-sm text-slate-400">Two items are waiting on you</p>
        <div className="space-y-3">{[["Capital Retail contract", "Approval pending for 5 days", FileText, "bg-amber-50 text-amber-600"], ["Northline invoice", "€125,000 · Review tax treatment", ReceiptText, "bg-violet-50 text-violet-600"]].map(([a, b, Icon, c]) => <button key={a} onClick={() => setPage("approvals")} className="flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:border-moss-500/40 hover:bg-moss-50/40"><div className={`grid h-10 w-10 place-items-center rounded-xl ${c}`}><Icon size={18} /></div><div><p className="text-sm font-semibold">{a}</p><p className="text-xs text-slate-400">{b}</p></div><ArrowRight className="ml-auto text-slate-300" size={16} /></button>)}</div>
      </div>
    </div>
  </>;
}
export default OverviewPage;
