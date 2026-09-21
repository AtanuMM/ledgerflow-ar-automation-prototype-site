

function Field({ label, children, hint }) {
  return <label className="block"><span className="label">{label}</span>{children}{hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}</label>;
}
export default Field;
