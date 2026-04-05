import { useParams, Link } from "wouter";
import { useListMotions, getListMotionsQueryKey, useGetCase, getGetCaseQueryKey } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, Scale } from "lucide-react";
import { format } from "date-fns";

export default function MotionList() {
  const params = useParams();
  const caseId = parseInt(params.caseId || "0", 10);

  const { data: motions, isLoading: motionsLoading } = useListMotions(caseId, {
    query: { enabled: !!caseId, queryKey: getListMotionsQueryKey(caseId) },
  });
  const { data: currentCase } = useGetCase(caseId, {
    query: { enabled: !!caseId, queryKey: getGetCaseQueryKey(caseId) },
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href={`/cases/${caseId}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-medium text-foreground">Generated Motions</h1>
          {currentCase && (
            <p className="text-muted-foreground mt-1">{currentCase.title}</p>
          )}
        </div>

        {motionsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : motions && motions.length > 0 ? (
          <div className="grid gap-4">
            {motions.map((motion) => (
              <Link key={motion.id} href={`/cases/${caseId}/motions/${motion.id}`}>
                <div className="group p-5 bg-card hover:bg-accent border border-border rounded-xl transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Scale className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {motion.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        <span>Generated {format(new Date(motion.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {motion.content.slice(0, 200)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/20">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No motions yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Run the court simulator to completion and a motion will be generated automatically.
            </p>
            <Link href={`/cases/${caseId}/court/new`}>
              <Button>
                <Scale className="w-4 h-4 mr-2" />
                Run Court Simulator
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}
