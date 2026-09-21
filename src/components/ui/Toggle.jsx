

function Toggle({ on, setOn }) {
  return <button type="button" onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-moss-600" : "bg-slate-200"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${on ? "left-6" : "left-1"}`} /></button>;
}
export default Toggle;
