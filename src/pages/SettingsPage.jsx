import { useState } from "react";
import { Building2, FileCog, Hash, Plus, ReceiptText, Send } from "lucide-react";
import ActionMenu from "../components/ui/ActionMenu";
import PageHead from "../components/ui/PageHead";
import TaxAdminWorkspace from "../features/tax/components/TaxAdminWorkspace";

const sectionItems = {
  "Billing entities": ["Matrix Media Solutions — India (West Bengal)","Matrix Media — Singapore","Matrix Media — USA"],
  "Template mapping": ["Project → Milestone service invoice","SaaS → Subscription invoice","License → Software license invoice"],
  "Invoice numbering": ["India entity → MM-IN-WB-0001","Singapore entity → MM-SG-0001","USA entity → MM-US-0001"],
  "Default notifications": ["Milestone due → 7 days before","Invoice generated → Immediately","Contract expiry → 30 days before"],
};

const invoiceSections = [
  { label: "Billing entities", icon: Building2 },
  { label: "Template mapping", icon: FileCog },
  { label: "Invoice numbering", icon: Hash },
  { label: "Default notifications", icon: Send },
];

function InvoiceSettings({ notify }) {
  const [section, setSection] = useState("Billing entities");
  const [deleted, setDeleted] = useState([]);
  const remove = (key, label) => {
    setDeleted((items) => [...items, key]);
    notify(`${label} deleted`);
  };
  const visibleItems = (sectionItems[section] || []).filter((item) => !deleted.includes(`${section}-${item}`));
  return <div className="grid gap-5 lg:grid-cols-[230px_1fr]"><div className="panel h-fit p-2">{invoiceSections.map(({ label, icon: Icon }) => <button onClick={() => setSection(label)} key={label} className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold ${section === label ? "bg-ink text-white" : "text-slate-500 hover:bg-slate-50"}`}><Icon size={16}/>{label}</button>)}</div>
    <div className="panel p-5 sm:p-7"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">{section}</h2><p className="mt-1 text-sm text-slate-400">Invoice defaults preserved separately from tax administration.</p></div><button onClick={() => notify(`New ${section.toLowerCase()} item ready`)} className="btn-secondary"><Plus size={15}/>Add item</button></div>
      <div className="space-y-3">{visibleItems.map((item, index) => { const key = `${section}-${item}`; return <div key={item} className="flex items-center rounded-xl border p-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-bold">{index + 1}</span><span className="ml-3 text-sm font-semibold">{item}</span><div className="ml-auto"><ActionMenu onEdit={() => notify(`Editing ${item}`)} onDelete={() => remove(key, item)}/></div></div>; })}</div>
    </div>
  </div>;
}

function SettingsPage({ notify }) {
  const [area, setArea] = useState("tax");
  return <><PageHead eyebrow="Workspace configuration" title="Tax & invoice settings" desc="Administer tax policy with traceable rules while keeping invoice defaults close at hand." action={<div className="inline-flex rounded-xl border bg-white p-1"><button onClick={() => setArea("tax")} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${area === "tax" ? "bg-ink text-white" : "text-slate-500"}`}><ReceiptText size={15}/>Tax admin</button><button onClick={() => setArea("invoice")} className={`rounded-lg px-3 py-2 text-sm font-bold ${area === "invoice" ? "bg-ink text-white" : "text-slate-500"}`}>Invoice defaults</button></div>}/>
    {area === "tax" ? <TaxAdminWorkspace notify={notify}/> : <InvoiceSettings notify={notify}/>}
  </>;
}
export default SettingsPage;
