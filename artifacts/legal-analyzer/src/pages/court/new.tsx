import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetCase, getGetCaseQueryKey, useListDocuments, getListDocumentsQueryKey, useCreateCourtSession, getListCourtSessionsQueryKey } from "@workspace/api-client-react";
import type { CreateCourtSessionBodySimulationMode } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gavel, Scale, AlertTriangle, Shield, Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SIMULATION_MODES = [
  {
    id: "direct_appeal",
    name: "Direct Appeal",
    desc: "Record-only, harmless error standard",
    icon: Scale,
  },
  {
    id: "bangert_motion",
    name: "Bangert Motion",
    desc: "Plea withdrawal; burden shifts to State",
    icon: Gavel,
  },
  {
    id: "postconviction_974",
    name: "§974.06 Postconviction",
    desc: "IAC + Escalona bar + Strickland standard",
    icon: Shield,
  },
  {
    id: "federal_habeas",
    name: "Federal Habeas",
    desc: "AEDPA § 2254 deference",
    icon: AlertTriangle,
  },
] as const;

export default function CourtNew() {
  const params = useParams();
  const caseId = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();

  const { data: currentCase } = useGetCase(caseId, { query: { enabled: !!caseId, queryKey: getGetCaseQueryKey(caseId) } });
  const { data: documents = [] } = useListDocuments(caseId, { query: { enabled: !!caseId, queryKey: getListDocumentsQueryKey(caseId) } });

  const createSession = useCreateCourtSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [mode, setMode] = useState<CreateCourtSessionBodySimulationMode>("direct_appeal");
  const [skepticMode, setSkepticMode] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(false);
  const [pleaNotes, setPleaNotes] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<Set<number>>(new Set());

  const toggleDoc = (id: number) => {
    const next = new Set(selectedDocs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedDocs(next);
  };

  const selectedDocObjects = documents.filter((d) => selectedDocs.has(d.id));
  const selectedHaveNoFindings = selectedDocObjects.length > 0 && selectedDocObjects.every((d) => (d.findingCount ?? 0) === 0);
  const analyzedDocCount = documents.filter((d) => (d.findingCount ?? 0) > 0).length;

  const handleStart = () => {
    if (selectedDocs.size === 0) {
      toast({ title: "No documents selected", description: "Select at least one document to run the simulation.", variant: "destructive" });
      return;
    }

    if (selectedHaveNoFindings) {
      toast({
        title: "Documents not yet analyzed",
        description: "The selected documents have no findings. Open each document and run analysis before starting the simulation.",
        variant: "destructive",
      });
      return;
    }

    createSession.mutate(
      {
        caseId,
        data: {
          simulationMode: mode,
          skepticMode,
          expandedRecord,
          pleaQuestionnaireNotes: pleaNotes || null,
          documentIds: Array.from(selectedDocs),
        },
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getListCourtSessionsQueryKey(caseId) });
          setLocation(`/cases/${caseId}/court/${data.id}/run`);
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to start simulation", variant: "destructive" });
        },
      },
    );
  };

  const noneAnalyzed = documents.length > 0 && analyzedDocCount === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Link href={`/cases/${caseId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case
        </Link>

        <div className="space-y-8">
          <div className="border-b border-border pb-6">
            <h1 className="text-3xl font-serif font-medium tracking-tight">Court Simulator</h1>
            <p className="text-xl font-serif italic text-muted-foreground mt-2">
              "This is your case. We'll fight it like it matters — because it does."
            </p>
          </div>

          {noneAnalyzed && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Documents need to be analyzed first</p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                  None of your documents have been analyzed yet. Click each document on the case page and run analysis to generate findings — the court simulator uses those findings to build the arguments.
                </p>
                <Link href={`/cases/${caseId}`}>
                  <button className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-300 underline underline-offset-2">
                    Go back and analyze documents →
                  </button>
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-medium mb-4">Simulation Standard</h2>
                <RadioGroup value={mode} onValueChange={(val) => setMode(val as CreateCourtSessionBodySimulationMode)} className="grid gap-3">
                  {SIMULATION_MODES.map((m) => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;
                    return (
                      <label
                        key={m.id}
                        className={cn(
                          "relative flex cursor-pointer rounded-xl border p-4 hover:bg-muted/50 transition-colors",
                          isActive ? "bg-muted border-primary shadow-sm" : "border-border bg-card",
                        )}
                      >
                        <RadioGroupItem value={m.id} className="sr-only" />
                        <div className="flex items-center gap-4 w-full">
                          <div className={cn("p-2 rounded-full", isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{m.name}</div>
                            <div className="text-sm text-muted-foreground">{m.desc}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </section>

              <section className="space-y-4 bg-card border border-border p-5 rounded-xl">
                <h2 className="text-lg font-medium">Environmental Controls</h2>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Judicial Skeptic Mode</label>
                    <p className="text-xs text-muted-foreground">Judge actively challenges both sides</p>
                  </div>
                  <Switch checked={skepticMode} onCheckedChange={setSkepticMode} />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Expanded Evidentiary Record</label>
                    <p className="text-xs text-muted-foreground">State utilizes affidavits & witnesses</p>
                  </div>
                  <Switch checked={expandedRecord} onCheckedChange={setExpandedRecord} />
                </div>
              </section>

              {mode === "bangert_motion" && (
                <section className="space-y-2 fade-in slide-in-from-top-4 animate-in duration-300">
                  <label className="text-sm font-medium">Plea Questionnaire Notes (Optional)</label>
                  <Textarea
                    value={pleaNotes}
                    onChange={(e) => setPleaNotes(e.target.value)}
                    placeholder="Enter details about the plea questionnaire defects..."
                    className="h-24 bg-card"
                  />
                </section>
              )}
            </div>

            <div className="space-y-6">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Select Record Documents</h2>
                  <span className="text-sm text-muted-foreground">{selectedDocs.size} selected</span>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border h-[400px] overflow-y-auto">
                  {documents.length > 0 ? (
                    documents.map((doc) => {
                      const hasFindings = (doc.findingCount ?? 0) > 0;
                      return (
                        <label
                          key={doc.id}
                          className={cn(
                            "flex items-center gap-3 p-4 cursor-pointer transition-colors",
                            hasFindings ? "hover:bg-muted/50" : "opacity-60 hover:bg-muted/30",
                          )}
                        >
                          <Checkbox
                            checked={selectedDocs.has(doc.id)}
                            onCheckedChange={() => toggleDoc(doc.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{doc.documentType.replace("_", " ")}</p>
                          </div>
                          {hasFindings ? (
                            <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                              {doc.findingCount} Findings
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full whitespace-nowrap">
                              Not analyzed
                            </span>
                          )}
                        </label>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No documents available in this case.
                    </div>
                  )}
                </div>

                {selectedHaveNoFindings && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Selected documents have no findings. Analyze them first.
                  </p>
                )}
              </section>

              <Button
                size="lg"
                className="w-full h-14 text-base"
                onClick={handleStart}
                disabled={createSession.isPending || selectedDocs.size === 0 || selectedHaveNoFindings}
              >
                {createSession.isPending ? "Preparing Simulation..." : "Start Simulation"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
