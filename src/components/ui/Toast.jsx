import { Check } from "lucide-react";

function Toast({ text }) {
  return <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-2xl"><span className="grid h-7 w-7 place-items-center rounded-full bg-moss-500"><Check size={15}/></span>{text}</div>;
}
export default Toast;
