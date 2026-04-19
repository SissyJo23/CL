import { useParams, Link } from "wouter";
import { useGetCase, getGetCaseQueryKey, useListDocuments, getListDocumentsQueryKey, useCreateDocument, useDeleteDocument, useListCourtSessions, getListCourtSessionsQueryKey, useGenerateCaseStrategy, useGetCaseStrategy, getGetCaseStrategyQueryKey } from "@workspace/api-client-react";
import type { CreateDocumentBodyDocumentType } from "@workspace/api-client-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, Upload, Plus, Download, Scale, AlertCircle, Loader2, CheckCircle2, Swords, Map as MapIcon, RefreshCw, Play, Zap, Trash2, Gavel, Clock, GitBranch, Milestone, User, Users, BookOpen, Shield, Star, ChevronRight, ChevronDown, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUserMode, type UserMode } from "@/contexts/UserModeContext";
import { MODE_LABELS } from "@/lib/modeContent";

const MODE_ICONS: Record<UserMode, React.ReactNode> = {
  inmate: <User className="w-3 h-3" />,
  advocate: <Users className="w-3 h-3" />,
  attorney: <Scale className="w-3 h-3" />,
  appellate: <BookOpen className="w-3 h-3" />,
};

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

type ReliefPathway = {
  id: number;
  caseId: number;
  jurisdiction: string | null;
  ladderStatus: LadderStep[] | null;
  aedpaDeadline: string | null;
  aedpaTolled: boolean;
  aedpaIsEstimate?: boolean;
  federalReadyClaims: FederalReadyClaim[] | null;
  martinezApplies: boolean | null;
  martinezReason?: string | null;
  createdAt: string;
  updatedAt: string;
};

const LADDER_SHORT: Record<number, string> = {
  1: "WI Circuit",
  2: "WI Court of Appeals",
  3: "WI Supreme Court",
  4: "U.S. District",
  5: "7th Circuit",
  6: "SCOTUS",
};

type PathwayResult =
  | { status: "ok"; data: ReliefPathway }
  | { status: "not_found" }
  | { status: "unsupported_jurisdiction" }
  | { status: "error" };

function truncateSentences(text: string, n: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, n).join(" ").trim();
}

type LiveStatus = {
  phase: "running" | "done" | "error";
  message: string;
  findingCount: number;
};

