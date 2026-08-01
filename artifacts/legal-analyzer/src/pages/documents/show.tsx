import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, CircleAlert, FileText, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { API_BASE, getToken } from "@/lib/api";

type DocumentRecord = {
  id: number;
  title: string;
  status: string;
  content?: string | null;
  createdAt: string;
  findingCount?: number | null;
};

export default function DocumentsShow() {
  const { caseId, id } = useParams<{ caseId: string; id: string }>();
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!caseId || !id) return;
    fetch(`${API_BASE}/api/cases/${caseId}/documents/${id}`, {
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      credentials: "include",
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Document not found")))
      .then(setDocument)
      .catch((err) => setError(err instanceof Error ? err.message : "Document not found"));
  }, [caseId, id]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-8">
        <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to case
        </Link>
        {error ? (
          <div className="mt-12 text-center">
            <CircleAlert className="mx-auto mb-4 h-9 w-9 text-destructive" />
            <p className="font-serif text-xl text-foreground">{error}</p>
          </div>
        ) : !document ? (
          <div className="mt-16 text-center text-muted-foreground">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
            Loading document…
          </div>
        ) : (
          <section className="mt-8 border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4 border-b border-border pb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Case document</p>
                <h1 className="mt-1 font-serif text-2xl text-foreground">{document.title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {document.status} · {document.findingCount ?? 0} findings · added {new Date(document.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {document.content || "Document text is still being extracted. This page will update when processing is complete."}
            </div>
          </section>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}