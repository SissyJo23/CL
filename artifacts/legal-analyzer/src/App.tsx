import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import CaseNew from "@/pages/cases/new";
import CaseShow from "@/pages/cases/show";
import DocumentShow from "@/pages/documents/show";
import CourtNew from "@/pages/court/new";
import CourtRun from "@/pages/court/run";
import CourtShow from "@/pages/court/show";
import MotionShow from "@/pages/motions/show";
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
      <Route path="/cases/new" component={CaseNew} />
      <Route path="/cases/:id" component={CaseShow} />
      <Route path="/cases/:caseId/documents/:id" component={DocumentShow} />
      <Route path="/cases/:id/court/new" component={CourtNew} />
      <Route path="/cases/:caseId/court/:id/run" component={CourtRun} />
      <Route path="/cases/:caseId/court/:id" component={CourtShow} />
      <Route path="/cases/:caseId/motions/:id" component={MotionShow} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