export default function CaseShow() {
  const params = useParams();
  const caseId = parseInt(params.id || "0", 10);
  const { mode, setMode } = useUserMode();
  const { data: currentCase, isLoading: caseLoading } = useGetCase(caseId, { query: { enabled: !!caseId, queryKey: getGetCaseQueryKey(caseId) } });
  const { data: documents, isLoading: docsLoading } = useListDocuments(caseId, { query: { enabled: !!caseId, queryKey: getListDocumentsQueryKey(caseId) } });
  const { data: strategyData, isLoading: strategyLoading } = useGetCaseStrategy(caseId, { query: { enabled: !!caseId, queryKey: getGetCaseStrategyQueryKey(caseId) } });
  const { data: courtSessions } = useListCourtSessions(caseId, { query: { enabled: !!caseId, queryKey: getListCourtSessionsQueryKey(caseId) } });
  const { data: pathwayResult, isLoading: reliefLoading } = useQuery<PathwayResult>({
    queryKey: ["relief-pathway", caseId],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${caseId}/relief-pathway`);
      if (res.status === 404) return { status: "not_found" } as PathwayResult;
      if (res.status === 422) return { status: "unsupported_jurisdiction" } as PathwayResult;
      if (!res.ok) return { status: "error" } as PathwayResult;
      const data = await res.json();
      return { status: "ok", data } as PathwayResult;
    },
    enabled: !!caseId,
    retry: false,
  });
  const reliefPathway = pathwayResult?.status === "ok" ? pathwayResult.data : null;
  const [federalExpanded, setFederalExpanded] = useState(true);

  const createDocument = useCreateDocument();
  const deleteDocument = useDeleteDocument();
  const generateStrategy = useGenerateCaseStrategy();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const strategy = strategyData?.strategy;
  const hasAnalysis = currentCase?.hasAnalysis;

  const pendingDocs = (documents ?? []).filter((d) => d.status === "pending" || d.status === "error");
  const hasPendingDocs = pendingDocs.length > 0;
  const hasAnyFindings = (documents ?? []).some((d) => (d.findingCount ?? 0) > 0);

  // Analyze All state
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [liveStatuses, setLiveStatuses] = useState<Map<number, LiveStatus>>(new Map());
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);
  const abortRef = useRef(false);

  const setLive = (docId: number, update: Partial<LiveStatus>) => {
    setLiveStatuses((prev) => {
      const next = new Map(prev);
      const cur = next.get(docId) ?? { phase: "running", message: "", findingCount: 0 };
      next.set(docId, { ...cur, ...update });
      return next;
    });
  };

  const analyzeDocument = async (docId: number): Promise<void> => {
    setLive(docId, { phase: "running", message: "Starting analysis…", findingCount: 0 });
    try {
      const response = await fetch(`/api/cases/${caseId}/documents/${docId}/analyze?mode=${mode}`, { method: "POST" });

      if (!response.ok) {
        let msg = "Analysis failed.";
        try { const b = await response.json(); if (b?.error) msg = b.error; } catch { /* ignore */ }
        setLive(docId, { phase: "error", message: msg });
        return;
      }

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let findingCount = 0;

      while (true) {
        if (abortRef.current) { reader.cancel(); return; }
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
            if (event.type === "finding") {
              findingCount++;
              setLive(docId, { phase: "running", message: `${findingCount} finding${findingCount === 1 ? "" : "s"} found…`, findingCount });
            } else if (event.type === "status") {
              setLive(docId, { message: event.message ?? "" });
            } else if (event.type === "done") {
              setLive(docId, { phase: "done", message: `${findingCount} finding${findingCount === 1 ? "" : "s"} extracted`, findingCount });
            } else if (event.type === "error") {
              setLive(docId, { phase: "error", message: event.message ?? "Analysis failed." });
            }
          } catch { /* ignore malformed SSE */ }
        }
      }
    } catch {
      setLive(docId, { phase: "error", message: "Connection lost during analysis." });
    }
  };

  const handleAnalyzeAll = async () => {
    const queue = (documents ?? []).filter((d) => d.status === "pending" || d.status === "error");
    if (queue.length === 0) return;

    abortRef.current = false;
    setIsRunningAll(true);
    setBatchProgress({ done: 0, total: queue.length });
    setLiveStatuses(new Map());

    let completed = 0;
    for (const doc of queue) {
      if (abortRef.current) break;
      await analyzeDocument(doc.id);
      completed++;
      setBatchProgress({ done: completed, total: queue.length });
    }

    setIsRunningAll(false);
    queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(caseId) });
    queryClient.invalidateQueries({ queryKey: getGetCaseQueryKey(caseId) });
    toast({
      title: "Analysis Complete",
      description: `All ${queue.length} document${queue.length === 1 ? "" : "s"} have been processed.`,
    });
  };

  const handleDeleteDocument = (docId: number) => {
    deleteDocument.mutate(
      { caseId, id: docId },
      {
        onSuccess: () => {
          setConfirmDeleteId(null);
          queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(caseId) });
          queryClient.invalidateQueries({ queryKey: getGetCaseQueryKey(caseId) });
          toast({ title: "Document removed" });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not delete document.", variant: "destructive" });
        },
      },
    );
  };

  const handleGenerateStrategy = () => {
    generateStrategy.mutate(
      { id: caseId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCaseStrategyQueryKey(caseId) });
          toast({ title: "Case Strategy Generated", description: "Cumulative error brief and strategic roadmap are ready." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to generate strategy. Make sure documents have been analyzed first.", variant: "destructive" });
        },
      },
    );
  };

  const [open, setOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<CreateDocumentBodyDocumentType>("transcript");
  const [docContent, setDocContent] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");

  const handleCreateDocument = () => {
    if (!docTitle || !docContent) {
      toast({ title: "Validation Error", description: "Title and content are required.", variant: "destructive" });
      return;
    }
    createDocument.mutate(
      { caseId, data: { title: docTitle, documentType: docType, content: docContent } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(caseId) });
          setOpen(false); setDocTitle(""); setDocContent("");
          toast({ title: "Document Added", description: "The document is now in the workspace." });
        },
        onError: () => { toast({ title: "Error", description: "Failed to add document.", variant: "destructive" }); },
      },
    );
  };

  const handleUploadDocument = async () => {
    if (uploadFiles.length === 0) {
      toast({ title: "Validation Error", description: "Please select at least one file.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      for (const file of uploadFiles) formData.append("files", file);
      formData.append("documentType", docType);

      const res = await fetch(`/api/cases/${caseId}/documents/upload`, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        toast({ title: "Upload Error", description: err.error ?? "Upload failed", variant: "destructive" });
        return;
      }
      const created: { title: string }[] = await res.json().catch(() => []);
      queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(caseId) });
      setOpen(false); setDocTitle(""); setUploadFiles([]);
      const count = created.length;
      toast({ title: count === 1 ? "Document Uploaded" : `${count} Documents Uploaded`, description: "Text extracted and documents are ready for analysis." });
    } catch {
      toast({ title: "Upload Error", description: "Failed to upload file.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (docId: number, dbStatus: string) => {
    const live = liveStatuses.get(docId);
    if (live) {
      if (live.phase === "running") return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing
        </Badge>
      );
      if (live.phase === "done") return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Analyzed
        </Badge>
      );
      if (live.phase === "error") return (
        <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Error</Badge>
      );
    }
    switch (dbStatus) {
      case "analyzed": return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Analyzed
        </Badge>
      );
      case "analyzing": return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing
        </Badge>
      );
      case "error": return (
        <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Error</Badge>
      );
      default: return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {caseLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : currentCase ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">{currentCase.title}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                  {currentCase.caseNumber && <span>Case #: <span className="font-medium text-foreground">{currentCase.caseNumber}</span></span>}
                  {currentCase.defendantName && <span>Defendant: <span className="font-medium text-foreground">{currentCase.defendantName}</span></span>}
                  {currentCase.jurisdiction && <span>Jurisdiction: <span className="font-medium text-foreground">{currentCase.jurisdiction}</span></span>}
                </div>
                <div className="mt-3">
                  <Select value={mode} onValueChange={(v) => setMode(v as UserMode)}>
                    <SelectTrigger className="h-7 text-xs border-border/50 bg-muted/30 hover:bg-muted/60 w-auto gap-1.5 px-2 focus:ring-0 focus:ring-offset-0 text-muted-foreground">
                      {MODE_ICONS[mode]}
                      <span>Viewing as: <span className="font-medium text-foreground">{MODE_LABELS[mode]}</span></span>
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="inmate">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Inmate</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="advocate">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Advocate</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="attorney">
                        <div className="flex items-center gap-2">
                          <Scale className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Attorney</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="appellate">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Appellate</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Link href={`/cases/${caseId}/pattern`}>
                  <Button variant="outline" size="sm" className="border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/20">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Pattern Analysis
                  </Button>
                </Link>
                <Link href={`/cases/${caseId}/relief`}>
                  <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/20">
                    <Milestone className="w-4 h-4 mr-2" />
                    Relief Pathway
                  </Button>
                </Link>
                {hasAnyFindings ? (
                  <Link href={`/cases/${caseId}/court/new`}>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Scale className="w-4 h-4 mr-2" />
                      Run Court Simulator
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" disabled title="Analyze at least one document first">
                    <Scale className="w-4 h-4 mr-2" />
                    Run Court Simulator
                  </Button>
                )}
              </div>
            </div>

            {currentCase.notes && (
              <div className="bg-muted/50 p-4 rounded-lg text-sm text-foreground/80 border border-border/50">
                {currentCase.notes}
              </div>
            )}

            {hasAnalysis && (
              <div className="border border-amber-200 dark:border-amber-800/60 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 bg-amber-50/60 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-800/60">
                  <div className="flex items-center gap-2">
                    <Swords className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    <h2 className="text-lg font-serif font-medium text-amber-900 dark:text-amber-200">Case Strategy</h2>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateStrategy}
                    disabled={generateStrategy.isPending}
                    className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
                  >
                    {generateStrategy.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                    ) : strategy ? (
                      <><RefreshCw className="w-4 h-4 mr-2" />Regenerate</>
                    ) : (
                      <><Swords className="w-4 h-4 mr-2" />Generate Strategy</>
                    )}
                  </Button>
                </div>
                {strategyLoading ? (
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : strategy ? (
                  <div className="divide-y divide-amber-100 dark:divide-amber-800/30">
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <Swords className="w-4 h-4" /> Cumulative Error Brief
                      </div>
                      <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{strategy.cumulativeErrorBrief}</div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <MapIcon className="w-4 h-4" /> Strategic Roadmap
                      </div>
                      <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{strategy.strategicRoadmap}</div>
                    </div>
                    <div className="px-5 py-2 bg-amber-50/30 dark:bg-amber-900/5 text-xs text-muted-foreground">
                      Last generated: {format(new Date(strategy.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Generate a cumulative error brief and prioritized strategic roadmap based on all findings in this case.
                    </p>
                  </div>
                )}
              </div>
            )}

            {courtSessions && courtSessions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-xl font-serif font-medium">Simulation History</h2>
                </div>
                <div className="grid gap-2">
                  {courtSessions.map((s) => (
                    <Link key={s.id} href={`/cases/${caseId}/court/${s.id}`}>
                      <div className="group flex items-center p-4 bg-card border border-border rounded-xl hover:bg-accent transition-all cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 ${s.defenseWon ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                          <Scale className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{s.verdictRating ?? "Simulation"}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(s.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                            <span>•</span>
                            <span className="capitalize">{s.simulationMode.replace("_", " ")}</span>
                            <span>•</span>
                            <span>{s.totalRounds} rounds</span>
                          </div>
                        </div>
                        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-3 ${s.defenseWon ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                          {s.defenseWon ? "Defense Win" : "State Win"}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Federal Readiness Panel */}
            <div className="border border-indigo-200 dark:border-indigo-800/60 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 bg-indigo-50/60 dark:bg-indigo-900/10 border-b border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/20 transition-colors text-left"
                onClick={() => setFederalExpanded((v) => !v)}
                aria-expanded={federalExpanded}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-lg font-serif font-medium text-indigo-900 dark:text-indigo-200">Federal Readiness</h2>
                </div>
                <div className="flex items-center gap-2">
                  {reliefPathway && (
                    <Link href={`/cases/${caseId}/relief`} onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline px-1">Full Pathway →</span>
                    </Link>
                  )}
                  <ChevronDown className={`w-4 h-4 text-indigo-500 transition-transform duration-200 ${federalExpanded ? "" : "-rotate-90"}`} />
                </div>
              </button>
              {!federalExpanded ? null : reliefLoading ? (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
              ) : pathwayResult?.status === "unsupported_jurisdiction" ? (
                <div className="p-8 text-center space-y-3">
                  <div className="mx-auto w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Jurisdiction not yet configured</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      The Federal Readiness engine currently supports Wisconsin cases. Support for additional jurisdictions is coming soon.
                    </p>
                  </div>
                </div>
              ) : pathwayResult?.status === "not_found" || !pathwayResult ? (
                <div className="p-8 text-center space-y-4">
                  <div className="mx-auto w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Federal Readiness not yet assessed</p>
                    <p className="text-xs text-muted-foreground mt-1">Generate a relief pathway to see exhaustion status, AEDPA countdown, and federal-ready claims.</p>
                  </div>
                  <Link href={`/cases/${caseId}/relief`}>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Milestone className="w-4 h-4 mr-2" />
                      Generate Relief Pathway
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Block 1: Exhaustion Ladder */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Milestone className="w-3.5 h-3.5" /> Exhaustion Ladder
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(reliefPathway.ladderStatus ?? []).sort((a, b) => a.step - b.step).map((step) => {
                        const label = LADDER_SHORT[step.step] ?? step.court;
                        const pillClass =
                          step.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                            : step.status === "Available"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700 ring-1 ring-blue-400 dark:ring-blue-600"
                            : step.status === "Blocked"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700"
                            : "bg-muted text-muted-foreground border-border";
                        return (
                          <span key={step.step} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${pillClass}`}>
                            {step.status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
                            {step.status === "Available" && <ChevronRight className="w-3 h-3" />}
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Block 2: Federal-Ready Claims */}
                  <div className="space-y-2 bg-muted/30 border border-border rounded-lg p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> Federal-Ready Claims
                    </div>
                    {reliefPathway.federalReadyClaims && reliefPathway.federalReadyClaims.length > 0 ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-sm font-bold">
                            {reliefPathway.federalReadyClaims.length}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            claim{reliefPathway.federalReadyClaims.length === 1 ? "" : "s"} ready for federal review
                          </span>
                        </div>
                        <ul className="space-y-1 mt-1">
                          {reliefPathway.federalReadyClaims.slice(0, 3).map((claim, i) => (
                            <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                              <span className="text-indigo-500 mt-0.5 shrink-0">•</span>
                              <span className="truncate">{claim.issueTitle} <span className="text-muted-foreground">({claim.amendment} Amend.)</span></span>
                            </li>
                          ))}
                          {reliefPathway.federalReadyClaims.length > 3 && (
                            <li className="text-xs text-muted-foreground pl-3.5">…and {reliefPathway.federalReadyClaims.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No federally-preserved claims identified yet.</p>
                    )}
                  </div>

                  {/* Block 3: AEDPA Countdown */}
                  <div className="space-y-2 bg-muted/30 border border-border rounded-lg p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> AEDPA Countdown
                    </div>
                    {reliefPathway.aedpaTolled ? (
                      <div className="flex items-start gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Clock paused</p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">State proceedings active (§ 2244(d)(2))</p>
                        </div>
                      </div>
                    ) : reliefPathway.aedpaDeadline ? (() => {
                      const today = new Date(); today.setHours(0, 0, 0, 0);
                      const deadlineDate = new Date(reliefPathway.aedpaDeadline);
                      const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      const isExpired = diffDays < 0;
                      const colorClass = isExpired
                        ? "text-red-900 dark:text-red-200"
                        : diffDays < 60
                        ? "text-red-700 dark:text-red-400"
                        : diffDays < 180
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-emerald-700 dark:text-emerald-400";
                      const bgClass = isExpired
                        ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                        : diffDays < 60
                        ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                        : diffDays < 180
                        ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                        : "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800";
                      return (
                        <div className={`rounded-lg border p-3 ${bgClass}`}>
                          <div className={`text-xl font-bold font-mono ${colorClass}`}>
                            {isExpired ? "Expired" : `${diffDays}d`}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {isExpired ? "Deadline passed" : "remaining"} — {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          {reliefPathway.aedpaIsEstimate && (
                            <div className="text-xs text-muted-foreground/70 mt-1 italic">Estimated deadline</div>
                          )}
                        </div>
                      );
                    })() : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <Link href={`/cases/${caseId}/relief`}>
                          <span className="text-xs text-amber-700 dark:text-amber-400 hover:underline cursor-pointer">Calculate deadline →</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Block 4: Strongest Federal Argument */}
                  {(() => {
                    const rawText =
                      reliefPathway.federalReadyClaims?.[0]?.readyReason ??
                      reliefPathway.martinezReason ??
                      "";
                    if (!rawText) return null;
                    const narrativeSummary = truncateSentences(rawText, 3);
                    return (
                      <div className="md:col-span-2 space-y-2 bg-muted/30 border border-border rounded-lg p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5" /> Strongest Federal Argument
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{narrativeSummary}</p>
                        <Link href={`/cases/${caseId}/relief`}>
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Read full analysis →</span>
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-medium">Record Documents</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add Document to Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="e.g. Day 1 Trial Transcript" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select value={docType} onValueChange={(val) => setDocType(val as CreateDocumentBodyDocumentType)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="transcript">Transcript</SelectItem>
                            <SelectItem value="police_report">Police Report</SelectItem>
                            <SelectItem value="appeal">Appeal</SelectItem>
                            <SelectItem value="motion">Motion</SelectItem>
                            <SelectItem value="order">Order</SelectItem>
                            <SelectItem value="affidavit">Affidavit</SelectItem>
                            <SelectItem value="exhibit">Exhibit</SelectItem>
                            <SelectItem value="policy">Policy</SelectItem>
                            <SelectItem value="executive_order">Executive Order</SelectItem>
                            <SelectItem value="no_merit_report">No-Merit Report</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex rounded-lg border border-border overflow-hidden">
                        <button
                          className={`flex-1 py-2 text-sm font-medium transition-colors ${inputMode === "paste" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                          onClick={() => setInputMode("paste")} type="button"
                        >Paste Text</button>
                        <button
                          className={`flex-1 py-2 text-sm font-medium transition-colors ${inputMode === "upload" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                          onClick={() => setInputMode("upload")} type="button"
                        >Upload File</button>
                      </div>
                      {inputMode === "paste" ? (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Paste Text Content</label>
                          <Textarea value={docContent} onChange={(e) => setDocContent(e.target.value)} className="min-h-[200px] font-mono text-sm" placeholder="Paste document text here..." />
                          <Button className="w-full" onClick={handleCreateDocument} disabled={createDocument.isPending}>
                            {createDocument.isPending ? "Adding..." : "Add Document"}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Files (PDF, DOCX, TXT, or image — multiple allowed)</label>
                          <Input type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp" multiple onChange={(e) => setUploadFiles(Array.from(e.target.files ?? []))} className="cursor-pointer" />
                          {uploadFiles.length > 0 && (
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              {uploadFiles.map((f, i) => <p key={i}>{f.name} ({(f.size / 1024).toFixed(0)} KB)</p>)}
                            </div>
                          )}
                          <Button className="w-full" onClick={handleUploadDocument} disabled={isUploading || uploadFiles.length === 0}>
                            {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Extracting text...</> : `Upload & Extract${uploadFiles.length > 1 ? ` (${uploadFiles.length} files)` : ""}`}
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {!docsLoading && !hasAnyFindings && documents && documents.length > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border text-sm">
                  <span className="font-semibold text-foreground whitespace-nowrap">Step 1</span>
                  <span className="text-muted-foreground">Analyze documents to extract findings</span>
                  <span className="text-muted-foreground mx-1">→</span>
                  <span className="font-semibold text-muted-foreground whitespace-nowrap">Step 2</span>
                  <span className="text-muted-foreground">Run the court simulator</span>
                </div>
              )}

              {!docsLoading && hasPendingDocs && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          {pendingDocs.length} document{pendingDocs.length === 1 ? "" : "s"} need analysis
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                          Analyze all at once, or click any document to analyze it individually.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isRunningAll && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { abortRef.current = true; }}
                          className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300"
                        >
                          Stop
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={handleAnalyzeAll}
                        disabled={isRunningAll}
                        className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        {isRunningAll ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing…</>
                        ) : (
                          <><Zap className="w-4 h-4 mr-2" />Analyze All</>
                        )}
                      </Button>
                    </div>
                  </div>
                  {isRunningAll && batchProgress && (
                    <div className="px-4 pb-4 space-y-1.5">
                      <div className="h-1.5 w-full rounded-full bg-blue-200 dark:bg-blue-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 dark:bg-blue-400 transition-all duration-500"
                          style={{ width: `${(batchProgress.done / batchProgress.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        {batchProgress.done} of {batchProgress.total} complete
                      </p>
                    </div>
                  )}
                </div>
              )}

              {docsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="grid gap-3">
                  {documents.map((doc) => {
                    const live = liveStatuses.get(doc.id);
                    const isThisRunning = live?.phase === "running";
                    const thisIsDone = live?.phase === "done";
                    const needsAnalysis = !live && (doc.status === "pending" || doc.status === "error");
                    const displayFindingCount = thisIsDone ? live.findingCount : doc.findingCount;

                    const isConfirming = confirmDeleteId === doc.id;

                    return (
                      <div key={doc.id} className="relative group/card">
                        <Link href={`/cases/${caseId}/documents/${doc.id}`}>
                          <div className={`group flex items-center p-4 bg-card border rounded-xl transition-all cursor-pointer ${isThisRunning ? "border-blue-300 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-900/5" : "hover:bg-accent border-border"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors ${isThisRunning ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "bg-muted text-muted-foreground group-hover:text-foreground"}`}>
                              {isThisRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                              <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="capitalize">{doc.documentType.replace("_", " ")}</span>
                                <span>•</span>
                                <span>{format(new Date(doc.createdAt), "MMM d, yyyy")}</span>
                              </div>
                              {isThisRunning && live.message && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{live.message}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4 shrink-0 pr-8">
                              {getStatusBadge(doc.id, doc.status)}
                              {(doc.status === "analyzed" || thisIsDone) && displayFindingCount != null && (
                                <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full">
                                  {displayFindingCount} findings
                                </span>
                              )}
                              {needsAnalysis && !isRunningAll && (
                                <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:underline">
                                  <Play className="w-3 h-3 fill-current" />
                                  Run Analysis
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        {/* Delete button — visible on hover (desktop) / always (mobile) */}
                        <div className="absolute top-3 right-3">
                          {isConfirming ? (
                            <div
                              className="flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline"
                                onClick={() => handleDeleteDocument(doc.id)}
                                disabled={deleteDocument.isPending}
                              >
                                {deleteDocument.isPending ? "Deleting…" : "Delete"}
                              </button>
                              <span className="text-xs text-muted-foreground">/</span>
                              <button
                                className="text-xs text-muted-foreground hover:underline"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDeleteId(doc.id); }}
                              title="Delete document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/20">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No documents yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Add transcripts, reports, and motions to the record. We'll analyze them line by line.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">Case not found</div>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}
