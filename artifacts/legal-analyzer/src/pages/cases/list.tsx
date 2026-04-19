import { Link } from "wouter";
import { useListCases } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, CheckCircle2, Scale, MapPin } from "lucide-react";
import { format } from "date-fns";

type JurisdictionBadge = {
  displayText: string;
  circuit: string | null;
};

// NOTE: Detection patterns intentionally mirror detectJurisdiction() in
// artifacts/api-server/src/routes/relief.ts — keep these in sync if state
// support is added or patterns change on the server side.
function parseJurisdictionBadge(jurisdiction: string | null | undefined): JurisdictionBadge | null {
  if (!jurisdiction) return null;
  const lower = jurisdiction.toLowerCase().trim();

  let stateName: string | null = null;
  let circuit: string | null = null;

  if (
    lower.includes("wisconsin") ||
    lower === "wi" || lower === "wis" || lower === "wis." ||
    lower.startsWith("wi ") || lower.startsWith("wis ") || lower.startsWith("wis.") ||
    lower.includes(", wi") || lower.includes(" wi,") ||
    lower.includes("(wi)") || lower.includes("(wis)")
  ) {
    stateName = "Wisconsin";
    circuit = "7th Circuit";
  } else if (
    lower.includes("illinois") ||
    lower === "il" || lower === "ill" || lower === "ill." ||
    lower.startsWith("il ") || lower.startsWith("ill ") ||
    lower.includes(", il") || lower.includes(" il,") ||
    lower.includes("(il)") || lower.includes("(ill)") ||
    lower.includes("cook county") || lower.includes("chicago")
  ) {
    stateName = "Illinois";
    circuit = "7th Circuit";
  } else if (
    lower.includes("minnesota") ||
    lower === "mn" ||
    lower.startsWith("mn ") || lower.includes(", mn") || lower.includes(" mn,") ||
    lower.includes("(mn)") ||
    lower.includes("minneapolis") || lower.includes("st. paul") || lower.includes("saint paul")
  ) {
    stateName = "Minnesota";
    circuit = "8th Circuit";
  }

  if (stateName) {
    const firstPart = jurisdiction.split(",")[0].trim();
    const cleanLocation = firstPart
      .replace(/\s+(circuit court|district court|superior court|municipal court|county court|court)\s*$/i, "")
      .trim();
    return { displayText: `${cleanLocation} · ${stateName}`, circuit };
  }

  // For unrecognized jurisdictions, only show if the string looks like a real
  // court location (contains a comma, or contains court-related keywords).
  // This filters out placeholder values like "Anonymous" or "Test".
  const looksReal =
    jurisdiction.includes(",") ||
    /county|court|district|circuit|judicial|parish|borough/i.test(jurisdiction);
  if (!looksReal) return null;

  return { displayText: jurisdiction, circuit: null };
}

export default function CaseList() {
  const { data: cases, isLoading } = useListCases();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">My Cases</h1>
            <p className="text-sm text-muted-foreground mt-1">All cases, most recent first</p>
          </div>
          <Link href="/cases/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : cases && cases.length > 0 ? (
          <div className="grid gap-3">
            {cases.map((c) => {
              const jBadge = parseJurisdictionBadge(c.jurisdiction);
              return (
                <Link key={c.id} href={`/cases/${c.id}`}>
                  <div className="group flex items-center p-5 bg-card hover:bg-accent border border-border rounded-xl transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{c.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                        {c.caseNumber && (
                          <span>Case #: <span className="font-medium text-foreground">{c.caseNumber}</span></span>
                        )}
                        {c.defendantName && (
                          <span>Defendant: <span className="font-medium text-foreground">{c.defendantName}</span></span>
                        )}
                        {c.documentCount != null && (
                          <span><span className="font-medium text-foreground">{c.documentCount}</span> doc{c.documentCount !== 1 ? "s" : ""}</span>
                        )}
                        {c.findingCount != null && (
                          <span><span className="font-medium text-foreground">{c.findingCount}</span> finding{c.findingCount !== 1 ? "s" : ""}</span>
                        )}
                        <span>{format(new Date(c.updatedAt), "MMM d, yyyy")}</span>
                      </div>
                      {jBadge && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[260px]">{jBadge.displayText}</span>
                          </span>
                          {jBadge.circuit && (
                            <span className="inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                              {jBadge.circuit}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      {c.hasAnalysis && (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Analyzed
                        </Badge>
                      )}
                      {c.hasMotion && (
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                          <Scale className="w-3 h-3 mr-1" />
                          Motion
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/20">
            <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No cases yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
              Create your first case to start analyzing documents.
            </p>
            <Link href="/cases/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Case
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}
