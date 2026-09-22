import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Plus, Trash2, X } from "lucide-react";
import Field from "../../../components/ui/Field";
import { dependencies, dependencyGroups, treatments } from "../data";
import { validateDependencyGraph } from "../utils/taxEngine";
import { catalog, conditionsForRule, describeTreatment, directionOf, pretty } from "./taxAdminUtils";

const emptyCondition = { field: "party.taxStatus", operator: "EQUALS", value: "TAXABLE" };

function dependencySourcesFor(treatmentId) {
  const treatment = catalog.treatments[treatmentId];
  if (treatment?.baseType === "ONE_TAX") return dependencies.filter((item) => item.targetTreatmentId === treatment.id).map((item) => item.sourceTreatmentId);
  if (treatment?.baseType === "SELECTED_TAX_SUM") return dependencyGroups.find((item) => item.id === treatment.dependencyGroupId)?.sourceTreatmentIds || [];
  return [];
}

function initialState(ruleSet, direction, ruleId) {
  const rule = ruleSet?.rules?.find((item) => item.id === ruleId) || ruleSet?.rules?.[0];
  const fallbackTreatment = direction === "Purchase" ? "treatment.prototype.fixed" : "treatment.ae.vat.standard";
  return {
    name: ruleSet?.name || `${direction} tax rule`,
    code: ruleSet?.code || `${direction.toUpperCase()}_NEW_RULE`,
    direction,
    jurisdictionId: ruleSet?.jurisdictionId || (direction === "Purchase" ? "jurisdiction.generic-inr" : "jurisdiction.ae"),
    currency: ruleSet?.currency || (direction === "Purchase" ? "INR" : "AED"),
    treatmentId: rule?.treatmentId || fallbackTreatment,
    priority: rule?.priority ?? 100,
    calculationOrder: rule?.calculationOrder ?? 10,
    effectiveFrom: rule?.effectiveFrom || "2026-01-01",
    effectiveTo: rule?.effectiveTo || "",
    conditions: rule ? conditionsForRule(rule) : [{ field: "transaction.type", operator: "EQUALS", value: direction.toUpperCase() }, emptyCondition],
  };
}

