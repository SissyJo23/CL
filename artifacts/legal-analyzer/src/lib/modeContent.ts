import type { UserMode } from "@/contexts/UserModeContext";

export type { UserMode };

export const MODE_LABELS: Record<UserMode, string> = {
  inmate: "Pro Se",
  advocate: "Advocate",
  attorney: "Attorney",
  appellate: "Appellate",
};

export function proceduralStatusLabel(status: string, mode: UserMode): string {
  if (mode === "attorney" || mode === "appellate") {
    return status;
  }
  const inmateMap: Record<string, string> = {
    Preserved: "This claim is still open — it hasn't been blocked yet",
    Defaulted: "This claim may be blocked because it wasn't raised on time",
    Unclear: "It's not clear yet whether this claim can still be raised",
  };
  const advocateMap: Record<string, string> = {
    Preserved: "This issue can still be raised in court",
    Defaulted: "This issue was not properly raised and may be difficult to pursue",
    Unclear: "The status of this issue needs further review",
  };
  const map = mode === "inmate" ? inmateMap : advocateMap;
  return map[status] ?? status;
}

export function survivabilityLabel(rating: string, mode: UserMode): string {
  if (mode === "attorney" || mode === "appellate") return rating;
  if (mode === "inmate") {
    const map: Record<string, string> = {
      Strong: "Good chance of success",
      Moderate: "Possible — needs more work",
      Vulnerable: "Difficult — worth pursuing anyway",
    };
    return map[rating] ?? rating;
  }
  const map: Record<string, string> = {
    Strong: "Strong argument",
    Moderate: "Moderate argument",
    Vulnerable: "Challenging argument",
  };
  return map[rating] ?? rating;
}

export function sectionTitle(key: string, mode: UserMode): string {
  if (mode === "attorney" || mode === "appellate") {
    const map: Record<string, string> = {
      anticipatedBlock: "Anticipated Block",
      breakthroughArgument: "Breakthrough Argument",
      legalVehicle: "Best Legal Vehicle",
      proceduralStatus: "Procedural Status",
    };
    return map[key] ?? key;
  }
  const plainMap: Record<string, string> = {
    anticipatedBlock: "What the state will argue",
    breakthroughArgument: "How to respond",
    legalVehicle: "Best next step",
    proceduralStatus: "Can this still be raised?",
  };
  return plainMap[key] ?? key;
}

export function emptyStateMessage(context: string, mode: UserMode): string {
  if (mode === "inmate") {
    const map: Record<string, string> = {
      noDocuments:
        "Upload your court records — we'll go through every page looking for mistakes that could help your case.",
      noFindings: "No issues found in this document yet.",
      noAnalysis: "Add your court documents and run the analysis to see what errors may be in your record.",
    };
    return map[context] ?? context;
  }
  if (mode === "advocate") {
    const map: Record<string, string> = {
      noDocuments: "Add court documents to start looking for grounds for appeal.",
      noFindings: "No issues found in this document yet.",
      noAnalysis: "Upload court records to identify legal errors and next steps.",
    };
    return map[context] ?? context;
  }
  return context;
}

export function heroHeading(mode: UserMode): string | null {
  if (mode === "inmate") return "Your record. Every error. Every option. In plain language.";
  if (mode === "advocate") return "Find the argument. Fight for the person who needs it.";
  if (mode === "attorney") return "From CaseLight to Freedom — one case at a time.";
  if (mode === "appellate") return "Every avenue, exhausted. Every argument, tested.";
  return null;
}

export function heroSubtext(mode: UserMode): string | null {
  if (mode === "inmate")
    return "Upload your court documents and CaseLight will read every page looking for legal errors, missed issues, and grounds for relief — then explain what it found in plain language.";
  if (mode === "advocate")
    return "Upload the case record and CaseLight will identify every legal error, explain what each one means, and show exactly what can be done next.";
  if (mode === "attorney")
    return "Upload transcripts and court documents. CaseLight flags every error across 24 legal categories, maps each finding to precedent, and builds the cumulative argument automatically.";
  if (mode === "appellate")
    return "CaseLight tracks AEDPA deadlines, maps the exhaustion ladder, identifies federally-preserved claims, and stress-tests every argument in adversarial court simulation before you file.";
  return null;
}

export function actionStepForVehicle(legalVehicle: string | null | undefined, mode: UserMode): string | null {
  if (!legalVehicle || (mode !== "inmate" && mode !== "advocate")) return null;
  if (mode === "inmate") {
    if (legalVehicle.toLowerCase().includes("habeas")) return "You may be able to file a habeas corpus petition asking a court to review this error.";
    if (legalVehicle.toLowerCase().includes("appeal")) return "This may be something your attorney can raise on appeal.";
    if (legalVehicle.toLowerCase().includes("motion")) return "Your attorney may be able to file a motion on this issue.";
    return `Possible action: ${legalVehicle}.`;
  }
  return `Consider pursuing: ${legalVehicle}.`;
}
