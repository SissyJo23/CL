import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setBaseUrl } from "@workspace/api-client-react";
import { UserModeProvider } from "@/contexts/UserModeContext";
import App from "./App";
import "./index.css";

setBaseUrl("https://caselight-api.onrender.com");

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserModeProvider>
        <App />
      </UserModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
