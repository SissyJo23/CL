import { Route, Router as WouterRouter, Switch, Redirect } from "wouter";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import Login from "@/pages/auth/login";
import Home from "@/pages/home";
import CasesNew from "@/pages/cases/new";
import CasesList from "@/pages/cases/list";
import CaseDetail from "@/pages/cases/[id]";
import Legal from "@/pages/legal";

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
        <Route path="/cases/new" component={() => <ProtectedRoute component={CasesNew} />} />
        <Route path="/cases/:id" component={() => <ProtectedRoute component={CaseDetail} />} />
        <Route path="/cases" component={() => <ProtectedRoute component={CasesList} />} />
        <Route path="/legal" component={Legal} />
        <Route component={() => <Redirect to="/login" />} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
