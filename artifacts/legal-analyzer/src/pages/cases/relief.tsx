import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Map } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { API_BASE, getToken } from "@/lib/api";

type ReliefResult = { jurisdiction?: string | null; ladderStatus?: Array<{ step: number; court: string; description: string; status: string }>; federalReadyClaims?: Array<{ issueTitle: string; amendment: string; readyReason: string }> };

export default function CasesRelief() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<ReliefResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/cases/${id}/relief-pathway`, { headers: { Authorization: `Bearer ${getToken() ?? ""}` } })
      .then(async (res) => { if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Relief pathway unavailable."); return res.json(); })
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : "Relief pathway unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Link href={`/cases/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to case</Link>
         <div className="mt-6 border-b border-border pb-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">CaseLight pathway</p><h1 className="mt-2 flex items-center gap-2 text-2xl font-serif sm:text-3xl"><Map className="h-6 w-6 shrink-0 text-primary sm:h-7 sm:w-7" /> Relief Pathway</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">A clear ladder from the current case posture toward available review and relief options.</p></div>
        {loading && <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Building pathway…</div>}
        {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">{error}</div>}
        {result && <div className="mt-6 space-y-5">
          <section className="rounded-xl border border-border bg-card p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">Jurisdiction</p><p className="mt-2 font-serif text-xl">{result.jurisdiction || "Not specified"}</p></section>
          <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-serif text-xl">Exhaustion ladder</h2><div className="mt-5 space-y-3">{(result.ladderStatus ?? []).map((step) => <div key={step.step} className="flex gap-3 rounded-lg border border-border/70 p-3"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{step.step}</div><div><p className="font-medium">{step.court}</p><p className="text-sm text-muted-foreground">{step.description}</p><p className="mt-1 text-xs text-primary">{step.status}</p></div></div>)}</div></section>
          {(result.federalReadyClaims?.length ?? 0) > 0 && <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-serif text-xl">Federal-ready claims</h2><div className="mt-4 space-y-3">{result.federalReadyClaims?.map((claim, index) => <div key={index} className="flex gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm font-medium">{claim.issueTitle} · {claim.amendment}</p><p className="mt-1 text-xs text-muted-foreground">{claim.readyReason}</p></div></div>)}</div></section>}
        </div>}
      </main>
      <Disclaimer />
    </div>
  );
}