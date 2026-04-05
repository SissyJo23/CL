import { useParams, Link } from "wouter";
import { useGetCase, getGetCaseQueryKey, useListDocuments, getListDocumentsQueryKey, useCreateDocument } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, Upload, Plus, Download, Scale, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function CaseShow() {
  const params = useParams();
  const caseId = parseInt(params.id || "0", 10);
  const { data: currentCase, isLoading: caseLoading } = useGetCase(caseId, { query: { enabled: !!caseId, queryKey: getGetCaseQueryKey(caseId) } });
  const { data: documents, isLoading: docsLoading } = useListDocuments(caseId, { query: { enabled: !!caseId, queryKey: getListDocumentsQueryKey(caseId) } });
  
  const createDocument = useCreateDocument();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<string>("transcript");
  const [docContent, setDocContent] = useState("");

  const handleCreateDocument = () => {
    if (!docTitle || !docContent) {
      toast({ title: "Validation Error", description: "Title and content are required.", variant: "destructive" });
      return;
    }

    createDocument.mutate(
      { caseId, data: { title: docTitle, documentType: docType as any, content: docContent } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(caseId) });
          setOpen(false);
          setDocTitle("");
          setDocContent("");
          toast({ title: "Document Added", description: "The document is now in the workspace." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add document.", variant: "destructive" });
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "analyzed":
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Analyzed</Badge>;
      case "analyzing":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Analyzing</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1"/> Error</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
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
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Link href={`/cases/${caseId}/court/new`}>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Scale className="w-4 h-4 mr-2" />
                    Run Court Simulator
                  </Button>
                </Link>
              </div>
            </div>

            {currentCase.notes && (
              <div className="bg-muted/50 p-4 rounded-lg text-sm text-foreground/80 border border-border/50">
                {currentCase.notes}
              </div>
            )}

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
                        <Input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="e.g. Day 1 Trial Transcript" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select value={docType} onValueChange={setDocType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
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
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Paste Text Content</label>
                        <Textarea 
                          value={docContent} 
                          onChange={e => setDocContent(e.target.value)} 
                          className="min-h-[200px] font-mono text-sm"
                          placeholder="Paste document text here..."
                        />
                      </div>
                      <Button className="w-full" onClick={handleCreateDocument} disabled={createDocument.isPending}>
                        {createDocument.isPending ? "Adding..." : "Add Document"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {docsLoading ? (
                <div className="space-y-3">
                  {[1,2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="grid gap-3">
                  {documents.map(doc => (
                    <Link key={doc.id} href={`/cases/${caseId}/documents/${doc.id}`}>
                      <div className="group flex items-center p-4 bg-card hover:bg-accent border border-border rounded-xl transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4 text-muted-foreground group-hover:text-foreground transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="capitalize">{doc.documentType.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          {getStatusBadge(doc.status)}
                          {doc.status === 'analyzed' && (
                            <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full">
                              {doc.findingCount} findings
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
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
