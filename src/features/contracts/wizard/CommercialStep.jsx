import { useRef, useState } from "react";
import { AlertTriangle, Copy, Plus, Trash2 } from "lucide-react";
import Field from "../../../components/ui/Field";
import Toggle from "../../../components/ui/Toggle";
import { getMilestoneAmount, getMilestoneValidation } from "../../../utils/milestones";

function getContractTax(form) {
  if (form.country !== "India") return { label: "Export of Service · 0%", shortLabel: "export tax", rate: 0 };
  if (form.state === "West Bengal" && form.entity.includes("West Bengal")) {
    return { label: "CGST 9% + SGST 9%", shortLabel: "CGST + SGST", rate: 18 };
  }
  return { label: "IGST 18%", shortLabel: "IGST", rate: 18 };
}

function formatMoney(amount, currency) {
  const symbols = { INR: "₹", EUR: "€", USD: "$" };
  return `${symbols[currency] || `${currency} `}${Math.round(amount || 0).toLocaleString("en-IN")}`;
}

function MilestoneCard({ milestone, index, form, tax, update, duplicate, remove, cardRef }) {
  const amount = getMilestoneAmount(milestone, form.contractValue);
  const appliedTaxRate = milestone.taxRule === "no-tax" ? 0 : tax.rate;
  const taxAmount = (amount * appliedTaxRate) / 100;
  return <div ref={cardRef} className="scroll-mt-24 overflow-hidden rounded-2xl border">
    <div className="flex items-center justify-between bg-slate-50 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink text-xs font-bold text-white">{index + 1}</span>
        <span className="truncate text-sm font-bold">{milestone.name || "Untitled milestone"}</span>
      </div>
      <div className="flex gap-1">
        <button type="button" title="Duplicate milestone" onClick={duplicate} className="btn-ghost !p-2"><Copy size={15} /></button>
        <button type="button" title="Delete milestone" onClick={remove} className="btn-ghost !p-2 text-rose-500"><Trash2 size={15} /></button>
      </div>
    </div>
    <div className="grid gap-4 p-5 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Field label="Milestone name"><input data-milestone-name className="field" value={milestone.name} placeholder="e.g. Development phase" onChange={(event) => update({ name: event.target.value })} /></Field>
      </div>
      <div className="lg:col-span-3">
        <Field label="Due date"><input className="field" type="date" value={milestone.dueDate} onChange={(event) => update({ dueDate: event.target.value })} /></Field>
      </div>
      <div className="lg:col-span-4">
        <span className="label">Billing basis</span>
        <div className="mt-2 flex rounded-xl bg-slate-100 p-1">
          <button type="button" onClick={() => update({ basis: "fixed" })} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold ${milestone.basis === "fixed" ? "bg-white shadow" : "text-slate-400"}`}>Fixed amount</button>
          <button type="button" onClick={() => update({ basis: "percent" })} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold ${milestone.basis === "percent" ? "bg-white shadow" : "text-slate-400"}`}>% of value</button>
        </div>
      </div>
      <div className="lg:col-span-3">
        <Field label={milestone.basis === "percent" ? "Percentage" : "Fixed amount"}>
          <div className="relative">
            <input className="field pr-10" type="number" min="0" step={milestone.basis === "percent" ? "0.1" : "1"} value={milestone.value} onChange={(event) => update({ value: event.target.value })} />
            {milestone.basis === "percent" && <span className="absolute right-3 top-[22px] -translate-y-1/2 text-sm font-bold text-slate-400">%</span>}
          </div>
        </Field>
      </div>
      <div className="lg:col-span-3">
        <Field label="Computed amount"><div className="field bg-slate-50 font-bold text-slate-700">{formatMoney(amount, form.currency)}</div></Field>
      </div>
      <div className="lg:col-span-6">
        <Field label="Tax rule">
          <select className="field" value={milestone.taxRule} onChange={(event) => update({ taxRule: event.target.value })}>
            <option value="contract-default">Use contract default · {tax.label}</option>
            <option value="no-tax">No tax / Nil rated</option>
            <option value="custom">Custom override</option>
          </select>
        </Field>
      </div>
      <div className="lg:col-span-12">
        <Field label="Completion criteria"><input className="field" value={milestone.completionCriteria} placeholder="What must be completed before invoicing?" onChange={(event) => update({ completionCriteria: event.target.value })} /></Field>
      </div>
    </div>
    <div className="border-t bg-moss-50/60 px-5 py-3 text-xs font-medium text-moss-700">
      This rule will create an invoice for {formatMoney(amount, form.currency)} + {formatMoney(taxAmount, form.currency)} {milestone.taxRule === "no-tax" ? "tax" : tax.shortLabel} when the milestone is ready.
    </div>
  </div>;
}

