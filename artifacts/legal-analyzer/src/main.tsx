import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { getToken } from "@/lib/api";

setBaseUrl("https://caselight-api.onrender.com");
setAuthTokenGetter(() => getToken());

createRoot(document.getElementById("root")!).render(<App />);
