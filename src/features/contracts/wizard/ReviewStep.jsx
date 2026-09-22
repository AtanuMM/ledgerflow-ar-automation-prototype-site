import Badge from "../../../components/ui/Badge";
import { getAssignmentLabel, getBillableLines } from "../../tax/utils/contractTax";

function money(value, currency) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }).format(Number(value || 0));
}

function ReviewStep({ form }) {
  const projectValue = `${form.currency === "INR" ? "₹" : form.currency === "EUR" ? "€" : "$"}${Number(form.contractValue || 0).toLocaleString("en-IN")}`;
  const lines = getBillableLines(form);
  const blocks = [["Basic details", [["Customer", form.customer], ["Location", `${form.state || ""}, ${form.country}`], ["Billing entity", form.entity], ["Term", `${form.effectiveDate || "01 Oct 2026"} — 30 Sep 2027`]]], ["Commercial terms", [["Billing model", form.model], ["Contract value", form.model === "Project" ? projectValue : form.model === "SaaS" ? "₹18,00,000 / year" : "€125,000"], ["Billing", form.model === "Project" ? `${form.milestones?.length || 0} milestone rules` : form.model === "SaaS" ? "Annual · 60 seats" : "Perpetual + 18% AMC"]]], ["Notifications", [["Notification rules", "3 active rules"], ["Approver", "Finance Approver"], ["Invoice event", "Immediate notification"]]]];
  return <div className="space-y-4"><div className="grid gap-4 lg:grid-cols-3">{blocks.map(([title, rows], i) => <div className="rounded-2xl border p-5" key={title}><div className="mb-5 flex items-center justify-between"><h3 className="font-bold">{title}</h3><button className="text-xs font-bold text-moss-600">Edit</button></div><div className="space-y-4">{rows.map(([a, b]) => <div key={a}><p className="text-xs font-medium text-slate-400">{a}</p><p className="mt-1 text-sm font-semibold text-slate-700">{b}</p></div>)}</div>{i === 0 && <Badge>Ready</Badge>}</div>)}</div>
    <div className="rounded-2xl border p-5"><div className="mb-4 flex items-end justify-between"><div><h3 className="font-bold">Tax assignments</h3><p className="mt-1 text-sm text-slate-400">A calculation snapshot is recorded for every billable line.</p></div><span className="rounded-full bg-moss-50 px-3 py-1 text-xs font-bold text-moss-700">{lines.length} assigned</span></div>
      <div className="grid gap-3 lg:grid-cols-2">{lines.map((line, index) => {
        const assignment = form.taxAssignments?.[line.id];
        const result = assignment?.resultSnapshot;
        return <div key={line.id} className="rounded-xl bg-slate-50 p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{form.model === "Project" ? `Milestone ${index + 1}` : "Billable line"}</p><p className="mt-1 text-sm font-bold">{line.name}</p><p className="mt-1 text-xs font-semibold text-moss-700">{getAssignmentLabel(assignment)} · {assignment?.mode?.replaceAll("_", " ")}</p></div><div className="text-right"><p className="text-xs text-slate-400">Total</p><p className="mt-1 text-sm font-bold">{money(result?.totalDecimal, result?.currency || form.currency)}</p></div></div>
          <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs"><span className="text-slate-500">Tax {money(result?.taxTotalDecimal, result?.currency || form.currency)}</span><span className="font-mono text-slate-500">{assignment?.ruleSetId || "EXEMPT"}</span></div>
          {result?.lines?.length > 0 && <details className="mt-3"><summary className="cursor-pointer text-xs font-bold text-slate-600">View tax chain</summary><div className="mt-2 space-y-1">{result.lines.map((taxLine) => <p key={taxLine.id} className="text-xs text-slate-500">{taxLine.calculationOrder}. {taxLine.taxName} ({taxLine.rate ?? "fixed"}{taxLine.rate != null ? "%" : ""}) → {money(taxLine.amountDecimal, result.currency)}</p>)}</div></details>}
          {assignment?.overrideReason && <p className="mt-3 text-xs text-amber-700">Reason: {assignment.overrideReason}</p>}
        </div>;
      })}</div>
    </div>
  </div>;
}
export default ReviewStep;
