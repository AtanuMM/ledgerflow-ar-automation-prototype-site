import { ArrowRight, ReceiptText, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Field from "../components/ui/Field";

function LoginPage({ onLogin, role, setRole }) {
  return <div className="min-h-screen bg-[#edf1eb] p-4 lg:p-6">
    <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1500px] overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[1.05fr_.95fr]">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-moss-500/20 blur-3xl" />
        <div className="relative flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink"><ReceiptText size={21} /></div><span className="font-['Manrope'] text-xl font-bold">LedgerFlow</span></div>
        <div className="relative my-auto max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-sm text-emerald-100"><Sparkles size={15} /> One workflow. Every billing model.</div>
          <h1 className="text-5xl font-bold leading-[1.08]">Contract to cash,<br /><span className="text-[#9ed6ae]">without the chaos.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Configure commercial terms, apply the right tax treatment, and create accurate invoices—all in one calm workspace.</p>
          <div className="mt-12 grid grid-cols-3 gap-3">
            {[["3", "Billing models"], ["100%", "Tax clarity"], ["1", "Shared workflow"]].map(([n, l]) => <div key={l} className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><div className="text-2xl font-bold">{n}</div><div className="mt-1 text-xs text-slate-400">{l}</div></div>)}
          </div>
        </div>
        <p className="relative text-xs text-slate-500">AR Automation · Interactive prototype</p>
      </div>
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white"><ReceiptText size={21} /></div><span className="text-xl font-bold">LedgerFlow</span></div>
          <div className="mb-8"><p className="mb-2 text-sm font-bold text-moss-600">WELCOME BACK</p><h2 className="text-3xl font-bold text-ink">Sign in to your workspace</h2><p className="mt-2 text-slate-500">Enter any details to explore the prototype.</p></div>
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-5">
            <Field label="Work email"><input className="field" type="email" defaultValue="finance@matrixmedia.com" required /></Field>
            <Field label="Password"><input className="field" type="password" defaultValue="prototype" required /></Field>
            <div className="rounded-2xl border border-dashed border-moss-500/40 bg-moss-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-moss-700"><Zap size={15} /> Prototype role</div>
              <select className="field !mt-0 !border-moss-100" value={role} onChange={(e) => setRole(e.target.value)}><option>Finance / Ops User</option><option>Approver</option><option>Admin</option></select>
              <p className="mt-2 text-xs text-moss-700/70">Switch anytime from the profile menu.</p>
            </div>
            <button className="btn-primary w-full !py-3.5">Log in <ArrowRight size={17} /></button>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck size={14} /> Demo environment · No real data</div>
        </div>
      </div>
    </div>
  </div>;
}
export default LoginPage;
