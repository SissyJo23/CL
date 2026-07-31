import { Switch, Route } from "wouter";
import Dashboard from "./pages/home";
import CasesIndex from "./pages/cases/list";
import CasesNew from "./pages/cases/new";
import CasesShow from "./pages/cases/show";
import CasesEdit from "./pages/cases/edit";
import CasesPattern from "./pages/cases/pattern";
import CasesRelief from "./pages/cases/relief";
import DocumentsIndex from "./pages/documents/index";
import DocumentsShow from "./pages/documents/show";
import DocumentsNomerit from "./pages/documents/nomerit";
import CourtNew from "./pages/court/new";
import CourtRun from "./pages/court/run";
import CourtShow from "./pages/court/show";
import MotionList from "./pages/motions/list";
import MotionShow from "./pages/motions/show";
import AuthLogin from "./pages/auth/login";
import Register from "./pages/auth/register";
import About from "./pages/about";
import Legal from "./pages/legal";
import NotFound from "./pages/not-found";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://caselight-api.onrender.com";

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={AuthLogin} />
      <Route path="/register" component={Register} />
      <Route path="/about" component={About} />
      <Route path="/legal" component={Legal} />
      <Route path="/" component={Dashboard} />
      <Route path="/cases" component={CasesIndex} />
      <Route path="/cases/new" component={CasesNew} />
      <Route path="/cases/:caseId/motions/:id" component={MotionShow} />
      <Route path="/cases/:caseId/motions" component={MotionList} />
      <Route path="/cases/:caseId/court/:id/run" component={CourtRun} />
      <Route path="/cases/:caseId/court/:id" component={CourtShow} />
      <Route path="/cases/:caseId/court/new" component={CourtNew} />
      <Route path="/cases/:id" component={CasesShow} />
      <Route path="/cases/:id/edit" component={CasesEdit} />
      <Route path="/cases/:id/pattern" component={CasesPattern} />
      <Route path="/cases/:id/relief" component={CasesRelief} />
      <Route path="/documents" component={DocumentsIndex} />
      <Route path="/documents/:id" component={DocumentsShow} />
      <Route path="/documents/:id/nomerit" component={DocumentsNomerit} />
      <Route path="/court/:id" component={CourtRun} />
      <Route component={NotFound} />
    </Switch>
  );
}
