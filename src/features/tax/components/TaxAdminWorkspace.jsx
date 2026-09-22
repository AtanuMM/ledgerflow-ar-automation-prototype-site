import { useState } from "react";
import { Beaker, Globe2, Percent, ScrollText, ShieldOff } from "lucide-react";
import { ruleSets as seededRuleSets } from "../data";
import RuleEditorDrawer from "./RuleEditorDrawer";
import RuleSetsView from "./RuleSetsView";
import TaxSimulator from "./TaxSimulator";
import { ExemptionsView, JurisdictionsView, TaxesRatesView } from "./TaxCatalogViews";

const views = [
  { id: "rules", label: "Rule sets", icon: ScrollText },
  { id: "taxes", label: "Taxes & rates", icon: Percent },
  { id: "jurisdictions", label: "Jurisdictions & treatments", icon: Globe2 },
  { id: "exemptions", label: "Exemptions", icon: ShieldOff },
  { id: "simulator", label: "Tax simulator", icon: Beaker },
];

function TaxAdminWorkspace({ notify }) {
  const [view, setView] = useState("rules");
  const [ruleSets, setRuleSets] = useState(seededRuleSets);
  const [drawer, setDrawer] = useState(null);
  const [newDirection, setNewDirection] = useState("Sale");
  const removeRuleSet = (id, name) => {
    setRuleSets((current) => current.filter((item) => item.id !== id));
    notify(`${name} deleted`);
  };
  const saveRuleSet = (next, editing) => {
    setRuleSets((current) => editing ? current.map((item) => item.id === next.id ? next : item) : [next, ...current]);
    setDrawer(null);
    notify(`${next.name} ${editing ? "updated" : "added"}`);
  };

  return <div className="space-y-5">
    <div className="overflow-x-auto rounded-2xl border bg-white p-1.5"><div className="flex min-w-max gap-1">{views.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${view === id ? "bg-ink text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon size={16}/>{label}</button>)}</div></div>
    <div className="panel p-5 sm:p-7">
      {view === "rules" && <RuleSetsView ruleSets={ruleSets} onAdd={(direction) => { setNewDirection(direction); setDrawer({ new: true }); }} onEdit={(ruleSet, ruleId) => setDrawer({ ruleSet, ruleId })} onDelete={removeRuleSet}/>}
      {view === "taxes" && <TaxesRatesView notify={notify}/>}
      {view === "jurisdictions" && <JurisdictionsView notify={notify}/>}
      {view === "exemptions" && <ExemptionsView notify={notify}/>}
      {view === "simulator" && <TaxSimulator/>}
    </div>
    <RuleEditorDrawer open={Boolean(drawer)} ruleSet={drawer?.ruleSet || null} ruleId={drawer?.ruleId} direction={newDirection} onClose={() => setDrawer(null)} onSave={saveRuleSet}/>
  </div>;
}

export default TaxAdminWorkspace;
