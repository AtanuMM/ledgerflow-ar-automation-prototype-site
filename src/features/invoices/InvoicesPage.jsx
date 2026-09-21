import { useState } from "react";
import { Plus } from "lucide-react";
import { invoices } from "../../data/mockData";
import Badge from "../../components/ui/Badge";
import FilterBar from "../../components/ui/FilterBar";
import PageHead from "../../components/ui/PageHead";

function InvoicesPage({ setPage, setSelected }) {
  const [search, setSearch] = useState("");
  const filtered = invoices.filter((i) => `${i.customer} ${i.no}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHead eyebrow="Invoice automation" title="Invoices" desc="Generate, approve and track invoices from contract rules." action={<button onClick={() => setPage("generate-invoice")} className="btn-primary"><Plus size={17} />Generate invoice</button>} /><FilterBar search={search} setSearch={setSearch} /><div className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[1000px]"><thead className="bg-slate-50"><tr>{["Invoice & customer","Contract","Model","Amount","Tax","Total","Status","Due"].map((x)=><th className="table-head" key={x}>{x}</th>)}</tr></thead><tbody>{filtered.map((i)=><tr key={i.no} onClick={() => { setSelected(i); setPage("invoice-detail"); }} className="cursor-pointer hover:bg-slate-50"><td className="table-cell"><p className="font-semibold">{i.no}</p><p className="text-xs text-slate-400">{i.customer}</p></td><td className="table-cell text-slate-500">{i.contract}</td><td className="table-cell"><Badge>{i.model}</Badge></td><td className="table-cell">{i.amount}</td><td className="table-cell text-slate-500">{i.tax}</td><td className="table-cell font-bold">{i.total}</td><td className="table-cell"><Badge>{i.status}</Badge></td><td className="table-cell text-slate-500">{i.due}</td></tr>)}</tbody></table></div></div></>;
}
export default InvoicesPage;
