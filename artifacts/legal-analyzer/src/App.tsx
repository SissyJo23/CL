import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserModeProvider } from "@/contexts/UserModeContext";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cases" component={CaseList} />
      <Route path="/cases/new" component={CaseNew} />
      <Route path="/cases/:id" component={CaseShow} />
      <Route path="/cases/:id/pattern" component={PatternPage} />
      <Route path="/cases/:id/relief" component={ReliefPage} />
      <Route path="/cases/:caseId/documents/:id" component={DocumentShow} />
      <Route path="/cases/:caseId/documents/:id/nomerit" component={NomeritPage} />
      <Route path="/cases/:id/court/new" component={CourtNew} />
      <Route path="/cases/:caseId/court/:id/run" component={CourtRun} />
      <Route path="/cases/:caseId/court/:id" component={CourtShow} />
      <Route path="/cases/:caseId/motions" component={MotionList} />
      <Route path="/cases/:caseId/motions/:id" component={MotionShow} />
      <Route path="/about" component={About} />
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
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </UserModeProvider>
    </QueryClientProvider>
  );
}

export default App;
