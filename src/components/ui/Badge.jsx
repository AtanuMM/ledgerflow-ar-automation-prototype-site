import { badgeStyles } from "../../data/mockData";

function Badge({ children }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${badgeStyles[children] || "bg-slate-100 text-slate-600"}`}>{children}</span>;
}
export default Badge;
