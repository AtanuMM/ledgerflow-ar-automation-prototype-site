import { useState } from "react";
import { Bell, ClipboardCheck, FileText, LayoutDashboard, Menu, ReceiptText, Settings, Users } from "lucide-react";
import ActionMenu from "../ui/ActionMenu";
import Avatar from "../ui/Avatar";

const nav = [
  ["overview", "Overview", LayoutDashboard, ["Admin", "Finance / Ops User"]],
  ["contracts", "Contracts", FileText, ["Admin", "Finance / Ops User"]],
  ["invoices", "Invoices", ReceiptText, ["Admin", "Finance / Ops User"]],
  ["approvals", "Approvals", ClipboardCheck, ["Admin", "Approver"]],
];

const workspaceNav = [
  ["settings", "Tax & invoice rules", Settings],
  ["users", "Users & roles", Users],
];

function AppShell({ page, setPage, role, onLogout, notify, children }) {
  const [mobile, setMobile] = useState(false);
  const visibleNav = nav.filter((item) => item[3].includes(role));
  const canManageWorkspace = role === "Admin";
  return <div className="min-h-screen bg-canvas">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink p-4 text-white transition-transform lg:translate-x-0 ${mobile ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center gap-3 px-2 py-2"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink"><ReceiptText size={21} /></div><div><div className="font-['Manrope'] text-lg font-bold">LedgerFlow</div><div className="text-[10px] uppercase tracking-[.16em] text-slate-500">AR Automation</div></div></div>
      <nav className="space-y-1">{visibleNav.map(([key, label, Icon]) => <button key={key} onClick={() => { setPage(key); setMobile(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${page === key ? "bg-white text-ink shadow" : "text-slate-400 hover:bg-white/[.07] hover:text-white"}`}><Icon size={18} />{label}{key === "approvals" && <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">2</span>}</button>)}</nav>
      {canManageWorkspace && <><div className="my-5 border-t border-white/10" />
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-slate-600">Workspace</p>
        {workspaceNav.map(([key, label, Icon]) => <button key={key} onClick={() => { setPage(key); setMobile(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${page === key ? "bg-white text-ink" : "text-slate-400 hover:bg-white/[.07] hover:text-white"}`}><Icon size={18} />{label}</button>)}
      </>}
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.05] p-3">
        <div className="flex items-center gap-3"><Avatar name="Atanu Dey" size="sm" /><div className="min-w-0"><div className="truncate text-sm font-semibold">Atanu Dey</div><div className="truncate text-xs text-slate-500">{role}</div></div><div className="ml-auto"><ActionMenu buttonClassName="p-1 text-slate-500 hover:text-white" editLabel="Edit profile" deleteLabel="Sign out" onEdit={()=>notify("Profile editing is a demo action")} onDelete={onLogout}/></div></div>
      </div>
    </aside>
    {mobile && <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setMobile(false)} />}
    <main className="min-h-screen lg:pl-64">
      <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-7">
        <button className="mr-3 lg:hidden" onClick={() => setMobile(true)}><Menu /></button>
        <div className="flex items-center gap-2 text-sm"><span className="text-slate-400">Workspace</span><span className="text-slate-300">/</span><span className="font-semibold capitalize text-slate-700">{page}</span></div>
        <div className="ml-auto flex items-center gap-2"><button className="relative grid h-9 w-9 place-items-center rounded-xl border bg-white text-slate-500"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" /></button><div className="hidden rounded-xl bg-moss-50 px-3 py-2 text-xs font-semibold text-moss-700 sm:block">Prototype mode</div></div>
      </header>
      <div className="mx-auto max-w-[1450px] p-4 sm:p-7">{children}</div>
    </main>
  </div>;
}
export default AppShell;
