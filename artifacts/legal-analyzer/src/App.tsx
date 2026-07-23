import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/home";
import CasesIndex from "./pages/cases/index";
import CasesShow from "./pages/cases/show";
import CasesEdit from "./pages/cases/edit";
import CasesPattern from "./pages/cases/pattern";
import CasesRelief from "./pages/cases/relief";
import DocumentsIndex from "./pages/documents/index";
import DocumentsShow from "./pages/documents/show";
import DocumentsNomerit from "./pages/documents/nomerit";
import CourtRun from "./pages/court/run";
import AuthLogin from "./pages/auth/login";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://caselight-api.onrender.com";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/cases" element={<CasesIndex />} />
        <Route path="/cases/:id" element={<CasesShow />} />
        <Route path="/cases/:id/edit" element={<CasesEdit />} />
        <Route path="/cases/:id/pattern" element={<CasesPattern />} />
        <Route path="/cases/:id/relief" element={<CasesRelief />} />
        <Route path="/documents" element={<DocumentsIndex />} />
        <Route path="/documents/:id" element={<DocumentsShow />} />
        <Route path="/documents/:id/nomerit" element={<DocumentsNomerit />} />
        <Route path="/court/:id" element={<CourtRun />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
