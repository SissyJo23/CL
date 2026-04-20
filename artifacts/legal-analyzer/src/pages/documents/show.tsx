import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetDocument, getGetDocumentQueryKey, useListFindings, getListFindingsQueryKey, useRenameDocument } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Play, Loader2, ShieldOff, Trash2, FileDown, Scale, ExternalLink, Pencil, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FindingCard from "@/components/findings/FindingCard";
import CategoryFilter from "@/components/categories/CategoryFilter";
import type { Finding } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentShow() {
  const params = useParams();
  const caseId = parseInt(params.caseId || "0", 10);
  const documentId = parseInt(params.id || "0", 10);
  const [, navigate] = useLocation();

  const { data: doc, isLoading: docLoading } = useGetDocument(caseId, documentId, {
    query: { enabled: !!documentId, queryKey: getGetDocumentQueryKey(caseId, documentId) },
  });
  const { data: initialFindings, isLoading: findingsLoading } = useListFindings(caseId, documentId, {
    query: { enabled: !!documentId, queryKey: getListFindingsQueryKey(caseId, documentId) },
  });

  const [liveFindings, setLiveFindings] = useState<Finding[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [isRedacting, setIsRedacting] = useState(false);
  const [redactedContent, setRedactedContent] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isRunningNomerit, setIsRunningNomerit] = useState(false);
  const [nomeritStatus, setNomeritStatus] = useState<string>("");
  const [nomeritComplete, setNomeritComplete] = useState(false);
  const [nomeritPriorStatus, setNomeritPriorStatus] = useState<"error" | null>(null);
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const renameDocumentMutation = useRenameDocument();

  useEffect(() => {
    if (initialFindings) setLiveFindings(initialFindings);
  }, [initialFindings]);

  useEffect(() => {
    if (doc?.documentType === "no_merit_report") {
      fetch(`/api/cases/${caseId}/documents/${documentId}/nomerit-analysis`)
        .then((r) => {
          if (!r.ok) return;
          return r.json();
        })
        .then((data) => {
          if (!data) return;
          if (data.status === "complete") {
            setNomeritComplete(true);
          } else if (data.status === "error") {
            setNomeritPriorStatus("error");
          }
        })
        .catch(() => {});
    }
  }, [doc, caseId, documentId]);

  const handleRunNomeritAnalysis = async () => {
    setIsRunningNomerit(true);
    setNomeritPriorStatus(null);
    setNomeritStatus("Starting no-merit analysis...");
    try {
      const response = await fetch(`/api/cases/${caseId}/documents/${documentId}/analyze-nomerit`, {
        method: "POST",
      });
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
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
              setNomeritStatus(event.message ?? "");
            } else if (event.type === "done") {
              setIsRunningNomerit(false);
              setNomeritStatus("");
              setNomeritComplete(true);
              toast({ title: "No-Merit Analysis Complete", description: "IAAC arguments and draft motion are ready." });
              navigate(`/cases/${caseId}/documents/${documentId}/nomerit`);
            } else if (event.type === "error") {
              setIsRunningNomerit(false);
              setNomeritStatus("");
              toast({ title: "Analysis Error", description: event.message, variant: "destructive" });
            }
          } catch {
            console.error("Failed to parse SSE event", line);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setIsRunningNomerit(false);
      setNomeritStatus("");
      toast({ title: "Connection Error", description: "Failed to connect to no-merit analysis stream.", variant: "destructive" });
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setLiveFindings([]);
    setStatusMessage("Starting analysis...");

    try {
      const response = await fetch(`/api/cases/${caseId}/documents/${documentId}/analyze`, {
        method: "POST",
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
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
              setLiveFindings((prev) => [...prev, event.data]);
            } else if (event.type === "status") {
              setStatusMessage(event.message ?? "");
            } else if (event.type === "cross_case_done") {
              queryClient.invalidateQueries({ queryKey: getListFindingsQueryKey(caseId, documentId) });
            } else if (event.type === "done") {
              setIsAnalyzing(false);
              setStatusMessage("");
              queryClient.invalidateQueries({ queryKey: getGetDocumentQueryKey(caseId, documentId) });
              queryClient.invalidateQueries({ queryKey: getListFindingsQueryKey(caseId, documentId) });
              toast({ title: "Analysis Complete", description: "We went through every line. Here's everything we found." });
            } else if (event.type === "error") {
              setIsAnalyzing(false);
              setStatusMessage("");
              toast({ title: "Analysis Error", description: event.message, variant: "destructive" });
            }
          } catch {
            console.error("Failed to parse SSE event", line);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      setStatusMessage("");
      toast({ title: "Connection Error", description: "Failed to connect to analysis stream.", variant: "destructive" });
    }
  };

  const handleCleanTranscript = async () => {
    if (!doc) return;
    setIsRedacting(true);
    try {
      const response = await fetch("/api/redact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: redactedContent ?? doc.content }),
      });
      const data = await response.json();
      setRedactedContent(data.redacted);
      toast({
        title: "Transcript Cleaned",
        description: data.changesCount > 0
          ? `${data.changesCount} sensitive item(s) redacted (SSN, DOB, phone, email).`
          : "No sensitive data patterns found.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to redact document.", variant: "destructive" });
    } finally {
      setIsRedacting(false);
    }
  };

  const startRenamingTitle = () => {
    setIsRenamingTitle(true);
    setRenameValue(doc?.title ?? "");
  };

  const cancelRenamingTitle = () => {
    setIsRenamingTitle(false);
    setRenameValue("");
  };

  const handleRenameTitle = () => {
    const trimmed = renameValue.trim();
    if (!trimmed || !doc) return;
    renameDocumentMutation.mutate(
      { caseId, id: documentId, data: { title: trimmed } },
      {
        onSuccess: () => {
          setIsRenamingTitle(false);
          setRenameValue("");
          queryClient.invalidateQueries({ queryKey: getGetDocumentQueryKey(caseId, documentId) });
          toast({ title: "Document renamed" });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not rename document.", variant: "destructive" });
        },
      },
    );
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear all findings from this view? (Saved findings in the database are not deleted.)")) return;
    setLiveFindings([]);
    setRedactedContent(null);
    setSelectedCategories(new Set());
    setStatusMessage("");
    toast({ title: "View Cleared", description: "Findings hidden from view. Re-run analysis to reload." });
  };

  const handleExport = () => {
    if (!doc || liveFindings.length === 0) return;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${doc.title} — CaseLight Findings Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.5; color: #111; padding: 1in; }
    .header { border-bottom: 2pt solid #111; padding-bottom: 10pt; margin-bottom: 20pt; }
    .header h1 { font-size: 18pt; font-weight: bold; }
    .header p { font-size: 10pt; color: #555; margin-top: 4pt; }
    .privilege { background: #222; color: #fff; text-align: center; padding: 8pt; font-size: 9pt; letter-spacing: 1px; margin-bottom: 20pt; }
    .finding { page-break-inside: avoid; border: 1pt solid #ccc; border-radius: 4pt; padding: 14pt; margin-bottom: 16pt; }
    .finding-num { font-size: 9pt; color: #666; font-family: monospace; margin-bottom: 4pt; }
    .finding-title { font-size: 13pt; font-weight: bold; margin-bottom: 8pt; }
    .citation { font-size: 9pt; font-family: monospace; color: #555; margin-bottom: 8pt; }
    .excerpt { background: #f7f7f7; border-left: 3pt solid #888; padding: 8pt 10pt; font-style: italic; font-size: 11pt; margin-bottom: 10pt; }
    .section-label { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #444; margin-bottom: 4pt; }
    .analysis { font-size: 11pt; margin-bottom: 10pt; }
    .precedent { background: #f0f4ff; border: 1pt solid #ccd; padding: 8pt; margin-bottom: 10pt; font-size: 10pt; }
    .footer { margin-top: 30pt; border-top: 1pt solid #ccc; padding-top: 10pt; font-size: 9pt; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="privilege">PRIVILEGED &amp; CONFIDENTIAL — ATTORNEY WORK-PRODUCT — DO NOT DISCLOSE</div>
  <div class="header">
    <h1>${doc.title}</h1>
    <p>Document Type: ${doc.documentType.replace(/_/g, " ")} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; Findings: ${liveFindings.length}</p>
  </div>

  ${liveFindings
    .map(
      (f, i) => `
  <div class="finding">
    <div class="finding-num">Finding #${i + 1}</div>
    <div class="finding-title">${f.issueTitle}</div>
    ${f.pageNumber != null || f.lineNumber != null ? `<div class="citation">📄 ${f.pageNumber != null ? `Page ${f.pageNumber}` : ""}${f.lineNumber != null ? ` · Line ${f.lineNumber}` : ""}</div>` : ""}
    <div class="excerpt">"${f.transcriptExcerpt}"</div>
    <div class="section-label">Legal Analysis</div>
    <div class="analysis">${f.legalAnalysis}</div>
    ${
      f.precedentName
        ? `<div class="precedent">
        <strong>${f.precedentName}</strong>${f.precedentCitation ? ` — ${f.precedentCitation}` : ""}${f.precedentType ? ` [${f.precedentType}]` : ""}<br/>
        ${f.courtRuling ? `<em>Ruling:</em> ${f.courtRuling}<br/>` : ""}
        ${f.materialSimilarity ? `<em>Similarity:</em> ${f.materialSimilarity}` : ""}
      </div>`
        : ""
    }
  </div>`,
    )
    .join("\n")}

  <div class="footer">Generated by CaseLight &mdash; For attorney use only &mdash; Not for public disclosure</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  const filteredFindings = liveFindings.filter((f) => {
    if (selectedCategories.size === 0) return true;
    if (f.categoryId == null) return false;
    return selectedCategories.has(f.categoryId);
  });

  const displayContent = redactedContent ?? doc?.content ?? "";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Link
          href={`/cases/${caseId}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case
        </Link>

        {docLoading ? (
          <Skeleton className="h-12 w-1/2" />
        ) : doc ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="uppercase font-mono text-[10px] tracking-wider">
                    {doc.documentType.replace("_", " ")}
                  </Badge>
                  {doc.status === "analyzing" || isAnalyzing ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing Record
                    </Badge>
                  ) : doc.status === "pending" ? (
                    <Badge variant="outline">Pending Analysis</Badge>
                  ) : null}
                  {redactedContent && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <ShieldOff className="w-3 h-3 mr-1" /> Redacted View
                    </Badge>
                  )}
                </div>
                {isRenamingTitle ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      className="text-2xl font-serif font-medium tracking-tight bg-transparent border-b-2 border-primary outline-none flex-1 min-w-0 py-0.5 text-foreground"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameTitle();
                        if (e.key === "Escape") cancelRenamingTitle();
                      }}
                    />
                    <button
                      className="p-2 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
                      onClick={handleRenameTitle}
                      disabled={renameDocumentMutation.isPending || !renameValue.trim()}
                      title="Save"
                    >
                      {renameDocumentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
                      onClick={cancelRenamingTitle}
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group/title mt-1">
                    <h1 className="text-3xl font-serif font-medium tracking-tight">{doc.title}</h1>
                    <button
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors opacity-0 group-hover/title:opacity-100 focus:opacity-100 shrink-0"
                      onClick={startRenamingTitle}
                      title="Rename document"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {isAnalyzing && statusMessage && (
                  <p className="mt-1 text-xs text-muted-foreground font-mono">{statusMessage}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {doc.documentType === "no_merit_report" && (
                  nomeritComplete ? (
                    <Link href={`/cases/${caseId}/documents/${documentId}/nomerit`}>
                      <Button size="lg" className="shadow-sm bg-violet-700 hover:bg-violet-800 text-white">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View No-Merit Analysis
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="lg"
                      className={`shadow-sm text-white ${nomeritPriorStatus === "error" ? "bg-destructive hover:bg-destructive/90" : "bg-violet-700 hover:bg-violet-800"}`}
                      onClick={handleRunNomeritAnalysis}
                      disabled={isRunningNomerit}
                      title={nomeritPriorStatus === "error" ? "Previous analysis failed — click to retry" : undefined}
                    >
                      {isRunningNomerit ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {nomeritStatus || "Analyzing..."}
                        </>
                      ) : nomeritPriorStatus === "error" ? (
                        <>
                          <Scale className="w-4 h-4 mr-2" />
                          Retry No-Merit Analysis
                        </>
                      ) : (
                        <>
                          <Scale className="w-4 h-4 mr-2" />
                          Run No-Merit Analysis
                        </>
                      )}
                    </Button>
                  )
                )}
                {(doc.status === "pending" || doc.status === "error") && !isAnalyzing && (
                  <Button onClick={handleRunAnalysis} size="lg" className="shadow-sm">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Run Analysis
                  </Button>
                )}
                {doc.status === "analyzed" && !isAnalyzing && (
                  <Button onClick={handleRunAnalysis} variant="outline" size="sm">
                    <Play className="w-3 h-3 mr-1.5 fill-current" />
                    Re-run
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCleanTranscript}
                  disabled={isRedacting}
                  title="Auto-redact SSN, DOB, phone numbers, and emails from the document view"
                >
                  {isRedacting ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <ShieldOff className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Clean Transcript
                </Button>
                {liveFindings.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    title="Export all findings to a print-ready report"
                  >
                    <FileDown className="w-3.5 h-3.5 mr-1.5" />
                    Export PDF
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-destructive/70 hover:text-destructive hover:bg-destructive/5"
                  title="Clear all findings from this view"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 h-[600px] lg:h-[calc(100vh-250px)] overflow-hidden rounded-xl border border-border bg-card flex flex-col">
                <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                    Source Document
                  </span>
                  {redactedContent && (
                    <button
                      className="text-[10px] text-muted-foreground underline hover:text-foreground"
                      onClick={() => setRedactedContent(null)}
                    >
                      Show Original
                    </button>
                  )}
                </div>
                <div className="p-4 overflow-y-auto flex-1 font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 selection:bg-primary/20">
                  {displayContent}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col h-[600px] lg:h-[calc(100vh-250px)]">
                <CategoryFilter selectedCategories={selectedCategories} onChange={setSelectedCategories} />

                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                  {findingsLoading && !isAnalyzing ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                      ))}
                    </div>
                  ) : filteredFindings.length > 0 ? (
                    filteredFindings.map((finding) => (
                      <FindingCard
                        key={finding.id || Math.random()}
                        finding={finding}
                        caseId={caseId}
                        documentId={documentId}
                        onDeleted={(id) => setLiveFindings((prev) => prev.filter((f) => f.id !== id))}
                        onUpdated={(updated) =>
                          setLiveFindings((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
                        }
                      />
                    ))
                  ) : isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                      <p className="font-serif text-lg">Reading the record...</p>
                      {statusMessage && (
                        <p className="text-xs font-mono text-center max-w-xs">{statusMessage}</p>
                      )}
                    </div>
                  ) : doc.status === "analyzed" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/10">
                      <p className="font-serif text-xl text-foreground mb-2">
                        Nothing was skipped. Every word was read.
                      </p>
                      <p className="text-muted-foreground">No actionable findings in this selection.</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground p-8 border border-border border-dashed rounded-xl">
                      Run analysis to extract findings.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">Document not found</div>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}
