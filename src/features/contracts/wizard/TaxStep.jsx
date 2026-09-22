import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, GitBranch, Plus, Sparkles } from "lucide-react";
import Field from "../../../components/ui/Field";
import Toggle from "../../../components/ui/Toggle";
import {
  getBillableLines,
  getRuleSetById,
  getTaxRecommendation,
  listAvailableRuleSets,
  makeAssignment,
} from "../../tax/utils/contractTax";

function money(decimal, currency) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }).format(Number(decimal || 0));
}

function TaxStep({ form, setForm }) {
  const [enabled, setEnabled] = useState([true, true, true]);
  const lines = useMemo(() => getBillableLines(form), [form.model, form.milestones, form.contractValue, form.effectiveDate]);
  const [selectedId, setSelectedId] = useState(lines[0]?.id);
  const recommendation = getTaxRecommendation(form);
  const availableRuleSets = listAvailableRuleSets();
  const syncKey = JSON.stringify({
    country: form.country, state: form.state, entity: form.entity, model: form.model,
    currency: form.currency, effectiveDate: form.effectiveDate,
    lines: lines.map(({ id, amount, dueDate }) => ({ id, amount, dueDate })),
  });

  useEffect(() => {
    setForm((current) => {
      const currentLines = getBillableLines(current);
      const taxAssignments = Object.fromEntries(currentLines.map((line) => [
        line.id,
        makeAssignment(current, line, current.taxAssignments?.[line.id]),
      ]));
      return { ...current, taxAssignments };
    });
  }, [setForm, syncKey]);

  useEffect(() => {
    if (!lines.some((line) => line.id === selectedId)) setSelectedId(lines[0]?.id);
  }, [lines, selectedId]);

  const selectedLine = lines.find((line) => line.id === selectedId) || lines[0];
  const assignment = selectedLine
    ? (form.taxAssignments?.[selectedLine.id] || makeAssignment(form, selectedLine))
    : null;
  const result = assignment?.resultSnapshot;
  const ruleSet = assignment?.ruleSetId ? getRuleSetById(assignment.ruleSetId) : null;
  const reasonRequired = assignment?.mode === "SPECIFIC_RULE_SET" || assignment?.mode === "EXEMPT";
  const updateAssignment = (patch) => {
    if (!selectedLine) return;
    setForm((current) => {
      const currentLine = getBillableLines(current).find((line) => line.id === selectedLine.id) || selectedLine;
      const previous = current.taxAssignments?.[selectedLine.id] || {};
      const nextBase = { ...previous, ...patch };
      if (patch.mode === "AUTO_MATCH") {
        nextBase.ruleSetId = getTaxRecommendation(current).ruleSetId;
        nextBase.overrideReason = "";
      }
      if (patch.mode === "SPECIFIC_RULE_SET" && !nextBase.ruleSetId) nextBase.ruleSetId = getTaxRecommendation(current).ruleSetId;
      if (patch.mode === "EXEMPT") nextBase.ruleSetId = null;
      return {
        ...current,
        taxAssignments: {
          ...(current.taxAssignments || {}),
          [selectedLine.id]: makeAssignment(current, currentLine, nextBase),
        },
      };
    });
  };

  const rules = [["Milestone due", "Project Manager, Finance", "Email", "7 days before"], ["Invoice generated", "Finance Approver", "Email + In-app", "Immediately"], ["Contract nearing expiry", "Account Manager", "Email", "30 days before"]];
  if (!selectedLine) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800">Add a billable milestone before assigning tax.</div>;

  return <div className="space-y-7"><div><div className="mb-3"><h3 className="text-lg font-bold">Tax assignment</h3><p className="text-sm text-slate-400">Assign and calculate tax independently for every billable line.</p></div>
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2 rounded-2xl border bg-slate-50 p-3">
        <p className="px-2 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{form.model === "Project" ? "Milestones" : "Billable line"}</p>
        {lines.map((line, index) => {
          const item = form.taxAssignments?.[line.id];
          return <button type="button" key={line.id} onClick={() => setSelectedId(line.id)} className={`w-full rounded-xl border p-3 text-left transition ${selectedLine.id === line.id ? "border-moss-400 bg-white shadow-sm" : "border-transparent hover:bg-white"}`}>
            <div className="flex items-start gap-3"><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${selectedLine.id === line.id ? "bg-moss-600 text-white" : "bg-slate-200 text-slate-600"}`}>{index + 1}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{line.name}</p><p className="mt-1 text-xs text-slate-500">{money(line.amount, form.currency)}</p><p className="mt-1 truncate text-[11px] font-semibold text-moss-700">{item?.mode === "EXEMPT" ? "Exempt" : getRuleSetById(item?.ruleSetId)?.name || "Auto-match pending"}</p></div></div>
          </button>;
        })}
      </div>
      <div className="space-y-4">
        <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 xl:grid-cols-3">
          {[["Customer", `${form.country}${form.state ? ` · ${form.state}` : ""}`], ["Billing entity", form.entity], ["Service / model", `${form.title} · ${form.model}`], ["Currency", form.currency], ["Effective date", form.effectiveDate || selectedLine.dueDate || "01 Oct 2026"]].map(([label, value]) => <div key={label}><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xs font-semibold text-slate-700">{value}</p></div>)}
        </div>

        <div className={`relative overflow-hidden rounded-2xl border p-5 ${recommendation.isFallback ? "border-amber-200 bg-amber-50" : "border-moss-500/30 bg-moss-50"}`}>
          <div className="relative flex gap-4"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white ${recommendation.isFallback ? "bg-amber-500" : "bg-moss-600"}`}>{recommendation.isFallback ? <AlertTriangle size={19} /> : <Sparkles size={19} />}</div><div><p className={`text-xs font-bold uppercase tracking-wider ${recommendation.isFallback ? "text-amber-700" : "text-moss-600"}`}>{recommendation.isFallback ? "Explicit demo fallback" : "Recommended match"}</p><h4 className="mt-1 text-lg font-bold">{getRuleSetById(recommendation.ruleSetId)?.name}</h4><p className="mt-1 text-xs text-slate-600">{recommendation.note}</p></div></div>
        </div>

        <div className="rounded-2xl border p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Assignment mode</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[["AUTO_MATCH", "Auto-match"], ["SPECIFIC_RULE_SET", "Specific rule set"], ["EXEMPT", "Exempt"]].map(([mode, label]) => <button type="button" key={mode} onClick={() => updateAssignment({ mode })} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${assignment.mode === mode ? "border-moss-500 bg-moss-50 text-moss-700" : "text-slate-500 hover:bg-slate-50"}`}>{label}</button>)}
          </div>
          {assignment.mode === "SPECIFIC_RULE_SET" && <div className="mt-4"><Field label="Available rule set"><select className="field" value={assignment.ruleSetId || ""} onChange={(event) => updateAssignment({ ruleSetId: event.target.value })}>{availableRuleSets.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.versionId}</option>)}</select></Field></div>}
          {reasonRequired && <div className="mt-4"><Field label={assignment.mode === "EXEMPT" ? "Exemption reason (required)" : "Override reason (required)"}><textarea className="field min-h-20" value={assignment.overrideReason || ""} onChange={(event) => updateAssignment({ overrideReason: event.target.value })} placeholder="Record the business and compliance rationale" /></Field>{!assignment.overrideReason?.trim() && <p className="mt-2 text-xs font-semibold text-rose-600">A reason is required before continuing.</p>}</div>}
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-ink p-5 text-white"><div><p className="text-xs font-bold uppercase tracking-wider text-white/55">Live calculation · {selectedLine.name}</p><p className="mt-1 text-2xl font-bold">{money(result?.totalDecimal, result?.currency || form.currency)}</p><p className="mt-1 text-xs text-white/60">Base {money(result?.baseAmountDecimal, result?.currency || form.currency)} + tax {money(result?.taxTotalDecimal, result?.currency || form.currency)}</p></div><div className="rounded-xl bg-white/10 px-4 py-3 text-right"><p className="text-xs text-white/50">Treatment</p><p className="mt-1 text-sm font-bold">{assignment.mode === "EXEMPT" ? "Exempt · 0.00 tax" : result?.lines?.map((line) => line.taxCode).join(" → ") || "No matching treatment"}</p></div></div>
          {result?.validationErrors?.length > 0 && <div className="border-t border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{result.validationErrors.map((item) => item.message).join(" · ")}</div>}
          <div className="p-5"><div className="flex flex-wrap gap-x-8 gap-y-3 text-xs"><div><span className="text-slate-400">Rule set ID</span><p className="mt-1 font-mono font-semibold">{ruleSet?.id || "EXEMPT"}</p></div><div><span className="text-slate-400">Version</span><p className="mt-1 font-mono font-semibold">{ruleSet?.versionId || "Recorded exemption"}</p></div></div>
            {result?.lines?.length > 0 && <details className="mt-5 group"><summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-slate-50 p-3 text-sm font-bold"><span className="inline-flex items-center gap-2"><GitBranch size={16} />Technical trace and dependency order</span><ChevronDown className="transition group-open:rotate-180" size={16} /></summary><div className="mt-3 space-y-3">{result.lines.map((line) => <div key={line.id} className="rounded-xl border p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold">{line.calculationOrder}. {line.taxName} · {line.rate == null ? "Fixed" : `${line.rate}%`}</p><p className="text-sm font-bold">{money(line.amountDecimal, result.currency)}</p></div><p className="mt-2 text-xs text-slate-500">Treatment: <span className="font-mono">{line.treatmentId}</span></p><p className="mt-1 text-xs text-slate-500">Matched evidence: {line.evidence.matchedConditionIds.join(", ")}</p><p className="mt-1 text-xs text-slate-500">Depends on: {line.evidence.sourceTreatmentIds.length ? line.evidence.sourceTreatmentIds.join(", ") : "Base amount"}</p></div>)}</div></details>}
            {assignment.mode === "EXEMPT" && <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-600"><CheckCircle2 className="text-moss-600" size={16} />Reason captured: {assignment.overrideReason || "Required"}</div>}
          </div>
        </div>
      </div>
    </div></div>
    <div><div className="mb-3 flex items-end justify-between"><div><h3 className="text-lg font-bold">Notification rules</h3><p className="text-sm text-slate-400">Pre-filled from workspace defaults. Adjust for this contract.</p></div><button className="btn-secondary"><Plus size={15} />Add rule</button></div><div className="overflow-x-auto rounded-2xl border"><table className="w-full min-w-[750px]"><thead className="bg-slate-50"><tr>{["On", "Event", "Notify", "Channel", "Timing"].map((x) => <th key={x} className="table-head">{x}</th>)}</tr></thead><tbody>{rules.map((r, i) => <tr key={r[0]}><td className="table-cell"><Toggle on={enabled[i]} setOn={(v) => setEnabled(enabled.map((x, j) => j === i ? v : x))} /></td>{r.map((x, j) => <td key={j} className={`table-cell ${j === 0 ? "font-semibold" : "text-slate-500"}`}>{x}</td>)}</tr>)}</tbody></table></div></div>
  </div>;
}
export default TaxStep;
