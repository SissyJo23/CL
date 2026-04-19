import { Link, useLocation } from "wouter";
import { useGetRecentCase } from "@workspace/api-client-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { useUserMode } from "@/contexts/UserModeContext";
import { heroHeading, heroSubtext } from "@/lib/modeContent";

export default function Home() {
  const { data, isLoading } = useGetRecentCase();
  const [, navigate] = useLocation();
  const [demoCaseId, setDemoCaseId] = useState<number | null>(null);
  const { mode } = useUserMode();
  const heading = heroHeading(mode);
  const subtext = heroSubtext(mode);

  useEffect(() => {
    let attempts = 0;
    const tryFetch = () => {
      fetch("/api/demo")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (d?.caseId) {
            setDemoCaseId(d.caseId);
          } else if (attempts < 4) {
            attempts++;
            setTimeout(tryFetch, 1500);
          }
        })
        .catch(() => {
          if (attempts < 4) {
            attempts++;
            setTimeout(tryFetch, 1500);
          }
        });
    };
    tryFetch();
  }, []);

  const handleExploreDemo = () => {
    if (demoCaseId != null) navigate(`/cases/${demoCaseId}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          {heading && (
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-foreground leading-snug">
                {heading}
              </h1>
              {subtext && (
                <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  {subtext}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
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
