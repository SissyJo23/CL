import { useParams, Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Printer, GitBranch, RefreshCw, AlertCircle, Loader2, CheckCircle2, Clock, User, FileText, Scale, AlertTriangle } from "lucide-react";

type TimelineEntry = {
  date: string;
  event: string;
  who: string;
  decision: string;
  deferred: string | null;
};

type IdentityFlag = {
  field: string;
  values: string[];
  documents: string[];
  severity: "HIGH" | "MEDIUM" | "LOW";
};

type DecisionPoint = {
  date: string;
  pendingMotions: string;
  defendantPresent: boolean;
  whatDefendantKnew: string;
  choiceMade: string;
};

type CoercionEntry = {
  date: string;
  factor: string;
  cumulativeScore: number;
  description: string;
};

type PatternAnalysis = {
  id: number;
  caseId: number;
  timeline: TimelineEntry[] | null;
  identityFlags: IdentityFlag[] | null;
  decisionPoints: DecisionPoint[] | null;
  coercionTimeline: CoercionEntry[] | null;
  coercionScore: number | null;
  narrativeSummary: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function SeverityBadge({ severity }: { severity: "HIGH" | "MEDIUM" | "LOW" }) {
  const styles = {
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    MEDIUM: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    LOW: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${styles[severity]}`}>
      {severity}
    </span>
  );
}

function CoercionBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  let label = "Minimal";
  let barColor = "bg-blue-500";
  if (clamped >= 80) { label = "Extreme"; barColor = "bg-red-600"; }
  else if (clamped >= 60) { label = "Severe"; barColor = "bg-red-500"; }
  else if (clamped >= 40) { label = "Significant"; barColor = "bg-amber-500"; }
  else if (clamped >= 20) { label = "Moderate"; barColor = "bg-yellow-500"; }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Coercion Index</span>
        <span className="font-bold text-lg">{clamped}/100 — <span className="text-muted-foreground font-normal">{label}</span></span>
      </div>
      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default function PatternPage() {
  const params = useParams();
  const caseId = parseInt(params.id || "0", 10);

  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/pattern-analysis`);
      if (res.status === 404) {
        setAnalysis(null);
      } else if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      } else {
        setError("Failed to load pattern analysis.");
      }
    } catch {
      setError("Failed to load pattern analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const PROGRESS_STEPS = [10, 25, 45, 65, 80, 92, 100];

  const runAnalysis = async () => {
    abortRef.current = false;
    setRunning(true);
    setError(null);
    setStatusMessages(["Starting pattern analysis…"]);
    setProgress(5);

    try {
      const response = await fetch(`/api/cases/${caseId}/pattern-analysis`, { method: "POST" });

      if (!response.ok) {
        let msg = "Analysis failed.";
        try { const b = await response.json(); if (b?.error) msg = b.error; } catch { /* ignore */ }
        setError(msg);
        setRunning(false);
        return;
      }

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (abortRef.current) { reader.cancel(); break; }
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const event = JSON.parse(jsonStr);
            if (event.type === "status") {
              setStatusMessages((prev) => {
                const next = [...prev, event.message ?? ""];
                const stepIdx = Math.min(next.length - 1, PROGRESS_STEPS.length - 2);
                setProgress(PROGRESS_STEPS[stepIdx] ?? 90);
                return next;
              });
            } else if (event.type === "done") {
              setProgress(100);
              setStatusMessages((prev) => [...prev, "Analysis complete!"]);
              await fetchAnalysis();
            } else if (event.type === "error") {
              setError(event.message ?? "Analysis failed.");
            }
          } catch { /* ignore malformed SSE */ }
        }
      }
    } catch {
      setError("Connection lost during analysis.");
    } finally {
      setRunning(false);
    }
  };

  const timeline = analysis?.timeline ?? [];
  const identityFlags = analysis?.identityFlags ?? [];
  const decisionPoints = analysis?.decisionPoints ?? [];
  const coercionTimeline = analysis?.coercionTimeline ?? [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/cases/${caseId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case
          </Link>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-medium tracking-tight">Pattern Recognition Analysis</h1>
            <p className="text-sm text-muted-foreground">Chronological reconstruction of coercive pressures and structural impossibility of voluntary plea</p>
          </div>
          {analysis?.status === "complete" && (
            <Button variant="outline" size="sm" className="ml-auto" onClick={runAnalysis} disabled={running}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-analyze
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : running ? (
          <div className="border border-violet-200 dark:border-violet-800/60 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-violet-50/60 dark:bg-violet-900/10 border-b border-violet-200 dark:border-violet-800/60 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
              <span className="font-medium text-violet-900 dark:text-violet-200">Running Pattern Analysis…</span>
              <span className="ml-auto text-sm text-violet-600 dark:text-violet-400 font-medium">{progress}%</span>
            </div>
            <div className="px-5 pt-4 pb-2">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-violet-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="p-5 pt-3 space-y-2">
              {statusMessages.map((msg, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  {i === statusMessages.length - 1 ? (
                    <Loader2 className="w-3 h-3 text-violet-500 animate-spin shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  )}
                  {msg}
                </div>
              ))}
            </div>
          </div>
        ) : analysis?.status === "analyzing" && !running ? (
          <div className="border border-violet-200 dark:border-violet-800/60 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-violet-50/60 dark:bg-violet-900/10 border-b border-violet-200 dark:border-violet-800/60 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
              <span className="font-medium text-violet-900 dark:text-violet-200">Analysis in progress…</span>
            </div>
            <div className="p-5 text-sm text-muted-foreground">
              A pattern analysis is currently running for this case. Refresh the page in a moment to see the results.
            </div>
          </div>
        ) : !analysis || analysis.status === "error" ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-violet-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif font-medium">No Pattern Analysis Yet</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Run a pattern analysis to reconstruct the chronological sequence, identify coercion factors, expose identity discrepancies, and generate a federal-court narrative summary.
              </p>
              {analysis?.status === "error" && (
                <p className="text-sm text-destructive">The previous analysis encountered an error. You can try again.</p>
              )}
            </div>
            <Button onClick={runAnalysis} className="bg-violet-600 hover:bg-violet-700 text-white">
              <GitBranch className="w-4 h-4 mr-2" />
              Run Pattern Analysis
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="text-xs text-muted-foreground text-right">
              Last analyzed: {new Date(analysis.updatedAt).toLocaleString()}
            </div>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-violet-500" />
                <h2 className="text-xl font-serif font-medium">1. Hearing Timeline</h2>
              </div>
              {timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No timeline events extracted.</p>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70 w-36">Date</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70">Event</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70 w-40">Attendees</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70 w-48">Outcome / Deferred</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {timeline.map((entry, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{entry.date}</td>
                          <td className="px-4 py-3 text-foreground leading-snug">{entry.event}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs leading-snug">{entry.who}</td>
                          <td className="px-4 py-3 text-xs leading-snug">
                            {entry.decision && <div className="text-foreground/80">{entry.decision}</div>}
                            {entry.deferred && (
                              <div className="text-amber-600 dark:text-amber-400 mt-1">
                                <AlertTriangle className="w-3 h-3 inline mr-1" />
                                Deferred: {entry.deferred}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-violet-500" />
                <h2 className="text-xl font-serif font-medium">2. Identity Integrity</h2>
              </div>
              {identityFlags.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No identity discrepancies detected.</p>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70 w-40">Field</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70">Discrepancy</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70 w-48">Source Documents</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/70 w-24">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {identityFlags.map((flag, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{flag.field}</td>
                          <td className="px-4 py-3 text-foreground/80 leading-snug">
                            {flag.values.map((v, vi) => (
                              <div key={vi} className="text-xs bg-muted px-2 py-0.5 rounded inline-block mr-1 mb-1">{v}</div>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground leading-snug">
                            {flag.documents.join("; ")}
                          </td>
                          <td className="px-4 py-3">
                            <SeverityBadge severity={flag.severity} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-violet-500" />
                <h2 className="text-xl font-serif font-medium">3. Decision Points</h2>
              </div>
              {decisionPoints.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No critical decision points extracted.</p>
              ) : (
                <div className="grid gap-4">
                  {decisionPoints.map((dp, i) => (
                    <div key={i} className="rounded-xl border border-border p-5 space-y-3 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wide">
                          Decision Point {i + 1} — {dp.date}
                        </span>
                        <Badge variant={dp.defendantPresent ? "secondary" : "destructive"} className="text-xs">
                          {dp.defendantPresent ? "Defendant Present" : "Defendant Not Present"}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pending Motions</div>
                          <p className="text-foreground/80 leading-snug">{dp.pendingMotions}</p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What Defendant Knew</div>
                          <p className="text-foreground/80 leading-snug">{dp.whatDefendantKnew}</p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Choice Made</div>
                          <p className="text-foreground/80 leading-snug font-medium">{dp.choiceMade}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-violet-500" />
                <h2 className="text-xl font-serif font-medium">4. Coercion Timeline</h2>
              </div>
              {coercionTimeline.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No coercion factors extracted.</p>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border p-5">
                    <CoercionBar score={analysis.coercionScore ?? 0} />
                  </div>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                      {coercionTimeline.map((entry, i) => {
                        const pct = Math.max(0, Math.min(100, entry.cumulativeScore));
                        let barColor = "bg-blue-400";
                        if (pct >= 80) barColor = "bg-red-500";
                        else if (pct >= 60) barColor = "bg-red-400";
                        else if (pct >= 40) barColor = "bg-amber-400";
                        else if (pct >= 20) barColor = "bg-yellow-400";

                        return (
                          <div key={i} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 text-xs text-muted-foreground w-32 mt-0.5">{entry.date}</div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold text-foreground">{entry.factor}</span>
                                  <span className="text-xs text-muted-foreground">Running score: {pct}/100</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-sm text-foreground/75 leading-snug">{entry.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-violet-500" />
                <h2 className="text-xl font-serif font-medium">5. Narrative Summary</h2>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                {analysis.narrativeSummary ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {analysis.narrativeSummary.split(/\n\n+/).map((para, i) => (
                      <p key={i} className="text-sm text-foreground/85 leading-relaxed mb-4 last:mb-0">
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No narrative summary available.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
