import { ArrowLeft, Download } from "lucide-react";
import { invoices } from "../../data/mockData";
import Badge from "../../components/ui/Badge";
import PageHead from "../../components/ui/PageHead";
import InvoicePaper from "./InvoicePaper";

function InvoiceDetail({ invoice, setPage, notify }) {
  const i = invoice || invoices[0];
  return <><button onClick={()=>setPage("invoices")} className="btn-ghost mb-4 !px-0"><ArrowLeft size={17}/>All invoices</button><PageHead eyebrow={`${i.contract} · ${i.customer}`} title={i.no} desc={`${i.model} invoice · ${i.total}`} action={<div className="flex gap-2"><button onClick={()=>notify("PDF download started")} className="btn-secondary"><Download size={16}/>Download PDF</button><button onClick={()=>notify("Invoice marked as sent")} className="btn-primary">Mark as sent</button></div>}/><div className="mb-5 panel p-4"><div className="flex items-center gap-3"><Badge>{i.status}</Badge><div className="h-px flex-1 bg-slate-100"/><span className="text-xs text-slate-400">Draft → Proforma → Approved → Final → Sent</span></div></div><InvoicePaper status={i.status}/></>;
}
export default InvoiceDetail;
