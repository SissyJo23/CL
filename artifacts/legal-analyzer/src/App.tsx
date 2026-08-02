import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import Dashboard from "./pages/home";
import CasesIndex from "./pages/cases/list";
import CasesNew from "./pages/cases/new";
import CasesShow from "./pages/cases/show";
import CasesEdit from "./pages/cases/edit";
import CasesReport from "./pages/cases/report";
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
import { API_BASE, clearToken, getToken, isDemoSession, isValidSession, setToken } from "./lib/api";

function DemoEntry() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/demo`)
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? "The demo case is unavailable.");
        }
        return response.json() as Promise<{ caseId: number }>;
      })
      .then(({ caseId }) => {
        if (cancelled) return;
        setToken("demo-session");
        setLocation(`/cases/${caseId}`);
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "The demo case is unavailable.");
      });

    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-background px-6 text-center text-muted-foreground">
      {error ? (
        <div>
          <p className="font-medium text-foreground">Demo unavailable</p>
          <p className="mt-2 text-sm">{error}</p>
          <a className="mt-4 inline-block text-sm text-primary underline" href="/app">Open the app</a>
        </div>
      ) : "Opening the CaseLight demo…"}
    </div>
  );
}

function AppEntry() {
  const token = getToken();
  const [state, setState] = useState<"loading" | "signed-out" | "signed-in">(
    token && !isDemoSession() && isValidSession() ? "loading" : "signed-out",
  );

  useEffect(() => {
    if (!token || isDemoSession() || !isValidSession()) {
      if (token) clearToken();
      setState("signed-out");
      return;
    }

    let cancelled = false;
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Session expired");
        if (!cancelled) setState("signed-in");
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setState("signed-out");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state === "signed-in") return <Dashboard />;
  if (state === "loading") {
    return <div className="min-h-[100dvh] grid place-items-center bg-background text-sm text-muted-foreground">Opening your CaseLight workspace…</div>;
  }
  return <AuthLogin />;
}

function ProtectedRoute({ component: Component, ...rest }: { component: any, [key: string]: any }) {
  const [, setLocation] = useLocation();
  const isAuthenticated = isValidSession();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;
  return <Component {...rest} />;
}

export default function App() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/login" component={AuthLogin} />
      <Route path="/register" component={Register} />
      <Route path="/about" component={About} />
      <Route path="/legal" component={Legal} />
      <Route path="/demo" component={DemoEntry} />

      {/* The app entry is the real CaseLight account/workspace entry. */}
      <Route path="/" component={AppEntry} />
      <Route path="/cases">
        {(params) => <ProtectedRoute component={CasesIndex} {...params} />}
      </Route>
      <Route path="/cases/new">
        {(params) => <ProtectedRoute component={CasesNew} {...params} />}
      </Route>
      <Route path="/cases/:caseId/motions/:id">
        {(params) => <ProtectedRoute component={MotionShow} {...params} />}
      </Route>
      <Route path="/cases/:caseId/motions">
        {(params) => <ProtectedRoute component={MotionList} {...params} />}
      </Route>
      <Route path="/cases/:caseId/court/:id/run">
        {(params) => <ProtectedRoute component={CourtRun} {...params} />}
      </Route>
      <Route path="/cases/:caseId/court/:id">
        {(params) => <ProtectedRoute component={CourtShow} {...params} />}
      </Route>
      <Route path="/cases/:caseId/court/new">
        {(params) => <ProtectedRoute component={CourtNew} {...params} />}
      </Route>
      <Route path="/cases/:caseId/documents/:id">
        {(params) => <ProtectedRoute component={DocumentsShow} {...params} />}
      </Route>
      <Route path="/cases/:id/pattern">
        {(params) => <ProtectedRoute component={CasesPattern} {...params} />}
      </Route>
      <Route path="/cases/:id/relief">
        {(params) => <ProtectedRoute component={CasesRelief} {...params} />}
      </Route>
      <Route path="/cases/:id/edit">
        {(params) => <ProtectedRoute component={CasesEdit} {...params} />}
      </Route>
      <Route path="/cases/:id/report">
        {(params) => <ProtectedRoute component={CasesReport} {...params} />}
      </Route>
      <Route path="/cases/:id">
        {(params) => <ProtectedRoute component={CasesShow} {...params} />}
      </Route>
      
      {/* Target Document Upload Views Layout */}
      <Route path="/documents">
        {(params) => <ProtectedRoute component={DocumentsIndex} {...params} />}
      </Route>
      <Route path="/documents/:id">
        {(params) => <ProtectedRoute component={DocumentsShow} {...params} />}
      </Route>
      <Route path="/documents/:id/nomerit">
        {(params) => <ProtectedRoute component={DocumentsNomerit} {...params} />}
      </Route>
      
      <Route path="/court/:id">
        {(params) => <ProtectedRoute component={CourtRun} {...params} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}
