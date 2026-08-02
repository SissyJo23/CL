import { Link, useParams } from "wouter";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  GitBranch,
  Loader2,
  Printer,
  RefreshCw,
  Scale,
  UserRound,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { API_BASE, getToken } from "@/lib/api";

type TimelineEntry = {
  date?: string;
  event?: string;
  who?: string;
  decision?: string;
  deferred?: string | null;
};

type IdentityFlag = {
  field?: string;
  values?: string[];
  documents?: string[];
  severity?: string;
};

type DecisionPoint = {
  date?: string;
  pendingMotions?: string;
  defendantPresent?: boolean;
  whatDefendantKnew?: string;
  choiceMade?: string;
};

type CoercionEntry = {
  date?: string;
  factor?: string;
  cumulativeScore?: number;
  description?: string;
};

type PatternAnalysis = {
  timeline?: TimelineEntry[] | null;
  identityFlags?: IdentityFlag[] | null;
  decisionPoints?: DecisionPoint[] | null;
  coercionTimeline?: CoercionEntry[] | null;
  coercionScore?: number | null;
  narrativeSummary?: string | null;
  status?: string;
  updatedAt?: string | Date;
};

const authHeaders = () => ({ Authorization: `Bearer ${getToken() ?? ""}` });

function SectionHeading({
  icon,
  number,
  children,
}: {
  icon: ReactNode;
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {number}
      </p>
      <h2 className="font-serif text-xl font-medium">{children}</h2>
    </div>
  );
}

function EmptySection({ children }: { children: ReactNode }) {
  return <p className="text-sm italic text-muted-foreground">{children}</p>;
}

