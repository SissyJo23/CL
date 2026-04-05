import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useGetDocument, getGetDocumentQueryKey, useListFindings, getListFindingsQueryKey, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Play, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FindingCard from "@/components/findings/FindingCard";
import CategoryFilter from "@/components/categories/CategoryFilter";
import type { Finding } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentShow() {
  const params = useParams();
  const caseId = parseInt(params.caseId || "0", 10);
  const documentId = parseInt(params.id || "0", 10);
  
  const { data: doc, isLoading: docLoading } = useGetDocument(caseId, documentId, { query: { enabled: !!documentId, queryKey: getGetDocumentQueryKey(caseId, documentId) } });
  const { data: initialFindings, isLoading: findingsLoading } = useListFindings(caseId, documentId, { query: { enabled: !!documentId, queryKey: getListFindingsQueryKey(caseId, documentId) } });
  
  const [liveFindings, setLiveFindings] = useState<Finding[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (initialFindings) {
      setLiveFindings(initialFindings);
    }
  }, [initialFindings]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setLiveFindings([]);
    
    try {
      const response = await fetch(`/api/cases/${caseId}/documents/${documentId}/analyze`, {
        method: "POST"
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
              setLiveFindings(prev => [...prev, event.data]);
            } else if (event.type === "done") {
              setIsAnalyzing(false);
              queryClient.invalidateQueries({ queryKey: getGetDocumentQueryKey(caseId, documentId) });
              queryClient.invalidateQueries({ queryKey: getListFindingsQueryKey(caseId, documentId) });
              toast({ title: "Analysis Complete", description: "We went through every line. Here's everything we found." });
            } else if (event.type === "error") {
              setIsAnalyzing(false);
              toast({ title: "Analysis Error", description: event.message, variant: "destructive" });
            }
          } catch (e) {
            console.error("Failed to parse SSE event", line);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      toast({ title: "Connection Error", description: "Failed to connect to analysis stream.", variant: "destructive" });
    }
  };

  const filteredFindings = liveFindings.filter(f => {
    if (selectedCategories.size === 0) return true;
    if (f.categoryId == null) return false;
    return selectedCategories.has(f.categoryId);
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Link href={`/cases/${caseId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
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
                  <Badge variant="outline" className="uppercase font-mono text-[10px] tracking-wider">{doc.documentType.replace('_', ' ')}</Badge>
                  {doc.status === 'analyzing' || isAnalyzing ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Analyzing Record</Badge>
                  ) : doc.status === 'pending' ? (
                    <Badge variant="outline">Pending Analysis</Badge>
                  ) : null}
                </div>
                <h1 className="text-3xl font-serif font-medium tracking-tight">{doc.title}</h1>
              </div>
              
              {(doc.status === 'pending' || doc.status === 'error') && !isAnalyzing && (
                <Button onClick={handleRunAnalysis} size="lg" className="shadow-sm">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Run Analysis
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 h-[600px] lg:h-[calc(100vh-250px)] overflow-hidden rounded-xl border border-border bg-card flex flex-col">
                <div className="p-3 border-b border-border bg-muted/30">
                  <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">Source Document</span>
                </div>
                <div className="p-4 overflow-y-auto flex-1 font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 selection:bg-primary/20">
                  {doc.content}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col h-[600px] lg:h-[calc(100vh-250px)]">
                <CategoryFilter 
                  selectedCategories={selectedCategories} 
                  onChange={setSelectedCategories} 
                />
                
                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                  {findingsLoading && !isAnalyzing ? (
                    <div className="space-y-4">
                      {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
                    </div>
                  ) : filteredFindings.length > 0 ? (
                    filteredFindings.map(finding => (
                      <FindingCard
                        key={finding.id || Math.random()}
                        finding={finding}
                        caseId={caseId}
                        documentId={documentId}
                        onDeleted={(id) => setLiveFindings(prev => prev.filter(f => f.id !== id))}
                        onUpdated={(updated) => setLiveFindings(prev => prev.map(f => f.id === updated.id ? updated : f))}
                      />
                    ))
                  ) : isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                      <p className="font-serif text-lg">Reading the record...</p>
                    </div>
                  ) : doc.status === 'analyzed' ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/10">
                      <p className="font-serif text-xl text-foreground mb-2">Nothing was skipped. Every word was read.</p>
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
