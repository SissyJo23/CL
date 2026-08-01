import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import Analyzer from "./analyzer";

const previewBase = import.meta.env.BASE_URL.replace(/\/$/, "");
const analyzerPath = `${previewBase}/app`;
const isAnalyzerRoute =
  window.location.pathname === analyzerPath ||
  window.location.pathname.startsWith(`${analyzerPath}/`);

createRoot(document.getElementById("root")!).render(
  isAnalyzerRoute ? <Analyzer /> : <App />,
);
