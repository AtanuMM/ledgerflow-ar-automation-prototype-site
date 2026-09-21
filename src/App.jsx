import { useMemo, useState } from "react";
import AppShell from "./components/layout/AppShell";
import Toast from "./components/ui/Toast";
import ContractDetail from "./features/contracts/ContractDetail";
import ContractsPage from "./features/contracts/ContractsPage";
import ContractWizard from "./features/contracts/ContractWizard";
import GenerateInvoice from "./features/invoices/GenerateInvoice";
import InvoiceDetail from "./features/invoices/InvoiceDetail";
import InvoicesPage from "./features/invoices/InvoicesPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("Finance / Ops User");
  const [page, setPage] = useState("overview");
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toast, setToast] = useState("");
  const notify = (text) => { setToast(text); window.setTimeout(() => setToast(""), 2800); };
  const login = () => {
    setPage(role === "Approver" ? "approvals" : "overview");
    setLoggedIn(true);
  };
  const content = useMemo(() => {
    if (page === "overview") return <OverviewPage setPage={setPage}/>;
    if (page === "contracts") return <ContractsPage setPage={setPage} setSelected={setSelectedContract}/>;
    if (page === "new-contract") return <ContractWizard setPage={setPage} notify={notify}/>;
    if (page === "contract-detail") return <ContractDetail contract={selectedContract} setPage={setPage} notify={notify}/>;
    if (page === "invoices") return <InvoicesPage setPage={setPage} setSelected={setSelectedInvoice}/>;
    if (page === "generate-invoice") return <GenerateInvoice setPage={setPage} notify={notify}/>;
    if (page === "invoice-detail") return <InvoiceDetail invoice={selectedInvoice} setPage={setPage} notify={notify}/>;
    if (page === "approvals") return <ApprovalsPage notify={notify}/>;
    if (page === "settings") return <SettingsPage notify={notify}/>;
    if (page === "users") return <UsersPage notify={notify}/>;
    return null;
  }, [page, selectedContract, selectedInvoice]);
  if (!loggedIn) return <LoginPage onLogin={login} role={role} setRole={setRole}/>;
  return <AppShell page={page} setPage={setPage} role={role} onLogout={() => setLoggedIn(false)} notify={notify}>{content}{toast && <Toast text={toast}/>}</AppShell>;
}
