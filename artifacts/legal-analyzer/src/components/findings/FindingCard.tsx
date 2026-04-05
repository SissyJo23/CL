import type { Finding, CrossCaseMatch } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Scale, BookOpen, Quote, ChevronDown, Link as LinkIcon, Loader2, FileText, ShieldAlert, Target, Swords, Route, BarChart3 } from "lucide-react";
import { useListCategories, useUpdateFinding, useDeleteFinding } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  violet: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
};

interface FindingCardProps {
  finding: Finding;
  caseId?: number;
  documentId?: number;
  onDeleted?: (id: number) => void;
  onUpdated?: (updated: Finding) => void;
}

const survivabilityStyles: Record<string, { badge: string; label: string }> = {
  Strong: { badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", label: "Strong" },
  Moderate: { badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300", label: "Moderate" },
  Vulnerable: { badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", label: "Vulnerable" },
};

const proceduralStatusStyles: Record<string, string> = {
  Preserved: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
  Defaulted: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  Unclear: "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
};

export default function FindingCard({ finding, caseId, documentId, onDeleted, onUpdated }: FindingCardProps) {
  const { data: categories = [] } = useListCategories();
  const category = categories.find((c) => c.id === finding.categoryId);
  const [crossCaseOpen, setCrossCaseOpen] = useState(false);
  const [strategicOpen, setStrategicOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const hasStrategicData = !!(
    finding.proceduralStatus ||
    finding.anticipatedBlock ||
    finding.breakthroughArgument ||
    finding.legalVehicle ||
    finding.survivability
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    finding.categoryId != null ? String(finding.categoryId) : "none"
  );
  const { toast } = useToast();

  const updateFinding = useUpdateFinding();
  const deleteFinding = useDeleteFinding();

  const handleSaveCategory = () => {
    if (!caseId || !documentId) return;
    const newCategoryId = selectedCategoryId === "none" ? null : Number(selectedCategoryId);
    updateFinding.mutate(
      { caseId, documentId, id: finding.id, data: { categoryId: newCategoryId } },
      {
        onSuccess: (updated) => {
          toast({ title: "Category Updated" });
          setEditOpen(false);
          onUpdated?.(updated);
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update category.", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!caseId || !documentId) return;
    if (!window.confirm("Delete this finding? This cannot be undone.")) return;
    deleteFinding.mutate(
      { caseId, documentId, id: finding.id },
      {
        onSuccess: () => {
          toast({ title: "Finding Deleted" });
          onDeleted?.(finding.id);
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete finding.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
        <div className="p-5 flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-lg font-medium text-foreground leading-tight">
              {finding.issueTitle}
            </h3>
            {category && (
              <Badge variant="secondary" className={cn("shrink-0 uppercase font-mono tracking-wider text-[10px]", colorMap[category.color] ?? colorMap.blue)}>
                {category.badgeLabel}
              </Badge>
            )}
          </div>

          <div className="bg-muted/40 rounded-lg p-4 border border-border relative">
            <Quote className="w-8 h-8 text-muted/40 absolute -top-3 -left-3 rotate-180" />
            <p className="font-mono text-sm text-muted-foreground italic pl-2 leading-relaxed">
              "{finding.transcriptExcerpt}"
            </p>
            {(finding.pageNumber != null || finding.lineNumber != null) && (
              <div className="mt-2 pl-2 flex items-center gap-1 text-[10px] font-mono text-muted-foreground/70">
                <FileText className="w-3 h-3" />
                {finding.pageNumber != null && <span>p.{finding.pageNumber}</span>}
                {finding.lineNumber != null && <span>l.{finding.lineNumber}</span>}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Scale className="w-3.5 h-3.5 mr-1.5" />
              Legal Analysis
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {finding.legalAnalysis}
            </p>
          </div>

          {(finding.precedentName || finding.courtRuling) && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 space-y-3">
              {finding.precedentName && (
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-foreground">{finding.precedentName}</span>
                      <span className="text-sm text-muted-foreground">{finding.precedentCitation}</span>
                      {finding.precedentType && (
                        <Badge variant={finding.precedentType === "BINDING" ? "default" : "secondary"} className="text-[10px] h-4 py-0">
                          {finding.precedentType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {finding.courtRuling && (
                <div className="text-sm text-foreground/80 pt-1 border-t border-primary/10">
                  <span className="font-medium text-foreground">Ruling:</span> {finding.courtRuling}
                </div>
              )}

              {finding.materialSimilarity && (
                <div className="text-sm text-foreground/80 italic text-muted-foreground">
                  Similarity: {finding.materialSimilarity}
                </div>
              )}
            </div>
          )}

          {hasStrategicData && (
            <Collapsible open={strategicOpen} onOpenChange={setStrategicOpen} className="border border-amber-200 dark:border-amber-800/60 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 overflow-hidden">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors text-sm font-medium">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  <span className="text-amber-900 dark:text-amber-300 font-semibold">Strategic Analysis</span>
                  {finding.survivability && (() => {
                    const s = survivabilityStyles[finding.survivability ?? ""] ?? survivabilityStyles.Moderate;
                    return <Badge className={cn("text-[10px] h-4 py-0 px-1.5 ml-1", s.badge)}>{s.label}</Badge>;
                  })()}
                </div>
                <ChevronDown className={cn("w-4 h-4 text-amber-600 dark:text-amber-500 transition-transform", strategicOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 space-y-4 border-t border-amber-200 dark:border-amber-800/60">
                  {finding.proceduralStatus && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <BarChart3 className="w-3.5 h-3.5" />
                        Procedural Status
                      </div>
                      <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded border", proceduralStatusStyles[finding.proceduralStatus] ?? "text-muted-foreground bg-muted")}>
                        {finding.proceduralStatus}
                      </span>
                    </div>
                  )}
                  {finding.legalVehicle && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <Route className="w-3.5 h-3.5" />
                        Best Legal Vehicle
                      </div>
                      <p className="text-sm text-foreground/90 font-medium">{finding.legalVehicle}</p>
                    </div>
                  )}
                  {finding.anticipatedBlock && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
                        <Target className="w-3.5 h-3.5" />
                        Anticipated Block
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed bg-red-50/50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        {finding.anticipatedBlock}
                      </p>
                    </div>
                  )}
                  {finding.breakthroughArgument && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        <Swords className="w-3.5 h-3.5" />
                        Breakthrough Argument
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                        {finding.breakthroughArgument}
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {finding.crossCaseMatches && finding.crossCaseMatches.length > 0 && (
            <Collapsible open={crossCaseOpen} onOpenChange={setCrossCaseOpen} className="border border-border rounded-lg bg-card overflow-hidden">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  Cross-Case Matches ({finding.crossCaseMatches.length})
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", crossCaseOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y divide-border">
                  {finding.crossCaseMatches.map((match: CrossCaseMatch, i: number) => (
                    <div key={i} className="p-3 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Source: {match.sourceDocumentTitle}
                      </div>
                      <div className="text-sm italic border-l-2 border-primary/30 pl-2 text-foreground/80">
                        "{match.matchedPassage}"
                      </div>
                      <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                        {match.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-t border-border mt-auto">
          <Button
            variant="ghost"
            className="rounded-none h-11 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => setEditOpen(true)}
            disabled={!caseId || !documentId}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Reassign
          </Button>
          <Button
            variant="ghost"
            className="rounded-none h-11 text-destructive/70 hover:text-destructive hover:bg-destructive/5"
            onClick={handleDelete}
            disabled={!caseId || !documentId || deleteFinding.isPending}
          >
            {deleteFinding.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Delete
          </Button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reassign Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground line-clamp-2">{finding.issueTitle}</p>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground">No categories yet. Create categories from the document view.</p>
            )}
            <Button className="w-full" onClick={handleSaveCategory} disabled={updateFinding.isPending}>
              {updateFinding.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
