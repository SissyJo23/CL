import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, GitBranch, Loader2, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { API_BASE, getToken } from "@/lib/api";

type PatternResult = {
  status?: string;
  coercionScore?: number | null;
  narrativeSummary?: string | null;
  timeline?: Array<{ date?: string; event?: string; who?: string }>;
  identityFlags?: Array<{ field?: string; severity?: string; values?: string[] }>;
};

export default function CasesPattern() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<PatternResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cases/${id}/pattern-analysis`, { headers: { Authorization: `Bearer ${getToken() ?? ""}` } });
      if (res.ok) setResult(await res.json());
      else if (res.status !== 404) setMessage("Pattern analysis could not be loaded.");
    } catch {
      setMessage("Pattern analysis could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [id]);

  const run = async () => {
    setRunning(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/cases/${id}/pattern-analysis`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Pattern analysis failed.");
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Pattern analysis returned no progress stream.");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          const line = event.split("\n").find((item) => item.startsWith("data:"));
          if (!line) continue;
          const data = JSON.parse(line.slice(5).trim()) as { type?: string; message?: string };
          if (data.message) setMessage(data.message);
        }
      }
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pattern analysis failed.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="w-full max-w-4xl mx-auto flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Link href={`/cases/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to case
        </Link>
        <div className="mt-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">CaseLight analysis</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-serif"><GitBranch className="h-7 w-7 text-primary" /> Pattern Analysis</h1>
            <p className="mt-2 text-sm text-muted-foreground">Trace chronology, pressure points, and record inconsistencies across the case.</p>
          </div>
          <Button onClick={run} disabled={running} className="w-full sm:w-auto">
            {running ? <><Loader2 className="h-4 w-4 animate-spin" /> Running…</> : <><RefreshCw className="h-4 w-4" /> Run analysis</>}
          </Button>
        </div>
        {message && <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">{message}</div>}
        {loading ? <div className="py-12 text-sm text-muted-foreground">Loading pattern analysis…</div> : result ? (
          <div className="mt-6 space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Coercion score</p><p className="mt-1 text-3xl font-serif">{result.coercionScore ?? "—"}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Timeline events</p><p className="mt-1 text-3xl font-serif">{result.timeline?.length ?? 0}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Identity flags</p><p className="mt-1 text-3xl font-serif">{result.identityFlags?.length ?? 0}</p></div>
            </div>
            {result.narrativeSummary && <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-serif text-xl">Narrative summary</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/80">{result.narrativeSummary}</p></section>}
            {result.timeline && result.timeline.length > 0 && <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-serif text-xl">Timeline</h2><div className="mt-4 space-y-3">{result.timeline.map((item, index) => <div key={index} className="border-l-2 border-primary/30 pl-4"><p className="text-xs font-medium text-primary">{item.date}</p><p className="mt-1 text-sm font-medium">{item.event}</p>{item.who && <p className="mt-1 text-xs text-muted-foreground">{item.who}</p>}</div>)}</div></section>}
          </div>
        ) : <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center"><h2 className="font-serif text-xl">No analysis yet</h2><p className="mt-2 text-sm text-muted-foreground">Analyze at least one uploaded document, then run Pattern Analysis.</p></div>}
      </main>
      <Disclaimer />
    </div>
  );
}