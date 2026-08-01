import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FolderOpen, Loader2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { API_BASE, getToken } from "@/lib/api";

type CaseSummary = {
  id: number;
  title: string;
  defendantName?: string | null;
  documentCount?: number | null;
  updatedAt: string;
};

export default function DocumentsIndex() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/cases`, {
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      credentials: "include",
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load cases")))
      .then(setCases)
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">CaseLight records</p>
          <h1 className="font-serif text-3xl text-foreground">Choose a case</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Documents belong to a case. Open a workspace to add transcripts, rulings, and filings.
          </p>
        </div>
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
            Loading your cases…
          </div>
        ) : cases.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-16 text-center">
            <FolderOpen className="mx-auto mb-4 h-9 w-9 text-muted-foreground" />
            <p className="font-serif text-lg text-foreground">No cases yet</p>
            <Link href="/cases/new" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4">
              Create your first case <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {cases.map((caseItem) => (
              <Link key={caseItem.id} href={`/cases/${caseItem.id}`} className="flex items-center gap-4 border border-border bg-card p-5 hover:border-primary/40 hover:bg-primary/[0.02]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{caseItem.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {caseItem.defendantName || "Case workspace"} · {caseItem.documentCount ?? 0} documents
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}