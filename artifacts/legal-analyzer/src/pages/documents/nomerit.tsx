import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Printer, Copy, CheckCircle2, AlertTriangle, Scale, FileText, Shield, Gavel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ClaimDismissed = {
  issueTitle: string;
  counselReasoning: string;
  pageRef: string | null;
};

type MissedFinding = {
  findingTitle: string;
  findingExcerpt: string;
  whyMissed: string;
};

type ArguableIssue = {
  issueTitle: string;
  findingBasis: string;
  arguableStandard: string;
  estimatedStrength: "weak" | "moderate" | "strong";
};

type IaacArgument = {
  issueTitle: string;
  counselFailure: string;
  prong1: string;
  prong2: string;
  martinezApplicable: boolean;
  martinezReason: string | null;
};

type NomeritAnalysis = {
  id: number;
  documentId: number;
  caseId: number;
  claimsDismissed: ClaimDismissed[] | null;
  missedFindings: MissedFinding[] | null;
  arguableIssues: ArguableIssue[] | null;
  iaacArguments: IaacArgument[] | null;
  martinezApplicable: boolean | null;
  draftMotionText: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function StrengthBadge({ strength }: { strength: string }) {
  if (strength === "strong") return <Badge className="bg-red-100 text-red-800 border-red-200">Strong</Badge>;
  if (strength === "moderate") return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Moderate</Badge>;
  return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Weak</Badge>;
}

export default function NomeritPage() {
  const params = useParams();
  const caseId = parseInt(params.caseId || "0", 10);
  const documentId = parseInt(params.id || "0", 10);
  const { toast } = useToast();

  const [analysis, setAnalysis] = useState<NomeritAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cases/${caseId}/documents/${documentId}/nomerit-analysis`)
      .then((r) => {
        if (!r.ok) throw new Error("Analysis not found");
        return r.json();
      })
      .then((data) => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load analysis");
        setLoading(false);
      });
  }, [caseId, documentId]);

  const handleCopy = async () => {
    if (!analysis?.draftMotionText) return;
    await navigator.clipboard.writeText(analysis.draftMotionText);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const claimsDismissed = analysis?.claimsDismissed ?? [];
  const missedFindings = analysis?.missedFindings ?? [];
  const arguableIssues = analysis?.arguableIssues ?? [];
  const iaacArguments = analysis?.iaacArguments ?? [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background print:bg-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl print:px-0 print:py-4">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href={`/cases/${caseId}/documents/${documentId}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Document
          </Link>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">No-Merit Report</Badge>
            {analysis?.martinezApplicable && (
              <Badge className="bg-violet-100 text-violet-800 border-violet-200">Martinez v. Ryan Applicable</Badge>
            )}
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight">No-Merit Report Analysis</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            IAAC argument generation — Anders v. California / Smith v. Robbins standard
          </p>
        </div>

        {loading && (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-6 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-serif font-medium">Claims Counsel Dismissed</h2>
                <Badge variant="outline" className="ml-1">{claimsDismissed.length}</Badge>
              </div>
              {claimsDismissed.length === 0 ? (
                <p className="text-muted-foreground italic text-sm">No dismissed claims were identified in the report.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-[11px] tracking-wider w-[35%]">Issue</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-[11px] tracking-wider">Counsel's Reasoning</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-[11px] tracking-wider w-24">Page Ref</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claimsDismissed.map((claim, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium">{claim.issueTitle}</td>
                          <td className="px-4 py-3 text-foreground/80">{claim.counselReasoning}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{claim.pageRef ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-serif font-medium">Missed Findings</h2>
                <Badge variant="outline" className="ml-1">{missedFindings.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Case findings that counsel's report did not address.
              </p>
              {missedFindings.length === 0 ? (
                <p className="text-muted-foreground italic text-sm">Counsel appears to have addressed all extracted case findings.</p>
              ) : (
                <div className="grid gap-4">
                  {missedFindings.map((mf, i) => (
                    <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/40 dark:border-amber-800/40 dark:bg-amber-900/10 p-5">
                      <p className="font-semibold text-foreground mb-2">{mf.findingTitle}</p>
                      {mf.findingExcerpt && (
                        <blockquote className="border-l-2 border-amber-400 pl-3 italic text-sm text-foreground/80 mb-3">
                          "{mf.findingExcerpt}"
                        </blockquote>
                      )}
                      <p className="text-sm text-foreground/70">
                        <span className="font-medium text-foreground/90">Why missed: </span>
                        {mf.whyMissed}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-serif font-medium">Arguable Issues</h2>
                <Badge variant="outline" className="ml-1">{arguableIssues.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Missed findings that meet the Anders/Smith "arguable" standard — any non-frivolous argument qualifies.
              </p>
              {arguableIssues.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/20 p-6 text-center">
                  <p className="text-muted-foreground">No arguable issues were identified after gap analysis.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {arguableIssues.map((ai, i) => (
                    <div key={i} className="rounded-xl border border-violet-200 bg-violet-50/40 dark:border-violet-800/40 dark:bg-violet-900/10 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <p className="font-semibold text-foreground">{ai.issueTitle}</p>
                        <StrengthBadge strength={ai.estimatedStrength} />
                      </div>
                      <p className="text-sm text-foreground/80 mb-2">
                        <span className="font-medium text-foreground">Based on: </span>
                        {ai.findingBasis}
                      </p>
                      <p className="text-sm text-foreground/80">
                        <span className="font-medium text-foreground">Arguable because: </span>
                        {ai.arguableStandard}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-serif font-medium">IAAC Arguments</h2>
                <Badge variant="outline" className="ml-1">{iaacArguments.length}</Badge>
              </div>
              {iaacArguments.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/20 p-6 text-center">
                  <p className="text-muted-foreground">No IAAC arguments generated — no arguable issues found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {iaacArguments.map((arg, i) => (
                    <div key={i} className="rounded-xl border border-blue-200 bg-blue-50/20 dark:border-blue-800/40 dark:bg-blue-900/5 overflow-hidden">
                      <div className="px-5 py-4 bg-blue-50/60 dark:bg-blue-900/15 border-b border-blue-200 dark:border-blue-800/40 flex items-center justify-between">
                        <p className="font-semibold text-foreground">{arg.issueTitle}</p>
                        {arg.martinezApplicable && (
                          <Badge className="bg-violet-100 text-violet-800 border-violet-200 shrink-0">
                            <Shield className="w-3 h-3 mr-1" />
                            Martinez
                          </Badge>
                        )}
                      </div>
                      <div className="divide-y divide-blue-100 dark:divide-blue-800/20">
                        <div className="px-5 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">Counsel's Failure</p>
                          <p className="text-sm text-foreground/90 leading-relaxed">{arg.counselFailure}</p>
                        </div>
                        <div className="px-5 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">Prong 1 — Deficient Performance</p>
                          <p className="text-sm text-foreground/90 leading-relaxed">{arg.prong1}</p>
                        </div>
                        <div className="px-5 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">Prong 2 — Prejudice</p>
                          <p className="text-sm text-foreground/90 leading-relaxed">{arg.prong2}</p>
                        </div>
                        {arg.martinezApplicable && arg.martinezReason && (
                          <div className="px-5 py-4 bg-violet-50/40 dark:bg-violet-900/10">
                            <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400 mb-2">Martinez v. Ryan — Procedural Default Excuse</p>
                            <p className="text-sm text-foreground/90 leading-relaxed">{arg.martinezReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {analysis.draftMotionText && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-foreground" />
                    <h2 className="text-xl font-serif font-medium">Draft Motion</h2>
                  </div>
                  <div className="flex items-center gap-2 print:hidden">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />Copied</>
                      ) : (
                        <><Copy className="w-4 h-4 mr-2" />Copy to Clipboard</>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-6 max-h-[600px] overflow-y-auto print:max-h-none print:overflow-visible">
                  <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {analysis.draftMotionText}
                  </pre>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  This is a draft generated by AI for attorney review only. Verify all citations and record references before filing.
                </p>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
