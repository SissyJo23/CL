import { type ComponentType, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserModeProvider } from "@/contexts/UserModeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

import Home from "@/pages/home";
import LoginPage from "@/pages/login";
import CaseNew from "@/pages/cases/new";
import CaseList from "@/pages/cases/list";
import CaseShow from "@/pages/cases/show";
import PatternPage from "@/pages/cases/pattern";
import ReliefPage from "@/pages/cases/relief";
import DocumentShow from "@/pages/documents/show";
import NomeritPage from "@/pages/documents/nomerit";
import CourtNew from "@/pages/court/new";
import CourtRun from "@/pages/court/run";
import CourtShow from "@/pages/court/show";
import MotionShow from "@/pages/motions/show";
import MotionList from "@/pages/motions/list";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: ComponentType }) {
  const { authenticated, loading, authConfigured } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && authConfigured && !authenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, authConfigured, authenticated, navigate]);

  if (loading || (authConfigured && !authenticated)) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={() => <ProtectedRoute component={Home} />} />
      <Route path="/cases" component={() => <ProtectedRoute component={CaseList} />} />
      <Route path="/cases/new" component={() => <ProtectedRoute component={CaseNew} />} />
      <Route path="/cases/:id" component={() => <ProtectedRoute component={CaseShow} />} />
      <Route path="/cases/:id/pattern" component={() => <ProtectedRoute component={PatternPage} />} />
      <Route path="/cases/:id/relief" component={() => <ProtectedRoute component={ReliefPage} />} />
      <Route path="/cases/:caseId/documents/:id" component={() => <ProtectedRoute component={DocumentShow} />} />
      <Route path="/cases/:caseId/documents/:id/nomerit" component={() => <ProtectedRoute component={NomeritPage} />} />
      <Route path="/cases/:id/court/new" component={() => <ProtectedRoute component={CourtNew} />} />
      <Route path="/cases/:caseId/court/:id/run" component={() => <ProtectedRoute component={CourtRun} />} />
      <Route path="/cases/:caseId/court/:id" component={() => <ProtectedRoute component={CourtShow} />} />
      <Route path="/cases/:caseId/motions" component={() => <ProtectedRoute component={MotionList} />} />
      <Route path="/cases/:caseId/motions/:id" component={() => <ProtectedRoute component={MotionShow} />} />
      <Route path="/about" component={() => <ProtectedRoute component={About} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserModeProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </UserModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
