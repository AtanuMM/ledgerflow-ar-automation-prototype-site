import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import PageHead from "../../components/ui/PageHead";
import Stepper, { stepNames } from "./wizard/Stepper";
import BasicStep from "./wizard/BasicStep";
import ModelStep from "./wizard/ModelStep";
import CommercialStep from "./wizard/CommercialStep";
import TaxStep from "./wizard/TaxStep";
import ReviewStep from "./wizard/ReviewStep";
import { getMilestoneValidation } from "../../utils/milestones";
import { getTaxAssignmentValidation } from "../tax/utils/contractTax";

function ContractWizard({ setPage, notify }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "Retail commerce transformation",
    customer: "Capital Retail Solutions",
    country: "India",
    state: "Delhi",
    entity: "Matrix Media — India (West Bengal)",
    model: "Project",
    currency: "INR",
    effectiveDate: "2026-10-01",
    contractValue: 3250000,
    milestones: [{
      id: "milestone-1",
      name: "Discovery & solution blueprint",
      dueDate: "2026-11-15",
      basis: "percent",
      value: 25,
      completionCriteria: "Blueprint approved by client sponsor",
    }],
    taxAssignments: {},
  });
  const milestoneValidation = getMilestoneValidation(form.milestones, form.contractValue);
  const commercialInvalid = step === 2 && form.model === "Project" && milestoneValidation.invalid;
  const taxValidation = getTaxAssignmentValidation(form);
  const taxInvalid = step === 3 && taxValidation.invalid;
  const next = () => { if (step < 4) setStep(step + 1); else { notify("Contract submitted for approval"); setPage("contracts"); } };
  return <><button onClick={() => setPage("contracts")} className="btn-ghost mb-4 !px-0"><ArrowLeft size={17} />Back to contracts</button><PageHead eyebrow={`New contract · Step ${step + 1} of 5`} title={stepNames[step]} desc="Capture the commercial agreement once. LedgerFlow will carry it through every invoice." />
    <Stepper step={step} setStep={setStep} /><div className="panel p-5 sm:p-7"><div className="mx-auto max-w-5xl">{step === 0 && <BasicStep form={form} setForm={setForm} />}{step === 1 && <ModelStep form={form} setForm={setForm} />}{step === 2 && <CommercialStep form={form} setForm={setForm} />}{step === 3 && <TaxStep form={form} setForm={setForm} />}{step === 4 && <ReviewStep form={form} />}</div></div>
    <div className="sticky bottom-4 mt-5 flex items-center justify-between rounded-2xl border bg-white/90 p-3 shadow-xl shadow-slate-200/70 backdrop-blur"><button disabled={step === 0} onClick={() => setStep(step - 1)} className="btn-secondary disabled:opacity-40"><ArrowLeft size={16} />Back</button><div className={`hidden text-xs sm:block ${(commercialInvalid || taxInvalid) ? "font-semibold text-rose-600" : "text-slate-400"}`}>{commercialInvalid ? milestoneValidation.message : taxInvalid ? taxValidation.message : "Changes are saved automatically"}</div><button disabled={commercialInvalid || taxInvalid} onClick={next} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">{step === 4 ? "Submit for approval" : "Save & continue"} {step === 4 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}</button></div></>;
}
export default ContractWizard;
