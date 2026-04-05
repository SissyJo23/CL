import { Finding } from "@workspace/api-client-react/src/generated/api.schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Scale, BookOpen, Quote, ChevronDown, Link as LinkIcon } from "lucide-react";
import { useListCategories } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export default function FindingCard({ finding }: { finding: Finding }) {
  const { data: categories = [] } = useListCategories();
  const category = categories.find(c => c.id === finding.categoryId);
  const [crossCaseOpen, setCrossCaseOpen] = useState(false);

  const colorMap = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
      <div className="p-5 flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-lg font-medium text-foreground leading-tight">
            {finding.issueTitle}
          </h3>
          {category && (
            <Badge variant="secondary" className={cn("shrink-0 uppercase font-mono tracking-wider text-[10px]", colorMap[category.color])}>
              {category.badgeLabel}
            </Badge>
          )}
        </div>

        <div className="bg-muted/40 rounded-lg p-4 border border-border relative">
          <Quote className="w-8 h-8 text-muted/40 absolute -top-3 -left-3 rotate-180" />
          <p className="font-mono text-sm text-muted-foreground italic pl-2 leading-relaxed">
            "{finding.transcriptExcerpt}"
          </p>
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
                      <Badge variant={finding.precedentType === 'BINDING' ? 'default' : 'secondary'} className="text-[10px] h-4 py-0">
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
                {finding.crossCaseMatches.map((match, i) => (
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
        <Button variant="ghost" className="rounded-none h-11 text-muted-foreground hover:text-foreground hover:bg-muted/50">
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="ghost" className="rounded-none h-11 text-destructive/70 hover:text-destructive hover:bg-destructive/5">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}