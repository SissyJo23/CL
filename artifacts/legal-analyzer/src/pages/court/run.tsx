import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetCourtSession, getGetCourtSessionQueryKey } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import type { CourtRound } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Gavel, ArrowRight, AlertTriangle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const STUCK_TIMEOUT_MS = 10 * 60 * 1000;

export default function CourtRun() {
  const params = useParams();
  const caseId = parseInt(params.caseId || "0", 10);
  const sessionId = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  
  const { data: sessionData, isLoading } = useGetCourtSession(caseId, sessionId, { query: { enabled: !!(caseId && sessionId), queryKey: getGetCourtSessionQueryKey(caseId, sessionId) } });
  
  const [rounds, setRounds] = useState<CourtRound[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isStuck, setIsStuck] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!sessionData) return;

    if (sessionData.session.status === "completed") {
      setLocation(`/cases/${caseId}/court/${sessionId}`);
      return;
    }

    if (sessionData.session.status === "error") {
      setIsStuck(true);
      setError(true);
      setErrorMessage("This simulation encountered an error.");
      return;
    }

    if (sessionData.session.status === "running") {
      const updatedAt = new Date(sessionData.session.updatedAt).getTime();
      const age = Date.now() - updatedAt;
      if (age > STUCK_TIMEOUT_MS) {
        setIsStuck(true);
        setError(true);
        setErrorMessage("This simulation was interrupted (the server restarted while it was running). Please start a new simulation.");
        return;
      }
    }

    if (!isComplete && !error && !hasStarted.current) {
      hasStarted.current = true;
      const runSimulation = async () => {
        try {
          const response = await fetch(`/api/cases/${caseId}/court-sessions/${sessionId}/run`, {
            method: "POST",
          });

          if (!response.ok) {
            let msg = "Failed to start simulation.";
            try {
              const body = await response.json();
              if (body?.error) msg = body.error;
            } catch {
              // ignore parse error
            }
            setError(true);
            setErrorMessage(msg);
            toast({ title: "Simulation Error", description: msg, variant: "destructive" });
            return;
          }

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
                if (event.type === "round") {
                  setRounds((prev) => [...prev, event.data]);
                } else if (event.type === "done") {
                  setIsComplete(true);
                } else if (event.type === "error") {
                  setError(true);
                  const msg = event.message || "Failed to complete simulation.";
                  setErrorMessage(msg);
                  toast({ title: "Simulation Error", description: msg, variant: "destructive" });
                }
              } catch {
                console.error("Failed to parse SSE event", line);
              }
            }
          }
        } catch (err) {
          console.error(err);
          setError(true);
          const msg = "Connection to the simulation was lost. Please try again.";
          setErrorMessage(msg);
          toast({ title: "Connection Error", description: msg, variant: "destructive" });
        }
      };

      runSimulation();
    }
  }, [sessionData, isComplete, error, caseId, sessionId, setLocation, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [rounds]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "OVERWHELMING": return "bg-red-100 text-red-800 border-red-200";
      case "STRONG": return "bg-orange-100 text-orange-800 border-orange-200";
      case "MODERATE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "MINIMAL": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Disclaimer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between border-b border-border pb-6 mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-serif font-medium flex items-center gap-3">
              <Gavel className="w-6 h-6" />
              Active Simulation
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-wider">
              {sessionData?.session.simulationMode.replace(/_/g, " ")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isComplete && !error ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                In Progress
              </Badge>
            ) : error ? (
              <Badge variant="destructive">Simulation Failed</Badge>
            ) : (
              <Button onClick={() => setLocation(`/cases/${caseId}/court/${sessionId}`)}>
                View Verdict <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-4 p-5 bg-destructive/5 border border-destructive/20 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground mb-1">Simulation Interrupted</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{errorMessage}</p>
              <div className="flex gap-3 mt-4">
                <Link href={`/cases/${caseId}/court/new`}>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Simulation
                  </Button>
                </Link>
                <Link href={`/cases/${caseId}`}>
                  <Button variant="outline" size="sm">Back to Case</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-12">
          {rounds.map((round) => (
            <div key={round.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
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

          {!isComplete && !error && (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          )}

          {isComplete && !error && (
            <div className="flex justify-center pt-4">
              <Button size="lg" onClick={() => setLocation(`/cases/${caseId}/court/${sessionId}`)}>
                View Full Verdict & Motion <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
