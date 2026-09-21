import { ChevronDown, Filter, Search } from "lucide-react";

function FilterBar({ search, setSearch }) {
  return <div className="mb-4 flex flex-col gap-3 rounded-2xl border bg-white p-3 sm:flex-row sm:items-center">
    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or ID..." className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-moss-100" /></div>
    {["All statuses", "All billing models", "All entities"].map((x) => <button key={x} className="btn-secondary !justify-between !py-2.5">{x}<ChevronDown size={14} /></button>)}<button className="btn-ghost"><Filter size={16} />More filters</button>
  </div>;
}
export default FilterBar;
