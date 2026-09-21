import { useState } from "react";
import { Plus } from "lucide-react";
import ActionMenu from "../components/ui/ActionMenu";
import PageHead from "../components/ui/PageHead";

const taxRules = [
  ["India","West Bengal","CGST + SGST","9% + 9%","Intra-state"],
  ["India","All other states","IGST","18%","Inter-state from WB"],
  ["Netherlands","—","Export / VAT","0%","Reverse charge"],
  ["Germany","—","Export / VAT","0%","Reverse charge"],
];

const sectionItems = {
  "Billing entities": ["Matrix Media Solutions — India (West Bengal)","Matrix Media — Singapore","Matrix Media — USA"],
  "Template mapping": ["Project → Milestone service invoice","SaaS → Subscription invoice","License → Software license invoice"],
  "Invoice numbering": ["India entity → MM-IN-WB-0001","Singapore entity → MM-SG-0001","USA entity → MM-US-0001"],
  "Default notifications": ["Milestone due → 7 days before","Invoice generated → Immediately","Contract expiry → 30 days before"],
};

function SettingsPage({ notify }) {
  const [section, setSection] = useState("Tax rules");
  const [deleted, setDeleted] = useState([]);
  const sections = ["Tax rules","Billing entities","Template mapping","Invoice numbering","Default notifications"];
  const remove = (key, label) => {
    setDeleted((items) => [...items, key]);
    notify(`${label} deleted`);
  };
  const visibleTaxRules = taxRules.filter((rule) => !deleted.includes(`tax-${rule.join("-")}`));
  const visibleItems = (sectionItems[section] || []).filter((item) => !deleted.includes(`${section}-${item}`));
  return <><PageHead eyebrow="Workspace configuration" title="Tax & invoice rules" desc="Control how LedgerFlow chooses tax treatment and formats every invoice." action={<button onClick={()=>notify("Settings saved")} className="btn-primary">Save changes</button>}/><div className="grid gap-5 lg:grid-cols-[230px_1fr]"><div className="panel h-fit p-2">{sections.map((x)=><button onClick={()=>setSection(x)} key={x} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold ${section===x?"bg-ink text-white":"text-slate-500 hover:bg-slate-50"}`}>{x}</button>)}</div><div className="panel p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold">{section}</h2><p className="mt-1 text-sm text-slate-400">Editable workspace defaults used across all new contracts.</p></div><button onClick={()=>notify(`New ${section==="Tax rules"?"rule":"item"} ready to configure`)} className="btn-secondary"><Plus size={15}/>Add {section==="Tax rules"?"rule":"item"}</button></div>{section==="Tax rules" ? <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[650px]"><thead className="bg-slate-50"><tr>{["Country","State / Region","Tax type","Rate","Notes",""].map((x)=><th className="table-head" key={x}>{x}</th>)}</tr></thead><tbody>{visibleTaxRules.map((r)=>{const key=`tax-${r.join("-")}`;return <tr key={key}>{r.map((x,i)=><td className={`table-cell ${i===0?"font-semibold":"text-slate-500"}`} key={i}>{x}</td>)}<td className="table-cell"><ActionMenu onEdit={()=>notify(`Editing ${r[0]} tax rule`)} onDelete={()=>remove(key, `${r[0]} tax rule`)}/></td></tr>;})}</tbody></table></div> : <div className="space-y-3">{visibleItems.map((x,i)=>{const key=`${section}-${x}`;return <div key={x} className="flex items-center rounded-xl border p-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-bold">{i+1}</span><span className="ml-3 text-sm font-semibold">{x}</span><div className="ml-auto"><ActionMenu onEdit={()=>notify(`Editing ${x}`)} onDelete={()=>remove(key, x)}/></div></div>;})}</div>}</div></div></>;
}
export default SettingsPage;
