import { Route, Router as WouterRouter, Switch, Redirect } from "wouter";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import Login from "@/pages/auth/login";
import Home from "@/pages/home";
import About from "@/pages/about";
import CasesNew from "@/pages/cases/new";
import CasesList from "@/pages/cases/list";
import CaseShow from "@/pages/cases/show";
import PatternPage from "@/pages/cases/pattern";
import ReliefPage from "@/pages/cases/relief";
import DocumentShow from "@/pages/documents/show";
import NomeritPage from "@/pages/documents/nomerit";
import MotionList from "@/pages/motions/list";
import MotionShow from "@/pages/motions/show";
import CourtNew from "@/pages/court/new";
import CourtRun from "@/pages/court/run";
import CourtShow from "@/pages/court/show";
import Legal from "@/pages/legal";

//    POINT FRONTEND TO YOUR RENDER BACKEND
setBaseUrl("https://caselight-api.onrender.com");

//    Attach auth token to every request
setAuthTokenGetter(() => localStorage.getItem("authToken"));

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const isLoggedIn = !!localStorage.getItem("authToken");
  if (!isLoggedIn) return <Redirect to="/login" />;
  return <Component />;
}

function App() {
   return (
      <WouterRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={() => <ProtectedRoute component={Home} />} />
          <Route path="/home" component={() => <ProtectedRoute component={Home} />} />
          <Route path="/about" component={() => <ProtectedRoute component={About} />} />
          <Route path="/cases/new" component={() => <ProtectedRoute component={CasesNew} />} />
          <Route path="/cases/:id/pattern" component={() => <ProtectedRoute component={PatternPage} />} />
          <Route path="/cases/:id/relief" component={() => <ProtectedRoute component={ReliefPage} />} />
          <Route path="/cases/:id/court/new" component={() => <ProtectedRoute component={CourtNew} />} />
          <Route path="/cases/:caseId/court/:id/run" component={() => <ProtectedRoute component={CourtRun} />} />
          <Route path="/cases/:caseId/court/:id" component={() => <ProtectedRoute component={CourtShow} />} />
          <Route path="/cases/:caseId/documents/:id/nomerit" component={() => <ProtectedRoute component={NomeritPage} />} />
          <Route path="/cases/:caseId/documents/:id" component={() => <ProtectedRoute component={DocumentShow} />} />
          <Route path="/cases/:caseId/motions/:id" component={() => <ProtectedRoute component={MotionShow} />} />
          <Route path="/cases/:caseId/motions" component={() => <ProtectedRoute component={MotionList} />} />
          <Route path="/cases/:id" component={() => <ProtectedRoute component={CaseShow} />} />
          <Route path="/cases" component={() => <ProtectedRoute component={CasesList} />} />
          <Route path="/legal" component={Legal} />
          <Route component={() => <Redirect to="/login" />} />
        </Switch>
      </WouterRouter>
   );
}

export default App;