function RuleEditorDrawer({ open, ruleSet, ruleId, direction = "Sale", onClose, onSave }) {
  const [form, setForm] = useState(() => initialState(ruleSet, direction, ruleId));
  const [dependencySources, setDependencySources] = useState(() => dependencySourcesFor(form.treatmentId));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    if (open) {
      const next = initialState(ruleSet, ruleSet ? directionOf(ruleSet) : direction, ruleId);
      setForm(next);
      setDependencySources(dependencySourcesFor(next.treatmentId));
      setErrors([]);
      setShowAdvanced(false);
    }
  }, [open, ruleSet, ruleId, direction]);

  const detail = describeTreatment(form.treatmentId);
  const sourceIds = dependencySources;
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateCondition = (index, key, value) => setForm((current) => ({ ...current, conditions: current.conditions.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));

  if (!open) return null;
  const save = () => {
    const selectedGroup = form.direction === "Purchase" ? "condition-group.purchase.standard" : (ruleSet?.rules?.[0]?.conditionGroupId || "condition-group.ae.standard");
    const existingRule = ruleSet?.rules?.find((rule) => rule.id === ruleId) || ruleSet?.rules?.[0];
    const editedRule = {
      ...(existingRule || {}),
      id: existingRule?.id || `rule.local.${Date.now()}`,
      treatmentId: form.treatmentId,
      conditionGroupId: selectedGroup,
      priority: Number(form.priority),
      calculationOrder: Number(form.calculationOrder),
      effectiveFrom: form.effectiveFrom,
      effectiveTo: form.effectiveTo || null,
    };
    const next = {
      ...(ruleSet || {}),
      id: ruleSet?.id || `rule-set.local.${Date.now()}`,
      code: form.code,
      name: form.name,
      jurisdictionId: form.jurisdictionId,
      versionId: ruleSet?.versionId || "version.example.2026-01",
      currency: form.currency,
      precision: 2,
      prototype: form.direction === "Purchase" || ruleSet?.prototype,
      rules: ruleSet ? ruleSet.rules.map((rule) => rule.id === existingRule.id ? editedRule : rule) : [editedRule],
    };
    const validation = validateDependencyGraph(next);
    setErrors(validation.errors);
    if (validation.valid) onSave(next, Boolean(ruleSet));
  };

  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white/95 px-6 py-5 backdrop-blur">
        <div><p className="text-xs font-bold uppercase tracking-wider text-moss-700">{ruleSet ? "Edit rule set" : "New rule set"}</p><h2 className="mt-1 text-xl font-bold">{form.name}</h2></div>
        <button className="btn-ghost !p-2" onClick={onClose}><X size={19}/></button>
      </div>
      <div className="space-y-7 p-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Rule set name"><input className="field" value={form.name} onChange={(e) => update("name", e.target.value)}/></Field>
          <Field label="Code"><input className="field font-mono" value={form.code} onChange={(e) => update("code", e.target.value.toUpperCase().replace(/\s/g, "_"))}/></Field>
          <Field label="Flow"><select className="field" value={form.direction} onChange={(e) => update("direction", e.target.value)}><option>Sale</option><option>Purchase</option></select></Field>
          <Field label="Jurisdiction"><select className="field" value={form.jurisdictionId} onChange={(e) => update("jurisdictionId", e.target.value)}>{Object.values(catalog.jurisdictions).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
        </section>

        <section><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold">Match conditions</h3><p className="text-xs text-slate-400">All rows in this group must match (AND).</p></div><button className="btn-secondary !py-2" onClick={() => update("conditions", [...form.conditions, { ...emptyCondition }])}><Plus size={14}/>Condition</button></div>
          <div className="rounded-2xl border bg-slate-50/60 p-3">
            <div className="mb-2 inline-flex rounded-lg bg-ink px-2.5 py-1 text-[11px] font-bold text-white">ALL · AND</div>
            <div className="space-y-2">{form.conditions.map((condition, index) => <div key={`${condition.id || "new"}-${index}`} className="grid gap-2 rounded-xl border bg-white p-2 sm:grid-cols-[1.2fr_.8fr_1fr_auto]">
              <select className="field !mt-0 !py-2" value={condition.field} onChange={(e) => updateCondition(index, "field", e.target.value)}><option value="transaction.type">Transaction type</option><option value="party.taxStatus">Party tax status</option><option value="jurisdiction.code">Jurisdiction code</option><option value="product.taxCategory">Product tax category</option></select>
              <select className="field !mt-0 !py-2" value={condition.operator} onChange={(e) => updateCondition(index, "operator", e.target.value)}><option value="EQUALS">equals</option><option value="NOT_EQUALS">does not equal</option><option value="IN">is one of</option></select>
              <input className="field !mt-0 !py-2" value={condition.value} onChange={(e) => updateCondition(index, "value", e.target.value)}/>
              <button className="btn-ghost !p-2 text-rose-500" onClick={() => update("conditions", form.conditions.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15}/></button>
            </div>)}</div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Tax, rate & treatment"><select className="field" value={form.treatmentId} onChange={(e) => { update("treatmentId", e.target.value); setDependencySources(dependencySourcesFor(e.target.value)); }}>{treatments.map((item) => <option key={item.id} value={item.id}>{describeTreatment(item.id).label}</option>)}</select></Field>
          <Field label="Base type"><div className="field bg-slate-50 font-semibold">{pretty(detail.treatment?.baseType)}</div></Field>
          <Field label="Priority"><input type="number" className="field" value={form.priority} onChange={(e) => update("priority", e.target.value)}/></Field>
          <Field label="Calculation order"><input type="number" className="field" value={form.calculationOrder} onChange={(e) => update("calculationOrder", e.target.value)}/></Field>
          <Field label="Effective from"><input type="date" className="field" value={form.effectiveFrom} onChange={(e) => update("effectiveFrom", e.target.value)}/></Field>
          <Field label="Effective to" hint="Leave empty for open-ended"><input type="date" className="field" value={form.effectiveTo} onChange={(e) => update("effectiveTo", e.target.value)}/></Field>
        </section>

        <section className="rounded-2xl border p-4"><button className="flex w-full items-center justify-between text-left" onClick={() => setShowAdvanced((value) => !value)}><div><h3 className="font-bold">Dependency source</h3><p className="mt-1 text-xs text-slate-400">Configure tax-on-tax calculation inputs.</p></div><span className="text-sm font-bold text-moss-700">{showAdvanced ? "Hide" : "Configure"}</span></button>
          {showAdvanced && <div className="mt-4 border-t pt-4">
            <Field label={detail.treatment?.baseType === "SELECTED_TAX_SUM" ? "Selected-tax sum (multi-select)" : "Source treatment"}>
              <select multiple={detail.treatment?.baseType === "SELECTED_TAX_SUM"} className="field min-h-24" value={detail.treatment?.baseType === "SELECTED_TAX_SUM" ? sourceIds : sourceIds[0] || ""} onChange={(event) => setDependencySources(detail.treatment?.baseType === "SELECTED_TAX_SUM" ? [...event.target.selectedOptions].map((option) => option.value) : [event.target.value])}>{treatments.map((item) => <option key={item.id} value={item.id}>{describeTreatment(item.id).label}</option>)}</select>
            </Field>
            <p className="mt-2 text-xs text-slate-400">Prototype selection updates the dependency preview; saved engine dependencies remain anchored to the selected core treatment.</p>
          </div>}
        </section>

        <section><h3 className="font-bold">Calculation dependency</h3><div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="rounded-xl border bg-slate-50 px-4 py-3"><p className="text-[10px] font-bold uppercase text-slate-400">Step 0</p><p className="text-sm font-bold">Base amount</p></div>
          <ArrowRight size={16} className="text-slate-300"/>
          {sourceIds.map((id, index) => <div className="contents" key={id}><div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"><p className="text-[10px] font-bold uppercase text-blue-500">Tax {index + 1}</p><p className="text-sm font-bold text-blue-800">{describeTreatment(id).tax?.name}</p></div><ArrowRight size={16} className="text-slate-300"/></div>)}
          <div className="rounded-xl border border-moss-200 bg-moss-50 px-4 py-3"><p className="text-[10px] font-bold uppercase text-moss-600">Order {form.calculationOrder}</p><p className="text-sm font-bold text-moss-800">{detail.tax?.name}</p></div>
        </div></section>

        {errors.length > 0 && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">{errors.map((item) => <p className="flex gap-2 text-sm font-semibold text-rose-700" key={item.code}><AlertCircle size={16}/>{item.message}</p>)}</div>}
        {!errors.length && <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15}/>Dependency graph will be validated before saving.</p>}
      </div>
      <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white px-6 py-4"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={save}>Validate & save</button></div>
    </aside>
  </div>;
}

export default RuleEditorDrawer;
