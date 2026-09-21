

function PageHead({ eyebrow, title, desc, action }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-1 text-xs font-bold uppercase tracking-[.14em] text-moss-600">{eyebrow}</p><h1 className="text-3xl font-bold text-ink">{title}</h1>{desc && <p className="mt-2 max-w-2xl text-sm text-slate-500">{desc}</p>}</div>{action}</div>;
}
export default PageHead;
