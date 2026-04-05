import { Link, useLocation } from "wouter";
import { useGetRecentCase } from "@workspace/api-client-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function Home() {
  const { data, isLoading } = useGetRecentCase();
  const [, navigate] = useLocation();
  const [demoCaseId, setDemoCaseId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/demo")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.caseId) setDemoCaseId(d.caseId); })
      .catch(() => {});
  }, []);

  const handleExploreDemo = () => {
    if (demoCaseId != null) navigate(`/cases/${demoCaseId}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground font-medium leading-tight">
            The fight isn't over just because the gavel cracked.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            CaseLight exists for the people left standing in the courthouse parking lot with a verdict that doesn't feel like justice. We read every line of every document, surface every legal issue, and draft the motions that keep the fight alive — because somewhere between the verdict and the silence, is the truth — and we will find it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 flex-wrap">
            <Link href="/cases/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full" data-testid="button-create-case">
                Create Case
              </Button>
            </Link>

            {!isLoading && data?.case && (
              <Link href={`/cases/${data.case.id}`} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full" data-testid="button-continue-case">
                  Continue Where You Left Off
                </Button>
              </Link>
            )}
            {!isLoading && data?.case?.hasAnalysis && !data?.case?.hasMotion && (
              <Link href={`/cases/${data.case.id}/court/new`} className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full" data-testid="button-create-motion">
                  Create Motion
                </Button>
              </Link>
            )}
            {!isLoading && data?.case?.hasMotion && (
              <Link href={`/cases/${data.case.id}/motions`} className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full" data-testid="button-view-motions">
                  View Generated Motion
                </Button>
              </Link>
            )}

            {demoCaseId != null && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleExploreDemo}
                className="w-full sm:w-auto text-base h-14 px-8 rounded-full border-dashed text-muted-foreground hover:text-foreground"
                data-testid="button-explore-demo"
              >
                <Compass className="w-4 h-4 mr-2" />
                Explore a Sample Case
              </Button>
            )}
          </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
