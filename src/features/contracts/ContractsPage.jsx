import { useState } from "react";
import { Plus } from "lucide-react";
import { contracts } from "../../data/mockData";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import FilterBar from "../../components/ui/FilterBar";
import PageHead from "../../components/ui/PageHead";

function ContractsPage({ setPage, setSelected }) {
  const [search, setSearch] = useState("");
  const filtered = contracts.filter((c) => `${c.customer} ${c.id}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <PageHead eyebrow="Commercial capture" title="Contracts" desc="Create, configure and track every commercial agreement." action={<button onClick={() => setPage("new-contract")} className="btn-primary"><Plus size={17} />New contract</button>} />
    <FilterBar search={search} setSearch={setSearch} />
    <div className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[950px]"><thead className="bg-slate-50/70"><tr>{["Contract & customer", "Billing model", "Entity", "Contract value", "Status", "Created"].map((h) => <th className="table-head" key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map((c) => <tr key={c.id} onClick={() => { setSelected(c); setPage("contract-detail"); }} className="cursor-pointer hover:bg-slate-50/80"><td className="table-cell"><div className="flex items-center gap-3"><Avatar name={c.customer} /><div><p className="font-semibold text-slate-800">{c.customer}</p><p className="mt-0.5 text-xs text-slate-400">{c.id} · {c.location}</p></div></div></td><td className="table-cell"><Badge>{c.model}</Badge></td><td className="table-cell text-slate-600">{c.entity}</td><td className="table-cell font-semibold">{c.value}</td><td className="table-cell"><Badge>{c.status}</Badge></td><td className="table-cell text-slate-500">{c.date}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t px-5 py-3 text-xs text-slate-400"><span>Showing {filtered.length} of 28 contracts</span><span>1 — 5 of 28</span></div></div>
  </>;
}
export default ContractsPage;