function SeverityBadge({ severity }: { severity?: string }) {
  const normalized = (severity ?? "LOW").toUpperCase();
  const tone =
    normalized === "HIGH"
      ? "border-red-200 bg-red-50 text-red-800"
      : normalized === "MEDIUM"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold ${tone}`}>
      {normalized}
    </span>
  );
}

function scoreLabel(score: number) {
  if (score >= 80) return "Extreme";
  if (score >= 60) return "Severe";
  if (score >= 40) return "Significant";
  if (score >= 20) return "Moderate";
  return "Minimal";
}

function scoreTone(score: number) {
  if (score >= 80) return "bg-red-600";
  if (score >= 60) return "bg-red-500";
  if (score >= 40) return "bg-amber-500";
  if (score >= 20) return "bg-yellow-500";
  return "bg-blue-500";
}

function ProgressPanel({
  messages,
  progress,
  stale,
}: {
  messages: string[];
  progress?: number;
  stale?: boolean;
}) {
  const value = stale ? 100 : Math.max(5, Math.min(progress ?? 5, 100));

  return (
    <div className="overflow-hidden rounded-xl border border-primary/25 bg-card">
      <div className="flex items-center gap-3 border-b border-primary/20 bg-primary/5 px-5 py-4">
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
        <span className="font-medium">{stale ? "Analysis in progress…" : "Running Pattern Analysis…"}</span>
        {!stale && <span className="ml-auto text-sm font-medium text-primary">{value}%</span>}
      </div>
      {!stale && (
        <div className="px-5 pt-4">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${value}%` }} />
          </div>
        </div>
      )}
      <div className="space-y-2 p-5 text-sm text-foreground/80">
        {stale ? (
          <p>A pattern analysis is currently running for this case. Refresh the page in a moment to see the results.</p>
        ) : (
          messages.map((message, index) => (
            <div key={`${message}-${index}`} className="flex items-center gap-2">
              {index === messages.length - 1 ? (
                <Loader2 className="h-3 w-3 shrink-0 animate-spin text-primary" />
              ) : (
                <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
              )}
              <span>{message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CasesPattern() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(5);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/cases/${id}/pattern-analysis`, {
        headers: authHeaders(),
      });
      if (response.status === 404) {
        setAnalysis(null);
      } else if (!response.ok) {
        throw new Error("Pattern analysis could not be loaded.");
      } else {
        setAnalysis((await response.json()) as PatternAnalysis);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pattern analysis could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const run = async () => {
    setRunning(true);
    setError("");
    setMessages(["Starting pattern analysis…"]);
    setProgress(5);

    try {
      const response = await fetch(`${API_BASE}/api/cases/${id}/pattern-analysis`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Pattern analysis failed.");
      }
      if (!response.body) throw new Error("Pattern analysis returned no progress stream.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const steps = [10, 25, 45, 65, 80, 92];

      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const line = event.split("\n").find((item) => item.startsWith("data:"));
          if (!line) continue;
          const payload = JSON.parse(line.slice(5).trim()) as {
            type?: string;
            message?: string;
          };

          if (payload.type === "status" && payload.message) {
            setMessages((current) => [...current, payload.message as string]);
            setProgress((current) => steps[Math.min(steps.length - 1, Math.max(0, Math.floor(current / 15) + 1))] ?? 92);
          } else if (payload.type === "error") {
            throw new Error(payload.message ?? "Pattern analysis failed.");
          } else if (payload.type === "done") {
            setProgress(100);
            setMessages((current) => [...current, "Analysis complete."]);
            await load();
          }
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pattern analysis failed.");
    } finally {
      setRunning(false);
    }
  };

  const timeline = useMemo(() => (Array.isArray(analysis?.timeline) ? analysis.timeline : []), [analysis]);
  const identityFlags = useMemo(
    () => (Array.isArray(analysis?.identityFlags) ? analysis.identityFlags : []),
    [analysis],
  );
  const decisionPoints = useMemo(
    () => (Array.isArray(analysis?.decisionPoints) ? analysis.decisionPoints : []),
    [analysis],
  );
  const coercionTimeline = useMemo(
    () => (Array.isArray(analysis?.coercionTimeline) ? analysis.coercionTimeline : []),
    [analysis],
  );
  const score = Math.max(0, Math.min(100, analysis?.coercionScore ?? 0));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <div className="no-print mb-6 flex items-center justify-between gap-3">
          <Link href={`/cases/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to case
          </Link>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>

        <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <GitBranch className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">CaseLight analysis</p>
              <h1 className="mt-1 text-2xl font-serif font-medium sm:text-3xl">Pattern Recognition Analysis</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Chronological reconstruction of pressure points, record inconsistencies, and the structural possibility of voluntary consent.
              </p>
            </div>
          </div>
          {analysis?.status === "complete" && (
            <Button variant="outline" onClick={run} disabled={running} className="no-print w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Re-analyze
            </Button>
          )}
        </header>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : running ? (
          <ProgressPanel messages={messages} progress={progress} />
        ) : analysis?.status === "analyzing" ? (
          <ProgressPanel messages={[]} stale />
        ) : !analysis || analysis.status === "error" ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-5 py-16 text-center">
            <GitBranch className="h-10 w-10 text-primary/70" />
            <h2 className="mt-5 text-xl font-serif">No Pattern Analysis Yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Analyze at least one uploaded document, then run Pattern Analysis to reconstruct chronology, identify discrepancies, map coercion factors, and draft a case narrative.
            </p>
            <Button onClick={run} className="mt-6">
              <GitBranch className="mr-2 h-4 w-4" /> Run Pattern Analysis
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            <p className="text-right text-xs text-muted-foreground">
              Last analyzed: {analysis.updatedAt ? new Date(analysis.updatedAt).toLocaleString() : "—"}
            </p>

            <section className="print-block">
              <SectionHeading icon={<Clock3 className="h-5 w-5" />} number="01">
                Hearing timeline
              </SectionHeading>
              {timeline.length === 0 ? (
                <EmptySection>No timeline events extracted.</EmptySection>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="hidden grid-cols-[9rem_1.5fr_1fr_1.2fr] gap-4 bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                    <span>Date</span><span>Event</span><span>Attendees</span><span>Outcome / deferred</span>
                  </div>
                  <div className="divide-y divide-border">
                    {timeline.map((entry, index) => (
                      <div key={index} className="grid gap-2 px-4 py-4 md:grid-cols-[9rem_1.5fr_1fr_1.2fr] md:gap-4">
                        <div className="text-xs font-medium text-primary">{entry.date || "Undated"}</div>
                        <div>
                          <p className="text-sm leading-relaxed">{entry.event || "Event not described."}</p>
                          <p className="mt-1 text-xs text-muted-foreground md:hidden">{entry.who || "Attendees not specified."}</p>
                        </div>
                        <p className="hidden text-xs leading-relaxed text-muted-foreground md:block">{entry.who || "Not specified."}</p>
                        <div className="text-xs leading-relaxed">
                          {entry.decision && <p>{entry.decision}</p>}
                          {entry.deferred && (
                            <p className="mt-1 text-amber-700">
                              <AlertTriangle className="mr-1 inline h-3 w-3" /> Deferred: {entry.deferred}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="print-block">
              <SectionHeading icon={<UserRound className="h-5 w-5" />} number="02">
                Identity integrity
              </SectionHeading>
              {identityFlags.length === 0 ? (
                <EmptySection>No identity discrepancies detected.</EmptySection>
              ) : (
                <div className="space-y-3">
                  {identityFlags.map((flag, index) => (
                    <div key={index} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-medium">{flag.field || "Unidentified field"}</h3>
                        <SeverityBadge severity={flag.severity} />
                      </div>
                      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conflicting values</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(flag.values ?? []).map((value, valueIndex) => (
                              <span key={valueIndex} className="rounded bg-muted px-2 py-1 text-xs">{value}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source documents</p>
                          <p className="mt-1 text-sm text-foreground/75">{(flag.documents ?? []).join("; ") || "Not specified."}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="print-block">
              <SectionHeading icon={<FileText className="h-5 w-5" />} number="03">
                Decision points
              </SectionHeading>
              {decisionPoints.length === 0 ? (
                <EmptySection>No critical decision points extracted.</EmptySection>
              ) : (
                <div className="grid gap-4">
                  {decisionPoints.map((point, index) => (
                    <article key={index} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                          Decision point {index + 1} · {point.date || "Undated"}
                        </h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${point.defendantPresent ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                          {point.defendantPresent ? "Defendant present" : "Defendant not present"}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                        <div><p className="label">Pending motions</p><p className="mt-1 leading-relaxed text-foreground/80">{point.pendingMotions || "None specified."}</p></div>
                        <div><p className="label">What defendant knew</p><p className="mt-1 leading-relaxed text-foreground/80">{point.whatDefendantKnew || "Not specified."}</p></div>
                        <div><p className="label">Choice made</p><p className="mt-1 leading-relaxed font-medium">{point.choiceMade || "Not specified."}</p></div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="print-block">
              <SectionHeading icon={<Scale className="h-5 w-5" />} number="04">
                Coercion timeline
              </SectionHeading>
              {coercionTimeline.length === 0 ? (
                <EmptySection>No coercion factors extracted.</EmptySection>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium">Coercion index</span>
                      <span className="text-lg font-semibold">{score}/100 <span className="text-sm font-normal text-muted-foreground">— {scoreLabel(score)}</span></span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                      <div className={`h-3 rounded-full transition-all ${scoreTone(score)}`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="divide-y divide-border">
                      {coercionTimeline.map((entry, index) => {
                        const runningScore = Math.max(0, Math.min(100, entry.cumulativeScore ?? 0));
                        return (
                          <div key={index} className="grid gap-3 px-5 py-4 sm:grid-cols-[8rem_1fr] sm:gap-5">
                            <p className="text-xs font-medium text-primary">{entry.date || "Undated"}</p>
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold">{entry.factor || "Pressure factor"}</h3>
                                <span className="text-xs text-muted-foreground">Running score: {runningScore}/100</span>
                              </div>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                                <div className={`h-1.5 rounded-full ${scoreTone(runningScore)}`} style={{ width: `${runningScore}%` }} />
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-foreground/75">{entry.description || "No description provided."}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="print-block">
              <SectionHeading icon={<FileText className="h-5 w-5" />} number="05">
                Narrative summary
              </SectionHeading>
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                {analysis.narrativeSummary ? (
                  analysis.narrativeSummary.split(/\n\n+/).map((paragraph, index) => (
                    <p key={index} className="mb-4 text-sm leading-7 text-foreground/85 last:mb-0">{paragraph.trim()}</p>
                  ))
                ) : (
                  <EmptySection>No narrative summary available.</EmptySection>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}