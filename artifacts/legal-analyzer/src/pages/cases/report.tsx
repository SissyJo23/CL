import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { API_BASE, getToken } from "@/lib/api";
import { ArrowLeft, FileText, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type ExportData = {
  case: any;
  documents: any[];
  findings: any[];
  categories: any[];
  courtSessions: any[];
  motions: any[];
  exportedAt: string;
};

export default function CasesReport() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data, isLoading, error } = useQuery<ExportData>({
    queryKey: ["case-export", id],
    queryFn: async () => {
        const token = getToken();
      const res = await fetch(`${API_BASE}/api/cases/${id}/export`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load report data");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="font-serif">Compiling Legal Research Report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-red-900 max-w-md">
          <h1 className="font-serif text-2xl font-medium mb-3">Report Unavailable</h1>
          <p className="text-sm opacity-80 mb-6">
            {error instanceof Error ? error.message : "The case report could not be compiled."}
          </p>
          <Link href={`/cases/${id}`}>
            <Button variant="outline" className="border-red-200 text-red-900 hover:bg-red-100">
              Return to Workspace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const findingsByCategory = new Map<number | null, any[]>();
  data.findings.forEach((finding) => {
    const catId = finding.categoryId || null;
    if (!findingsByCategory.has(catId)) findingsByCategory.set(catId, []);
    findingsByCategory.get(catId)!.push(finding);
  });

  const categoriesWithFindings = data.categories
    .map((cat) => ({
      ...cat,
      findings: findingsByCategory.get(cat.id) || [],
    }))
    .filter((cat) => cat.findings.length > 0);

  const uncategorizedFindings = findingsByCategory.get(null) || [];

  return (
    <div className="min-h-screen bg-muted/30 print:bg-white flex flex-col">
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur shadow-sm border-b border-border px-4 py-3 flex justify-between items-center">
        <Link
          href={`/cases/${id}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case Workspace
        </Link>
        <Button onClick={() => window.print()} variant="outline" size="sm" className="bg-background">
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>
      </div>

      <main className="flex-1 py-8 print:py-0 px-4 sm:px-6">
        <div className="max-w-[8.5in] mx-auto bg-background print:bg-transparent shadow-lg print:shadow-none min-h-[11in] px-[0.75in] py-[0.75in] text-foreground border border-border print:border-none">
          {/* Report header */}
          <div className="mb-12 border-b border-foreground/20 pb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Legal Research Report — CaseLight
            </p>
            <div className="mt-8">
              <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase leading-[1.05] text-foreground">
                {data.case.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
                {data.case.defendantName && <span>Defendant: <strong className="text-foreground">{data.case.defendantName}</strong></span>}
                {data.case.jurisdiction && <span>Jurisdiction: <strong className="text-foreground">{data.case.jurisdiction}</strong></span>}
                {data.case.caseNumber && <span>Case No.: <strong className="text-foreground">{data.case.caseNumber}</strong></span>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Generated: {data.exportedAt ? format(new Date(data.exportedAt), "MMMM d, yyyy") : "Unknown"}
              </p>
            </div>
            <p className="mt-8 text-lg text-foreground">
              <strong>{data.findings.length}</strong> findings across <strong>{data.documents.length}</strong> documents
            </p>
          </div>

          {/* Body */}
          <div className="space-y-20">
            {categoriesWithFindings.map((cat) => (
              <CategorySection key={cat.id} category={cat} documents={data.documents} />
            ))}
            {uncategorizedFindings.length > 0 && (
              <CategorySection
                key="uncategorized"
                category={{ name: "Uncategorized Findings", findings: uncategorizedFindings }}
                documents={data.documents}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CategorySection({ category, documents }: { category: any; documents: any[] }) {
  return (
    <div className="mb-16 print-block">
      <div className="mb-10 flex items-baseline justify-between gap-4 border-b-2 border-primary/25 bg-blue-50/80 px-5 py-4">
        <h3 className="text-2xl font-serif font-medium text-blue-900">{category.name}</h3>
        <div className="text-3xl font-serif text-blue-700">
          {category.findings.length} Finding{category.findings.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="space-y-16">
        {category.findings.map((finding: any, idx: number) => (
          <FindingBlock key={finding.id} finding={finding} index={idx + 1} documents={documents} />
        ))}
      </div>
    </div>
  );
}

function FindingBlock({ finding, index, documents }: { finding: any; index: number; documents: any[] }) {
  const doc = documents.find((d) => d.id === finding.documentId);
  const docTitle = doc ? doc.title : "Unknown Document";
  const pageInfo = finding.pageNumber ? `p. ${finding.pageNumber}` : "";
  const lineInfo = finding.lineNumber ? `ll. ${finding.lineNumber}` : "";
  const loc = [pageInfo, lineInfo].filter(Boolean).join(", ");

  return (
    <div className="print-block">
      <h4 className="text-xl font-serif font-medium mb-6 flex items-start gap-4">
        <span className="text-muted-foreground/70 select-none">{index}.</span>
        <span className="leading-snug">{finding.issueTitle}</span>
      </h4>

      <div className="pl-8 sm:pl-10 space-y-8">
        <div className="text-sm">
          <span className="inline-flex items-center gap-2 italic font-serif">
            <FileText className="h-4 w-4 not-italic text-muted-foreground" />
            {docTitle}
          </span>
          {loc && <span className="text-muted-foreground"> · {loc}</span>}
        </div>

        {finding.transcriptExcerpt && (
          <blockquote className="border-l-[3px] border-primary/40 pl-5 py-2 text-base font-serif italic text-foreground/85 leading-relaxed bg-primary/5 pr-4 rounded-r-md">
            "{finding.transcriptExcerpt}"
          </blockquote>
        )}

        {finding.legalAnalysis && (
          <div>
            <div className="font-bold text-[10px] uppercase tracking-widest text-foreground/70 mb-3">
              Legal Analysis
            </div>
            <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap font-serif">
              {finding.legalAnalysis}
            </div>
          </div>
        )}

        {(finding.precedentName || finding.courtRuling) && (
          <div className="border border-primary/20 bg-primary/[0.03] dark:border-primary/30 dark:bg-primary/10 p-6 rounded-md">
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="font-serif font-medium text-primary text-lg leading-snug">
                {finding.precedentName}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded">
                {finding.precedentType || "PERSUASIVE"}
              </div>
            </div>
            {finding.precedentCitation && (
              <div className="text-sm font-serif text-primary/80 mb-4">{finding.precedentCitation}</div>
            )}
            {finding.courtRuling && (
              <div className="text-sm leading-relaxed text-foreground/90 font-serif">
                {finding.courtRuling}
              </div>
            )}
          </div>
        )}

        {(finding.proceduralStatus || finding.anticipatedBlock || finding.breakthroughArgument) && (
          <div className="bg-secondary/50 p-6 rounded-md border border-border/80">
            <div className="font-bold text-[10px] uppercase tracking-widest text-foreground/70 mb-5">
              Strategic Analysis
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {finding.proceduralStatus && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    Procedural Status
                  </div>
                  <div className="text-sm font-medium font-serif">{finding.proceduralStatus}</div>
                </div>
              )}
              {finding.anticipatedBlock && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    Anticipated Block
                  </div>
                  <div className="text-sm font-serif text-destructive/90">{finding.anticipatedBlock}</div>
                </div>
              )}
              {finding.breakthroughArgument && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    Breakthrough Argument
                  </div>
                  <div className="text-sm font-serif text-emerald-700 dark:text-emerald-400">
                    {finding.breakthroughArgument}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
