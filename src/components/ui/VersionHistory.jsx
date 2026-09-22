import { Clock3, Eye, History } from "lucide-react";

function VersionHistory({ items, onView, title = "Version history" }) {
  if (!items.length) {
    return <div className="panel grid min-h-[360px] place-items-center p-8 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><History size={24} /></div>
        <h2 className="mt-4 text-lg font-bold">No version history yet</h2>
        <p className="mt-2 text-sm text-slate-500">Changes and document versions will appear here.</p>
      </div>
    </div>;
  }

  return <div className="panel p-5 sm:p-7">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">A chronological record of edits and supporting documents.</p>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{items.length} versions</span>
    </div>
    <div>
      {items.map((item, index) => <div key={`${item.label}-${item.date}`} className="relative flex gap-4 pb-6 last:pb-0">
        {index < items.length - 1 && <span className="absolute left-[17px] top-9 h-[calc(100%-20px)] w-px bg-slate-200" />}
        <div className={`relative z-10 mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full ring-4 ring-white ${item.status === "Current" ? "bg-moss-600 text-white" : "bg-slate-200 text-slate-500"}`}>
          <Clock3 size={15} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-ink">{item.label}</span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status === "Current" ? "bg-moss-50 text-moss-700 ring-1 ring-moss-100" : "bg-slate-100 text-slate-500"}`}>{item.status}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-700">{item.summary}</p>
            <p className="mt-1.5 text-xs text-slate-400">{item.date} · Edited by {item.editedBy}</p>
          </div>
          {item.documentUrl && <button type="button" onClick={() => onView(item)} className="btn-secondary shrink-0"><Eye size={15} />View</button>}
        </div>
      </div>)}
    </div>
  </div>;
}

export default VersionHistory;