function ProjectTerms({ form, setForm }) {
  const milestones = form.milestones || [];
  const pendingFocusId = useRef(null);
  const tax = getContractTax(form);
  const validation = getMilestoneValidation(milestones, form.contractValue);
  const updateForm = (patch) => setForm((current) => ({ ...current, ...patch }));
  const updateMilestone = (id, patch) => updateForm({
    milestones: milestones.map((milestone) => milestone.id === id ? { ...milestone, ...patch } : milestone),
  });
  const addMilestone = () => {
    const id = `milestone-${Date.now()}`;
    pendingFocusId.current = id;
    updateForm({
      milestones: [...milestones, {
      id,
      name: "",
      dueDate: "",
      basis: "percent",
      value: 0,
      completionCriteria: "",
      taxRule: "contract-default",
      }],
    });
  };
  const focusNewMilestone = (node, id) => {
    if (!node || pendingFocusId.current !== id) return;
    pendingFocusId.current = null;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => node.querySelector("[data-milestone-name]")?.focus({ preventScroll: true }), 350);
  };
  const duplicateMilestone = (source) => {
    const id = `milestone-${Date.now()}`;
    pendingFocusId.current = id;
    updateForm({
      milestones: [...milestones, { ...source, id, dueDate: "" }],
    });
  };
  const removeMilestone = (id) => updateForm({
    milestones: milestones.filter((milestone) => milestone.id !== id),
  });

  return <div>
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Service line description"><input className="field" defaultValue="Digital transformation & implementation" /></Field>
      <Field label="Total contract value">
        <div className="flex gap-2">
          <select className="field !w-24" value={form.currency} onChange={(event) => updateForm({ currency: event.target.value })}><option>INR</option><option>EUR</option><option>USD</option></select>
          <input className="field" type="number" min="0" value={form.contractValue} onChange={(event) => updateForm({ contractValue: Number(event.target.value) || 0 })} />
        </div>
      </Field>
    </div>
    <div className="mt-7 flex items-center justify-between gap-4">
      <div><h3 className="text-lg font-bold">Milestone rules</h3><p className="text-sm text-slate-400">Configure when and how each amount becomes billable.</p></div>
      <button type="button" onClick={addMilestone} className="btn-secondary shrink-0"><Plus size={16} />Add milestone</button>
    </div>
    {validation.invalid && <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800"><AlertTriangle className="mt-0.5 shrink-0" size={17} />{validation.message}</div>}
    <div className="mt-4 space-y-4">
      {milestones.map((milestone, index) => <MilestoneCard
        key={milestone.id}
        milestone={milestone}
        index={index}
        form={form}
        tax={tax}
        update={(patch) => updateMilestone(milestone.id, patch)}
        duplicate={() => duplicateMilestone(milestone)}
        remove={() => removeMilestone(milestone.id)}
        cardRef={(node) => focusNewMilestone(node, milestone.id)}
      />)}
    </div>
  </div>;
}

function CommercialStep({ form, setForm }) {
  const [amc, setAmc] = useState(true);
  if (form.model === "SaaS") return <div className="grid gap-5 md:grid-cols-2"><Field label="Plan / tier"><select className="field"><option>Pro</option><option>Basic</option><option>Enterprise</option></select></Field><Field label="Subscription amount"><div className="flex gap-2"><select className="field !w-24"><option>INR</option><option>EUR</option></select><input className="field" defaultValue="150000" /></div></Field><Field label="Billing frequency"><select className="field"><option>Annual</option><option>Monthly</option><option>Quarterly</option></select></Field><Field label="Number of seats"><input className="field" type="number" defaultValue="60" /></Field><Field label="Start date"><input className="field" type="date" defaultValue="2026-10-01" /></Field><div className="rounded-xl border p-4"><span className="label">Auto-renewal</span><div className="mt-3 flex items-center gap-3"><Toggle on={amc} setOn={setAmc} /><span className="text-sm text-slate-500">{amc ? "Enabled" : "Disabled"}</span></div></div></div>;
  if (form.model === "License") return <div className="grid gap-5 md:grid-cols-2"><Field label="License type"><select className="field"><option>Perpetual</option><option>Term-based</option></select></Field><Field label="Number of licenses"><input className="field" type="number" defaultValue="100" /></Field><Field label="License fee"><div className="flex gap-2"><select className="field !w-24"><option>INR</option><option>EUR</option></select><input className="field" defaultValue="125000" /></div></Field><div className="rounded-xl border p-4"><span className="label">AMC / Maintenance</span><div className="mt-3 flex items-center gap-3"><Toggle on={amc} setOn={setAmc} /><span className="text-sm text-slate-500">{amc ? "18% annually" : "Not included"}</span></div>{amc && <input className="field !mt-3" defaultValue="18%" />}</div></div>;
  return <ProjectTerms form={form} setForm={setForm} />;
}

export default CommercialStep;
