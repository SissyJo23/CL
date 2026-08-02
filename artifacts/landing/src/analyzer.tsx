import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import { Router } from "wouter";
import { UserModeProvider } from "@analyzer/contexts/UserModeContext";
import AnalyzerApp from "@analyzer/App";
import "@analyzer/index.css";
import { getToken } from "@analyzer/lib/api";

setBaseUrl("https://caselight-api.onrender.com");
setAuthTokenGetter(async () => getToken());

const queryClient = new QueryClient();
const previewBase = import.meta.env.BASE_URL.replace(/\/$/, "");
const analyzerBase = `${previewBase}/app`;

export default function Analyzer() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserModeProvider>
        <Router base={analyzerBase}>
          <AnalyzerApp />
        </Router>
      </UserModeProvider>
    </QueryClientProvider>
  );
}