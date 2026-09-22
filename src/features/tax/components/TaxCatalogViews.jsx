import { useState } from "react";
import { Globe2, Plus, ReceiptText, ShieldOff } from "lucide-react";
import ActionMenu from "../../../components/ui/ActionMenu";
import { components, exemptions as seedExemptions, jurisdictions, rates, taxes, treatments } from "../data";
import { catalog, pretty } from "./taxAdminUtils";

const treatmentLabels = ["Standard", "Zero-rated", "Exempt", "Reverse charge"];
const relationLabels = ["Local", "Interstate", "International"];

function SectionHead({ title, description, action, onAdd }) {
  return <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div><button className="btn-primary" onClick={onAdd}><Plus size={16}/>Add {action}</button></div>;
}

export function TaxesRatesView({ notify }) {
  const [items, setItems] = useState(() => taxes.map((tax) => {
    const treatment = treatments.find((item) => item.taxId === tax.id);
    return { ...tax, treatment, rate: catalog.rates[treatment?.rateId], components: components.filter((item) => item.taxId === tax.id) };
  }));
  const remove = (item) => { setItems((current) => current.filter(({ id }) => id !== item.id)); notify(`${item.name} deleted`); };
  const add = () => { const item = { id: `local-tax-${Date.now()}`, name: "New draft tax", code: "DRAFT_TAX", category: "VAT", rate: rates[0], components: [], treatment: { calculationType: "PERCENTAGE" } }; setItems((current) => [...current, item]); notify("Draft tax added"); };
  const edit = (item) => { setItems((current) => current.map((row) => row.id === item.id ? { ...row, name: `${row.name} (edited)` } : row)); notify(`${item.name} updated`); };
  return <div className="space-y-5"><SectionHead title="Taxes & rates" description="Reusable tax definitions, rate types and invoice components." action="tax" onAdd={add}/>
    <div className="overflow-x-auto rounded-2xl border"><table className="w-full min-w-[800px]"><thead className="bg-slate-50"><tr>{["Tax","Type / rate","Currency","Components","Effective dates",""].map((item) => <th key={item} className="table-head">{item}</th>)}</tr></thead>
      <tbody>{items.map((item) => <tr key={item.id}><td className="table-cell"><p className="font-bold">{item.name}</p><p className="mt-1 font-mono text-[11px] text-slate-400">{item.code}</p></td><td className="table-cell"><p className="font-semibold">{pretty(item.rate?.kind || item.treatment?.calculationType)}</p><p className="text-xs text-slate-400">{item.rate?.kind === "FIXED" ? item.rate.value : `${item.rate?.value || "—"}%`}</p></td><td className="table-cell text-slate-500">{item.rate?.currency || "Rule set currency"}</td><td className="table-cell"><div className="flex flex-wrap gap-1">{item.components.length ? item.components.map((part) => <span key={part.id} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{part.code}</span>) : <span className="text-slate-400">None</span>}</div></td><td className="table-cell text-slate-500">01 Jan 2026 → Open ended</td><td className="table-cell"><ActionMenu onEdit={() => edit(item)} onDelete={() => remove(item)}/></td></tr>)}</tbody>
    </table></div>
  </div>;
}

export function JurisdictionsView({ notify }) {
  return <div className="space-y-5"><SectionHead title="Jurisdictions & treatments" description="Define relationship-specific treatment policy by tax jurisdiction." action="mapping" onAdd={() => notify("Draft jurisdiction mapping added")}/>
    <div className="grid gap-4 lg:grid-cols-2">{jurisdictions.map((item, index) => <div key={item.id} className="rounded-2xl border bg-white p-5">
      <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Globe2 size={19}/></div><div><h3 className="font-bold">{item.name}</h3><p className="mt-1 text-xs text-slate-400">{item.code} · {index === 3 ? "Prototype" : "Active"}</p></div><div className="ml-auto"><ActionMenu onEdit={() => notify(`Editing ${item.name}`)} onDelete={() => notify(`${item.name} mapping deleted`)}/></div></div>
      <div className="mt-5 space-y-2">{relationLabels.map((relation, relationIndex) => <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5" key={relation}><span className="text-sm font-semibold text-slate-600">{relation}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${relationIndex === 2 ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>{treatmentLabels[(index + relationIndex) % treatmentLabels.length]}</span></div>)}</div>
    </div>)}</div>
  </div>;
}

export function ExemptionsView({ notify }) {
  const seeded = [...seedExemptions, { id: "ui.zero", jurisdictionId: "jurisdiction.gb", name: "Exported services", effect: "ZERO_RATED" }, { id: "ui.reverse", jurisdictionId: "jurisdiction.ae", name: "Registered overseas customer", effect: "REVERSE_CHARGE" }];
  const [items, setItems] = useState(seeded);
  const add = () => { setItems((current) => [...current, { id: `local-${Date.now()}`, jurisdictionId: jurisdictions[0].id, name: "New exemption", effect: "EXEMPT" }]); notify("Draft exemption added"); };
  return <div className="space-y-5"><SectionHead title="Exemptions" description="Maintain evidence-driven exceptions and non-standard outcomes." action="exemption" onAdd={add}/>
    <div className="grid gap-3">{items.map((item) => <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-4" key={item.id}><div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"><ShieldOff size={17}/></div><div className="min-w-[190px] flex-1"><p className="font-bold">{item.name}</p><p className="mt-1 text-xs text-slate-400">{catalog.jurisdictions[item.jurisdictionId]?.name}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{pretty(item.effect)}</span><ActionMenu onEdit={() => { setItems((current) => current.map((row) => row.id === item.id ? { ...row, name: `${row.name} (edited)` } : row)); notify(`${item.name} updated`); }} onDelete={() => { setItems((current) => current.filter((row) => row.id !== item.id)); notify(`${item.name} deleted`); }}/></div>)}</div>
  </div>;
}
