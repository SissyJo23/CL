import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserModeProvider } from "@/contexts/UserModeContext";
import { isAuthenticated } from "@/lib/api";

import Home from "@/pages/home";
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
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRouter() {
  const [, setLocation] = useLocation();

  // Simple protected wrapper that avoids render-side effects
  const Protected = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated()) {
      // Small delay prevents router loop issues
      setTimeout(() => setLocation("/login"), 10);
      return null;
    }
    return <>{children}</>;
  };

  return (
    <Switch>
      {/* Public routes - always accessible */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Protected routes - redirect to login if not authenticated */}
      <Route path="/" component={() => (
        <Protected>
          <Home />
        </Protected>
      )} />
      
      <Route path="/cases" component={() => (
        <Protected>
          <CaseList />
        </Protected>
      )} />
      
      <Route path="/cases/new" component={() => (
        <Protected>
          <CaseNew />
        </Protected>
      )} />
      
      <Route path="/cases/:id" component={() => (
        <Protected>
          <CaseShow />
        </Protected>
      )} />
      
      <Route path="/cases/:id/pattern" component={() => (
        <Protected>
          <PatternPage />
        </Protected>
      )} />
      
      <Route path="/cases/:id/relief" component={() => (
        <Protected>
          <ReliefPage />
        </Protected>
      )} />
      
      <Route path="/cases/:caseId/documents/:id" component={() => (
        <Protected>
          <DocumentShow />
        </Protected>
      )} />
      
      <Route path="/cases/:caseId/documents/:id/nomerit" component={() => (
        <Protected>
          <NomeritPage />
        </Protected>
      )} />
      
      <Route path="/cases/:id/court/new" component={() => (
        <Protected>
          <CourtNew />
        </Protected>
      )} />
      
      <Route path="/cases/:caseId/court/:id/run" component={() => (
        <Protected>
          <CourtRun />
        </Protected>
      )} />
      
      <Route path="/cases/:caseId/court/:id" component={() => (
        <Protected>
          <CourtShow />
        </Protected>
      )} />
      
      <Route path="/cases/:caseId/motions" component={() => (
        <Protected>
          <MotionList />
        </Protected>
      )} />
      
      <Route path="/cases/:caseId/motions/:id" component={() => (
        <Protected>
          <MotionShow />
        </Protected>
      )} />
      
      <Route path="/about" component={() => (
        <Protected>
          <About />
        </Protected>
      )} />

      {/* Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserModeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRouter />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </UserModeProvider>
    </QueryClientProvider>
  );
}

export default App;
