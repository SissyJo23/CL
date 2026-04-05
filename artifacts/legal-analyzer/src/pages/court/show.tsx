import { useParams, Link } from "wouter";
import { useGetCourtSession, getGetCourtSessionQueryKey, useGetCase } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Gavel, Award, Scale, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CourtShow() {
  const params = useParams();
  const caseId = parseInt(params.caseId || "0", 10);
  const sessionId = parseInt(params.id || "0", 10);
  
  const { data: sessionData, isLoading } = useGetCourtSession(sessionId, { query: { enabled: !!sessionId, queryKey: getGetCourtSessionQueryKey(sessionId) } });
  const { data: caseData } = useGetCase(caseId, { query: { enabled: !!caseId } });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-48 w-full" />
        </main>
      </div>
    );
  }

  if (!sessionData) return null;

  const { session, rounds } = sessionData;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'OVERWHELMING': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300';
      case 'STRONG': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'MINIMAL': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isWin = session.defenseWon;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <Link href={`/cases/${caseId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Workspace
          </Link>
          
          {caseData?.hasMotion && (
            <Link href={`/cases/${caseId}`}>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                View Generated Motion
              </Button>
            </Link>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className={`p-8 text-center border-b ${isWin ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'}`}>
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isWin ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-serif font-medium mb-4 text-foreground">
              {session.verdictRating}
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {session.verdictSummary}
            </p>
          </div>
          
          <div className="bg-muted/30 p-4 flex flex-wrap gap-4 justify-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <span>Mode: {session.simulationMode.replace('_', ' ')}</span>
            <span>•</span>
            <span>Rounds: {session.totalRounds}</span>
            {session.skepticMode && (
              <>
                <span>•</span>
                <span>Skeptic Judge</span>
              </>
            )}
            {session.expandedRecord && (
              <>
                <span>•</span>
                <span>Expanded Record</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-medium flex items-center gap-2">
            <Gavel className="w-5 h-5 text-muted-foreground" />
            Simulation Transcript
          </h2>
          
          <div className="space-y-8">
            {rounds.map((round) => (
              <div key={round.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
                  <div className="font-serif font-medium text-lg">Round {round.roundNumber}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">State Strength:</span>
                    <Badge variant="outline" className={getStrengthColor(round.stateStrength)}>
                      {round.stateStrength}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Defense Burden
                    </h3>
                    <p className="text-foreground/90 pl-4 border-l-2 border-primary/20 leading-relaxed">
                      {round.defenseBurden}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/10">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-destructive mb-3">The State</h3>
                      <p className="text-sm text-foreground/80 leading-relaxed font-serif">
                        "{round.stateArgument}"
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">The Defense</h3>
                      <p className="text-sm text-foreground/80 leading-relaxed font-serif">
                        "{round.defenseResponse}"
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <Gavel className="w-3.5 h-3.5" />
                      The Court
                    </h3>
                    <p className="text-sm text-foreground/90 leading-relaxed font-serif italic">
                      "{round.courtCommentary}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}