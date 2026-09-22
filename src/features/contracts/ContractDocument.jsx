import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Plus,
  Printer,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const uploadedDocument = {
  id: "mock-upload",
  name: "Uploaded contract document",
  type: "Contract",
  version: "v1",
  url: "/documents/sample-upload.pdf",
  uploadedAt: "21 Sep 2026",
};

function ToolbarButton({ label, children, ...props }) {
  return <button type="button" aria-label={label} title={label} className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" {...props}>
    {children}
  </button>;
}

function EmptyDocuments({ onUpload }) {
  return <div className="panel grid min-h-[470px] place-items-center p-8 text-center">
    <div>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400"><FileText size={28} /></div>
      <h2 className="mt-5 text-xl font-bold">No contract document uploaded yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Upload an agreement, annexure, invoice, or supporting document to keep it with this contract.</p>
      <button type="button" onClick={onUpload} className="btn-primary mt-6"><Upload size={16} />Upload document</button>
    </div>
  </div>;
}

function ContractDocument({ initialDocuments = [], requestedDocument, contractId, notify }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [activeId, setActiveId] = useState(initialDocuments[0]?.id);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeId) || documents[0],
    [activeId, documents],
  );

  useEffect(() => {
    setDocuments(initialDocuments);
    setActiveId(initialDocuments[0]?.id);
    setPage(1);
    setZoom(100);
  }, [initialDocuments, contractId]);

  useEffect(() => {
    if (!requestedDocument) return;
    setDocuments((items) => items.some((item) => item.id === requestedDocument.id)
      ? items
      : [requestedDocument, ...items]);
    setActiveId(requestedDocument.id);
    setPage(1);
    setZoom(100);
  }, [requestedDocument]);

  const addDocument = () => {
    const nextDocument = { ...uploadedDocument, id: `mock-upload-${documents.length + 1}` };
    setDocuments((items) => [...items, nextDocument]);
    setActiveId(nextDocument.id);
    setPage(1);
    notify("Sample document uploaded");
  };

  const selectDocument = (document) => {
    setActiveId(document.id);
    setPage(1);
    setZoom(100);
  };

  if (!activeDocument) return <EmptyDocuments onUpload={addDocument} />;

  const viewerUrl = `${activeDocument.url}#page=${page}&zoom=${zoom}&toolbar=0&navpanes=0`;
  const printDocument = () => {
    const printWindow = window.open(`${activeDocument.url}#page=${page}`, "_blank");
    if (printWindow) {
      window.setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          notify("Document opened in a new tab for printing");
        }
      }, 700);
    }
  };

  return <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
    <aside className="panel h-fit overflow-hidden">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="font-bold">Documents</h2>
          <p className="mt-0.5 text-xs text-slate-400">{documents.length} {documents.length === 1 ? "file" : "files"} and versions</p>
        </div>
        <button type="button" onClick={addDocument} title="Upload document" className="grid h-9 w-9 place-items-center rounded-xl border text-slate-600 hover:bg-slate-50"><Plus size={16} /></button>
      </div>
      <div className="space-y-1.5 p-2">
        {documents.map((document) => <button
          type="button"
          key={document.id}
          onClick={() => selectDocument(document)}
          className={`w-full rounded-xl p-3 text-left transition ${activeDocument.id === document.id ? "bg-ink text-white shadow" : "hover:bg-slate-50"}`}
        >
          <div className="flex items-start gap-3">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${activeDocument.id === document.id ? "bg-white/10" : "bg-moss-50 text-moss-600"}`}><FileText size={17} /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{document.name}</p>
              <div className={`mt-1 flex items-center gap-1.5 text-[10px] ${activeDocument.id === document.id ? "text-slate-300" : "text-slate-400"}`}>
                <span>{document.type}</span><span>·</span><span>{document.version}</span>
              </div>
              <p className={`mt-1 text-[10px] ${activeDocument.id === document.id ? "text-slate-400" : "text-slate-400"}`}>{document.uploadedAt}</p>
            </div>
          </div>
        </button>)}
      </div>
    </aside>

    <section className="panel min-w-0 overflow-hidden">
      <div className="flex flex-col gap-3 border-b bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-moss-50 text-moss-600"><FileText size={18} /></div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{activeDocument.name}</p>
            <p className="text-xs text-slate-400">{activeDocument.type} · {activeDocument.version} · PDF</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <ToolbarButton label="Previous page" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={17} /></ToolbarButton>
          <label className="flex h-9 items-center gap-1 rounded-lg border bg-slate-50 px-2 text-xs font-semibold text-slate-500">
            Page
            <input aria-label="Page number" type="number" min="1" value={page} onChange={(event) => setPage(Math.max(1, Number(event.target.value) || 1))} className="w-9 bg-transparent text-center font-bold text-slate-800" />
          </label>
          <ToolbarButton label="Next page" onClick={() => setPage((value) => value + 1)}><ChevronRight size={17} /></ToolbarButton>
          <span className="mx-1 h-6 w-px bg-slate-200" />
          <ToolbarButton label="Zoom out" disabled={zoom <= 50} onClick={() => setZoom((value) => Math.max(50, value - 10))}><ZoomOut size={17} /></ToolbarButton>
          <span className="w-11 text-center text-xs font-bold text-slate-600">{zoom}%</span>
          <ToolbarButton label="Zoom in" disabled={zoom >= 200} onClick={() => setZoom((value) => Math.min(200, value + 10))}><ZoomIn size={17} /></ToolbarButton>
          <span className="mx-1 h-6 w-px bg-slate-200" />
          <a href={activeDocument.url} target="_blank" rel="noreferrer" download={`${contractId}-${activeDocument.name}.pdf`} aria-label="Download document" title="Download document" className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100"><Download size={17} /></a>
          <ToolbarButton label="Print document" onClick={printDocument}><Printer size={17} /></ToolbarButton>
        </div>
      </div>
      <div className="bg-slate-100 p-3 sm:p-5">
        <iframe key={viewerUrl} src={viewerUrl} title={`${contractId} ${activeDocument.name}`} className="h-[680px] w-full rounded-xl border border-slate-200 bg-white" />
      </div>
    </section>
  </div>;
}

export default ContractDocument;
