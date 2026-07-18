import { Route, Router as WouterRouter, Switch, Redirect } from "wouter";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import Login from "@/pages/auth/login";
import Home from "@/pages/home";
import CasesNew from "@/pages/cases/new";
import CasesList from "@/pages/cases/list";
import CaseShow from "@/pages/cases/show";
import CasesEdit from "@/pages/cases/edit"; // Import the new edit page
import Legal from "@/pages/legal";

// ✅ POINT FRONTEND TO YOUR RENDER BACKEND
const API_BASE_URL = "https://caselight-api.onrender.com/api";
setBaseUrl(API_BASE_URL);

// ✅ Attach auth token to every request
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
        {/* Guard route placement: :id/edit must come BEFORE :id */}
        <Route path="/cases/:id/edit" component={() => <ProtectedRoute component={CasesEdit} />} />
        <Route path="/cases/:id" component={() => <ProtectedRoute component={CaseShow} />} />
        <Route path="/cases" component={() => <ProtectedRoute component={CasesList} />} />
        <Route path="/legal" component={Legal} />
        <Route component={() => <Redirect to="/login" />} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
