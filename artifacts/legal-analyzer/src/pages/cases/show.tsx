import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Download,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Scale,
  Shield,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { API_BASE, getToken } from "@/lib/api";

type CaseRecord = {
  id: number;
  title: string;
  defendantName?: string | null;
  caseNumber?: string | null;
  jurisdiction?: string | null;
};

type CaseDocument = {
  id: number;
  title: string;
  status: "pending" | "analyzing" | "analyzed" | "error" | "processing" | string;
  createdAt: string;
  updatedAt?: string;
  findingCount?: number | null;
  documentType?: string | null;
};

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function statusLabel(status: CaseDocument["status"]) {
  if (status === "analyzing" || status === "processing") return "Analyzing";
  if (status === "analyzed") return "Analyzed";
  if (status === "error") return "Needs attention";
  return "Queued";
}

function statusClass(status: CaseDocument["status"]) {
  if (status === "analyzed") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (status === "error") return "text-red-700 bg-red-50 border-red-200";
  if (status === "analyzing" || status === "processing") {
    return "text-amber-700 bg-amber-50 border-amber-200";
  }
  return "text-muted-foreground bg-muted border-border";
}

export default function CasesShow() {
  const { id } = useParams<{ id: string }>();
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadWorkspace = useCallback(async () => {
    if (!id) return;
    const headers = authHeaders();
    const [caseResponse, documentsResponse] = await Promise.all([
      fetch(`${API_BASE}/api/cases/${id}`, { headers, credentials: "include" }),
      fetch(`${API_BASE}/api/cases/${id}/documents`, { headers, credentials: "include" }),
    ]);
    if (!caseResponse.ok) throw new Error("Case not found.");
    if (!documentsResponse.ok) throw new Error("Could not load the case record.");
    setCaseRecord(await caseResponse.json());
    setDocuments(await documentsResponse.json());
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadWorkspace()
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this case."))
      .finally(() => setLoading(false));
  }, [loadWorkspace]);

  useEffect(() => {
    if (!documents.some((doc) => doc.status === "analyzing" || doc.status === "processing")) return;
    const timer = window.setInterval(() => {
      loadWorkspace().catch(() => undefined);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [documents, loadWorkspace]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!id || files.length === 0) return;

    setUploading(true);
    setError("");
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    body.append("documentType", "other");

    try {
      const response = await fetch(`${API_BASE}/api/cases/${id}/documents/upload`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Upload failed. Please try again.");
      }
      setDocuments((current) => [...(Array.isArray(payload) ? payload : []), ...current]);
      await loadWorkspace();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!id || !window.confirm("Delete this document and its analysis?")) return;
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/cases/${id}/documents/${documentId}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Could not delete this document.");
      setDocuments((current) => current.filter((document) => document.id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this document.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <Navbar />
        <main className="mx-auto max-w-5xl px-5 py-16 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
          Loading case workspace…
        </main>
      </div>
    );
  }

  if (!caseRecord) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-5 py-16 text-center">
          <CircleAlert className="mx-auto mb-4 h-10 w-10 text-destructive" />
          <h1 className="font-serif text-2xl text-foreground">This case could not be loaded</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error || "Please return to your cases and try again."}</p>
          <Link href="/cases" className="mt-6 inline-flex text-sm font-medium text-primary underline underline-offset-4">
            Back to Cases
          </Link>
        </main>
      </div>
    );
  }

  const analyzedCount = documents.filter((document) => document.status === "analyzed").length;

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="border-b border-border py-3">
          <Link href="/cases" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <section className="border-b border-border py-7 sm:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Case workspace
              </p>
              <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-5xl">{caseRecord.title}</h1>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                {caseRecord.caseNumber && <span>Case #: {caseRecord.caseNumber}</span>}
                {caseRecord.defendantName && <span>Defendant: {caseRecord.defendantName}</span>}
                {caseRecord.jurisdiction && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {caseRecord.jurisdiction}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Link href={`/cases/${id}/pattern`}>
                <Button variant="outline" size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Pattern Analysis
                </Button>
              </Link>
              <Link href={`/cases/${id}/court/new`}>
                <Button size="sm">
                  <Scale className="mr-2 h-4 w-4" />
                  Run Court Simulator
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto py-3 text-xs">
            <span className="inline-flex shrink-0 items-center gap-2 border border-primary bg-primary px-3 py-2 text-primary-foreground">
              <Scale className="h-4 w-4" />
              Case Record
            </span>
            <Link href={`/cases/${id}/relief`} className="inline-flex shrink-0 items-center gap-2 border border-border px-3 py-2 text-muted-foreground hover:bg-muted">
              <Shield className="h-4 w-4" />
              Relief Pathway
            </Link>
            <Link href={`/cases/${id}/court/new`} className="inline-flex shrink-0 items-center gap-2 border border-border px-3 py-2 text-muted-foreground hover:bg-muted">
              <ArrowRight className="h-4 w-4" />
              Court Simulator
            </Link>
          </div>
        </section>

        <section className="grid gap-3 border-b border-border py-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 border border-border bg-card px-4 py-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Federal Readiness</span>
            <span className="ml-auto text-xs font-medium text-muted-foreground">Full Pathway</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 border border-border bg-card px-4 py-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Record Documents</span>
            <span className="ml-auto text-sm font-medium text-foreground">{documents.length}</span>
          </div>
          <div className="flex items-center gap-3 border border-border bg-card px-4 py-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Findings Ready</span>
            <span className="ml-auto text-sm font-medium text-foreground">{analyzedCount}</span>
          </div>
        </section>

        {error && (
          <div className="mt-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <section className="py-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-foreground">Record Documents</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add transcripts, reports, and motions to the record. CaseLight analyzes them line by line.
              </p>
            </div>
            <label className={`inline-flex shrink-0 cursor-pointer items-center gap-2 border border-primary px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 ${uploading ? "pointer-events-none opacity-60" : ""}`}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Add Document"}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,.csv"
                multiple
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>

          {documents.length === 0 ? (
            <label className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-card px-6 text-center hover:border-primary/50 hover:bg-primary/[0.02]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center bg-muted">
                <Upload className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-serif text-lg text-foreground">No documents yet</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Add transcripts, reports, or motions to begin the analysis. You can select multiple files at once.
              </p>
              <span className="mt-5 inline-flex items-center border border-primary px-4 py-2 text-xs font-medium text-primary">
                Choose files
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,.csv"
                multiple
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          ) : (
            <div className="divide-y divide-border border border-border bg-card">
              {documents.map((document) => (
                <div key={document.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/cases/${id}/documents/${document.id}`} className="block truncate text-sm font-medium text-foreground hover:text-primary">
                        {document.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Added {new Date(document.createdAt).toLocaleDateString()}
                        {document.findingCount ? ` · ${document.findingCount} findings` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-[52px] sm:pl-0">
                    <span className={`border px-2 py-1 text-[11px] font-medium ${statusClass(document.status)}`}>
                      {document.status === "analyzing" || document.status === "processing" ? (
                        <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
                      ) : document.status === "analyzed" ? (
                        <Check className="mr-1 inline h-3 w-3" />
                      ) : null}
                      {statusLabel(document.status)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(document.id)}
                      className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-700"
                      aria-label={`Delete ${document.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Disclaimer />
    </div>
  );
}