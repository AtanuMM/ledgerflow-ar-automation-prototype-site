import { Check } from "lucide-react";

export const stepNames = ["Basic details", "Billing model", "Commercial terms", "Tax & rules", "Review"];

function Stepper({ step, setStep }) {
  return <div className="mb-7 overflow-x-auto"><div className="flex min-w-[700px] items-center">{stepNames.map((s, i) => <div key={s} className="flex flex-1 items-center last:flex-none"><button onClick={() => i < step && setStep(i)} className="flex items-center gap-2"><span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i < step ? "bg-moss-600 text-white" : i === step ? "bg-ink text-white ring-4 ring-slate-200" : "bg-white text-slate-400 ring-1 ring-slate-200"}`}>{i < step ? <Check size={15} /> : i + 1}</span><span className={`whitespace-nowrap text-xs font-semibold ${i === step ? "text-ink" : "text-slate-400"}`}>{s}</span></button>{i < 4 && <div className={`mx-3 h-px flex-1 ${i < step ? "bg-moss-500" : "bg-slate-200"}`} />}</div>)}</div></div>;
}
export default Stepper;
