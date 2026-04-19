import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Printer,
  Milestone,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Shield,
  Scale,
  Star,
  ChevronRight,
  AlertTriangle,
  Info,
} from "lucide-react";

type LadderStep = {
  step: number;
  court: string;
  description: string;
  status: "Completed" | "Pending" | "Available" | "Blocked";
  completedAt: string | null;
  notes: string | null;
};

type FederalReadyClaim = {
  issueTitle: string;
  amendment: string;
  readyReason: string;
};

type ExecutiveOption = {
  option: string;
  body: string;
  description: string;
  eligibilityNote: string;
};

type AdminOption = {
  option: string;
  body: string;
  description: string;
  eligibilityNote: string;
};

type ReliefPathway = {
  id: number;
  caseId: number;
  jurisdiction: string | null;
  ladderStatus: LadderStep[] | null;
  aedpaDeadline: string | null;
  aedpaTolled: boolean;
  federalReadyClaims: FederalReadyClaim[] | null;
  martinezApplies: boolean | null;
  executiveOptions: ExecutiveOption[] | null;
  administrativeOptions: AdminOption[] | null;
  createdAt: string;
  updatedAt: string;
  aedpaIsEstimate?: boolean;
  martinezReason?: string | null;
};

function StatusBadge({ status }: { status: LadderStep["status"] }) {
  const styles: Record<LadderStep["status"], string> = {
    Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Available: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Pending: "bg-muted text-muted-foreground",
    Blocked: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function AedpaClock({ deadline, tolled, isEstimate }: { deadline: string; tolled: boolean; isEstimate?: boolean }) {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;
  const isUrgent = !isExpired && diffDays <= 90;

  return (
    <div className={`rounded-xl border overflow-hidden ${isExpired ? "border-red-300 dark:border-red-800/60" : isUrgent ? "border-amber-300 dark:border-amber-800/60" : "border-blue-200 dark:border-blue-800/60"}`}>
      <div className={`px-5 py-4 border-b flex items-center gap-3 ${isExpired ? "bg-red-50/60 dark:bg-red-900/10 border-red-300 dark:border-red-800/60" : isUrgent ? "bg-amber-50/60 dark:bg-amber-900/10 border-amber-300 dark:border-amber-800/60" : "bg-blue-50/60 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/60"}`}>
        <Clock className={`w-5 h-5 ${isExpired ? "text-red-600" : isUrgent ? "text-amber-600" : "text-blue-600"}`} />
        <h2 className={`text-lg font-serif font-medium ${isExpired ? "text-red-900 dark:text-red-200" : isUrgent ? "text-amber-900 dark:text-amber-200" : "text-blue-900 dark:text-blue-200"}`}>
          AEDPA Clock
        </h2>
        {tolled && (
          <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs">
            Tolling Active
          </Badge>
        )}
      </div>
      <div className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AEDPA Deadline
            </div>
            <div className={`text-2xl font-bold font-mono ${isExpired ? "text-red-600 dark:text-red-400" : isUrgent ? "text-amber-700 dark:text-amber-400" : "text-blue-700 dark:text-blue-400"}`}>
              {new Date(deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            {isEstimate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="w-3 h-3" />
                Estimated — verify with actual sentencing order
              </div>
            )}
          </div>
          <div className={`shrink-0 text-center px-6 py-3 rounded-xl ${isExpired ? "bg-red-100 dark:bg-red-900/20" : isUrgent ? "bg-amber-100 dark:bg-amber-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}>
            {isExpired ? (
              <div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">EXPIRED</div>
                <div className="text-xs text-red-600 dark:text-red-400">{Math.abs(diffDays)} days ago</div>
              </div>
            ) : (
              <div>
                <div className={`text-3xl font-bold tabular-nums ${isUrgent ? "text-amber-700 dark:text-amber-400" : "text-blue-700 dark:text-blue-400"}`}>
                  {diffDays}
                </div>
                <div className={`text-xs ${isUrgent ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>days remaining</div>
              </div>
            )}
          </div>
        </div>

        {isExpired && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm text-red-800 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">Deadline has passed.</span> Exceptions may still apply: actual innocence (Schlup v. Delo), equitable tolling (Holland v. Florida), or if the deadline is incorrectly calculated. Consult with counsel immediately.
            </div>
          </div>
        )}
        {!isExpired && isUrgent && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span><span className="font-semibold">Urgent:</span> Fewer than 90 days remain. Federal habeas petition must be filed promptly.</span>
          </div>
        )}
        {tolled && (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg text-sm text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Clock is currently <span className="font-semibold">tolled</span> while a properly filed state post-conviction proceeding is pending (28 U.S.C. § 2244(d)(2)).</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReliefPage() {
  const params = useParams();
  const caseId = parseInt(params.id || "0", 10);

  const [pathway, setPathway] = useState<ReliefPathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPathway = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/relief-pathway`);
      if (res.status === 404) {
        setError("Case not found. The case you are looking for does not exist.");
      } else if (res.status === 422) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? "This case's jurisdiction is not currently supported. Relief Pathway Engine supports Wisconsin cases only.");
      } else if (res.ok) {
        const data = await res.json();
        setPathway(data);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Failed to load relief pathway.");
      }
    } catch {
      setError("Failed to load relief pathway.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) fetchPathway();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/relief-pathway/regenerate`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setPathway(data);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Failed to regenerate.");
      }
    } catch {
      setError("Failed to regenerate relief pathway.");
    } finally {
      setRegenerating(false);
    }
  };

  const ladder = pathway?.ladderStatus ?? [];
  const federalClaims = pathway?.federalReadyClaims ?? [];
  const executive = pathway?.executiveOptions ?? [];
  const admin = pathway?.administrativeOptions ?? [];

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
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Milestone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-medium tracking-tight">Relief Pathway Engine</h1>
            <p className="text-sm text-muted-foreground">Wisconsin judicial ladder, AEDPA clock, federal-ready claims, and executive options</p>
          </div>
          {pathway && (
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              {regenerating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Regenerating…</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" />Regenerate</>
              )}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-5 bg-muted/40 rounded-xl border border-border">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Generating relief pathway…</p>
                <p className="text-xs text-muted-foreground mt-0.5">Analyzing case findings, mapping the judicial ladder, and assessing federal readiness.</p>
              </div>
            </div>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Error loading relief pathway</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        ) : !pathway ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Milestone className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif font-medium">No Relief Pathway Yet</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Generate a complete post-conviction relief pathway including the Wisconsin judicial ladder, AEDPA deadline, federal-ready claims, and executive options.
              </p>
            </div>
            <Button onClick={fetchPathway} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Milestone className="w-4 h-4 mr-2" />
              Generate Relief Pathway
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="text-xs text-muted-foreground text-right">
              Last generated: {new Date(pathway.updatedAt).toLocaleString()}
            </div>

            <section>
              <div className="flex items-center gap-2 mb-5">
                <Scale className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-serif font-medium">1. Judicial Ladder</h2>
              </div>
              <div className="relative">
                {ladder.map((step, i) => {
                  const isCompleted = step.status === "Completed";
                  const isAvailable = step.status === "Available";
                  const isBlocked = step.status === "Blocked";
                  const isLast = i === ladder.length - 1;

                  let dotColor = "bg-muted border-border";
                  let lineColor = "bg-border";
                  if (isCompleted) { dotColor = "bg-emerald-500 border-emerald-500"; lineColor = "bg-emerald-200 dark:bg-emerald-800/40"; }
                  else if (isAvailable) { dotColor = "bg-blue-500 border-blue-500"; lineColor = "bg-border"; }
                  else if (isBlocked) { dotColor = "bg-red-400 border-red-400"; }

                  return (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${dotColor}`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : isAvailable ? (
                            <ChevronRight className="w-4 h-4 text-white" />
                          ) : isBlocked ? (
                            <AlertCircle className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">{step.step}</span>
                          )}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-1 ${lineColor}`} style={{ minHeight: "2rem" }} />
                        )}
                      </div>
                      <div className={`pb-6 flex-1 ${isLast ? "" : ""}`}>
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-semibold text-sm ${isAvailable ? "text-blue-700 dark:text-blue-400" : isCompleted ? "text-emerald-700 dark:text-emerald-400" : isBlocked ? "text-red-700 dark:text-red-400" : "text-foreground/60"}`}>
                                {step.court}
                              </span>
                              <StatusBadge status={step.status} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{step.description}</p>
                          </div>
                          {step.completedAt && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              {new Date(step.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {step.notes && (
                          <div className={`mt-2 text-xs leading-snug px-3 py-2 rounded-lg ${isBlocked ? "bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300" : isAvailable ? "bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300" : "bg-muted/60 text-foreground/70"}`}>
                            {step.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {pathway.aedpaDeadline && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-serif font-medium">2. AEDPA Clock</h2>
                </div>
                <AedpaClock
                  deadline={pathway.aedpaDeadline}
                  tolled={pathway.aedpaTolled}
                  isEstimate={pathway.aedpaIsEstimate}
                />
              </section>
            )}

            <section>
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-serif font-medium">3. Federal-Ready Claims</h2>
              </div>
              {federalClaims.length === 0 ? (
                <div className="rounded-xl border border-border p-5 text-sm text-muted-foreground italic">
                  No findings currently meet the federal exhaustion standard (5th, 6th, or 14th Amendment + Preserved status). Analyze more documents or update procedural status on existing findings.
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="divide-y divide-border">
                    {federalClaims.map((claim, i) => (
                      <div key={i} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-foreground">{claim.issueTitle}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium">
                                {claim.amendment} Amendment
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-snug">{claim.readyReason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-5">
                <Star className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-serif font-medium">4. Martinez v. Ryan</h2>
              </div>
              <div className={`rounded-xl border overflow-hidden ${pathway.martinezApplies ? "border-amber-200 dark:border-amber-800/60" : "border-border"}`}>
                <div className={`px-5 py-4 border-b flex items-center gap-3 ${pathway.martinezApplies ? "bg-amber-50/60 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/60" : "bg-muted/30 border-border"}`}>
                  <span className={`text-sm font-semibold ${pathway.martinezApplies ? "text-amber-900 dark:text-amber-200" : "text-muted-foreground"}`}>
                    {pathway.martinezApplies ? "Martinez v. Ryan May Apply" : "Martinez v. Ryan Does Not Apply"}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`ml-auto text-xs ${pathway.martinezApplies ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}
                  >
                    {pathway.martinezApplies ? "Potentially Applicable" : "Not Applicable"}
                  </Badge>
                </div>
                <div className="p-5 space-y-3">
                  {pathway.martinezReason && (
                    <p className="text-sm text-foreground/80 leading-relaxed">{pathway.martinezReason}</p>
                  )}
                  <div className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-lg p-3 space-y-1">
                    <p className="font-semibold text-foreground/70">What is Martinez v. Ryan?</p>
                    <p>
                      <span className="font-medium">Martinez v. Ryan</span>, 566 U.S. 1 (2012), held that where a State requires a prisoner to raise an ineffective assistance of trial counsel (IAC) claim in a collateral proceeding, a prisoner may establish "cause" to excuse procedural default of that claim if: (1) the state courts did not appoint counsel in the initial-review collateral proceeding; or (2) appointed counsel in that proceeding was ineffective under Strickland v. Washington. This doctrine allows otherwise defaulted IAC claims to reach federal habeas review.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-5">
                <Milestone className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-serif font-medium">5. Executive & Administrative Options</h2>
              </div>

              {executive.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Executive Relief (Wisconsin)</h3>
                  <div className="grid gap-3">
                    {executive.map((opt, i) => (
                      <div key={i} className="rounded-xl border border-border p-4 space-y-2 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{opt.option}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{opt.body}</span>
                        </div>
                        <p className="text-sm text-foreground/75 leading-relaxed">{opt.description}</p>
                        {opt.eligibilityNote && (
                          <div className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                            <Info className="w-3 h-3 mt-0.5 shrink-0" />
                            {opt.eligibilityNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {admin.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Administrative Relief (Wisconsin)</h3>
                  <div className="grid gap-3">
                    {admin.map((opt, i) => (
                      <div key={i} className="rounded-xl border border-border p-4 space-y-2 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{opt.option}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{opt.body}</span>
                        </div>
                        <p className="text-sm text-foreground/75 leading-relaxed">{opt.description}</p>
                        {opt.eligibilityNote && (
                          <div className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                            <Info className="w-3 h-3 mt-0.5 shrink-0" />
                            {opt.eligibilityNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {executive.length === 0 && admin.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No executive or administrative options available.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
