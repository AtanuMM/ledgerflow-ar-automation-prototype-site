import { useState } from "react";
import { CalendarRange, ChevronDown, Filter, Plus, Search, ShieldCheck } from "lucide-react";
import ActionMenu from "../../../components/ui/ActionMenu";
import { catalog, describeTreatment, directionOf, ruleSetSearchText, statusOf } from "./taxAdminUtils";

const tone = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-amber-50 text-amber-700",
};

function Segmented({ value, onChange }) {
  return <div className="inline-flex rounded-xl bg-slate-100 p-1">
    {["Sale", "Purchase"].map((item) => <button key={item} onClick={() => onChange(item)} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${value === item ? "bg-white text-ink shadow-sm" : "text-slate-500"}`}>{item}</button>)}
  </div>;
}

function RuleSetsView({ ruleSets, onAdd, onEdit, onDelete }) {
  const [direction, setDirection] = useState("Sale");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [period, setPeriod] = useState("");
  const [sort, setSort] = useState("priority");

  const visible = ruleSets
    .filter((set) => directionOf(set) === direction)
    .filter((set) => status === "All" || statusOf(set) === status)
    .filter((set) => !query || ruleSetSearchText(set).includes(query.toLowerCase()))
    .filter((set) => !period || set.rules.some((rule) => rule.effectiveFrom <= period && (!rule.effectiveTo || rule.effectiveTo >= period)))
    .map((set) => ({ ...set, rules: [...set.rules].sort((a, b) => sort === "order" ? a.calculationOrder - b.calculationOrder : b.priority - a.priority) }));

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div><h2 className="text-xl font-bold">Rule sets</h2><p className="mt-1 text-sm text-slate-500">Rank, schedule and audit the rules used to resolve tax.</p></div>
      <button className="btn-primary" onClick={() => onAdd(direction)}><Plus size={16}/>Add rule</button>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Segmented value={direction} onChange={setDirection}/>
      {direction === "Purchase" && <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">Prototype purchase/import rules</span>}
    </div>
    <div className="grid gap-2 rounded-2xl border bg-slate-50/70 p-3 md:grid-cols-[1.5fr_.8fr_1fr_1fr]">
      <label className="relative"><Search size={16} className="absolute left-3 top-3.5 text-slate-400"/><input className="field !mt-0 !py-2.5 pl-9" placeholder="Search name, code, jurisdiction…" value={query} onChange={(e) => setQuery(e.target.value)}/></label>
      <label className="relative"><Filter size={15} className="absolute left-3 top-3.5 text-slate-400"/><select className="field !mt-0 !py-2.5 pl-9" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>ACTIVE</option><option>DRAFT</option></select></label>
      <label className="relative"><CalendarRange size={15} className="absolute left-3 top-3.5 text-slate-400"/><input aria-label="Effective on" type="date" className="field !mt-0 !py-2.5 pl-9" value={period} onChange={(e) => setPeriod(e.target.value)}/></label>
      <label className="relative"><ChevronDown size={15} className="pointer-events-none absolute right-3 top-3.5 text-slate-400"/><select className="field !mt-0 !py-2.5" value={sort} onChange={(e) => setSort(e.target.value)}><option value="priority">Priority</option><option value="order">Calculation order</option></select></label>
    </div>
    <div className="space-y-3">
      {visible.map((set) => <div key={set.id} className="overflow-hidden rounded-2xl border bg-white">
        <div className="flex flex-wrap items-start gap-3 p-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-moss-50 text-moss-700"><ShieldCheck size={19}/></div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{set.name}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tone[statusOf(set)] || tone.DRAFT}`}>{statusOf(set)}</span>{set.prototype && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">PROTOTYPE</span>}</div><p className="mt-1 text-xs text-slate-400">{set.code} · {catalog.jurisdictions[set.jurisdictionId]?.name} · {set.currency}</p></div>
          <ActionMenu onEdit={() => onEdit(set, set.rules[0]?.id)} onDelete={() => onDelete(set.id, set.name)} editLabel="Edit first rule"/>
        </div>
        <div className="overflow-x-auto border-t">
          <table className="w-full min-w-[760px]"><thead className="bg-slate-50/80"><tr>{["Rule / treatment","Priority","Order","Effective period","Base type",""].map((label) => <th className="table-head" key={label}>{label}</th>)}</tr></thead>
            <tbody>{set.rules.map((rule) => { const detail = describeTreatment(rule.treatmentId); return <tr key={rule.id}>
              <td className="table-cell"><div className="font-semibold">{detail.label}</div><div className="mt-1 font-mono text-[11px] text-slate-400">{rule.id}</div></td>
              <td className="table-cell font-bold text-slate-700">{rule.priority}</td><td className="table-cell text-slate-600">{rule.calculationOrder}</td>
              <td className="table-cell text-slate-500">{rule.effectiveFrom} → {rule.effectiveTo || "Open ended"}</td><td className="table-cell text-slate-500">{detail.treatment?.baseType?.replaceAll("_", " ")}</td><td className="table-cell"><ActionMenu onEdit={() => onEdit(set, rule.id)} onDelete={() => onDelete(set.id, set.name)} editLabel="Edit rule" deleteLabel="Delete set"/></td>
            </tr>; })}</tbody>
          </table>
        </div>
      </div>)}
      {!visible.length && <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No rule sets match these filters.</div>}
    </div>
  </div>;
}

export default RuleSetsView;
