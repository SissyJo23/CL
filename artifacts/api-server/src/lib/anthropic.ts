import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "ANTHROPIC_API_KEY is not set. AI analysis will fail until the key is provided.",
  );
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  transcript: "Court Transcript",
  police_report: "Police Report",
  appeal: "Appeal Document",
  motion: "Motion",
  order: "Court Order",
  affidavit: "Affidavit",
  exhibit: "Exhibit",
  policy: "Policy Document",
  executive_order: "Executive Order",
  other: "Document",
};

export function buildAnalysisPrompt(
  documentType: string,
  documentTitle: string,
  content: string,
  otherDocuments: { id: number; title: string; content: string }[],
): string {
  const docTypeLabel =
    DOCUMENT_TYPE_LABELS[documentType] ?? "Legal Document";

  const crossDocContext =
    otherDocuments.length > 0
      ? `\n\nOTHER DOCUMENTS IN THIS CASE (for cross-reference):\n${otherDocuments
          .map(
            (d) =>
              `--- [DOC_ID:${d.id}] ${d.title} ---\n${d.content.slice(0, 3000)}`,
          )
          .join("\n\n")}`
      : "";

  return `You are an expert legal analyst reviewing a ${docTypeLabel} titled "${documentTitle}" for potential constitutional violations, procedural errors, ineffective assistance of counsel, Brady violations, prosecutorial misconduct, chain-of-custody issues, and any other legal issues that could support post-conviction relief.

Your analysis must be EXHAUSTIVE. You must examine EVERY element of the document — every line, every date, every signature, every procedural notation, every piece of boilerplate, every off-record reference, every spelling error or inconsistency, every timestamp, every name — nothing may be skipped or summarized away. If it's in the document, you must analyze it.

DOCUMENT TO ANALYZE:
${content}
${crossDocContext}

TASK: Return a JSON array of findings. Each finding must follow this exact structure:
{
  "issueTitle": "Short descriptive title of the issue",
  "transcriptExcerpt": "The exact quoted text from the document that supports this finding",
  "legalAnalysis": "Deep legal analysis explaining why this is significant, what right or standard it implicates, and how it could be raised on appeal or in a post-conviction motion",
  "precedentName": "Name of most directly applicable case (or null)",
  "precedentCitation": "Full citation (or null)",
  "precedentType": "BINDING or PERSUASIVE (or null)",
  "courtRuling": "What the precedent court held, stated in one or two sentences (or null)",
  "materialSimilarity": "How the precedent facts are similar to the facts here (or null)",
  "crossCaseMatches": [
    {
      "sourceDocumentId": <integer document id from the case>,
      "sourceDocumentTitle": "<title of the other document>",
      "matchedPassage": "<the relevant passage from that other document>",
      "explanation": "<why this finding connects to or contradicts something in that document>",
      "relevanceScore": <float 0-1>
    }
  ]
}

MANDATORY COVERAGE — you must produce separate findings for:
1. Every date discrepancy, timeline inconsistency, or impossible sequence
2. Every signature, certification, or notarization (present or missing)
3. Every Miranda/rights waiver or invocation
4. Every chain of custody notation or gap
5. Every Brady/Giglio potential (exculpatory or impeachment evidence)
6. Every instance of prosecutorial or police overreach
7. Every procedural step that appears irregular, missing, or untimely
8. Every instance where counsel failed to object, investigate, or advise
9. Every plea colloquy element (if applicable)
10. Every sentencing calculation or guideline reference
11. Every exhibit reference and whether it was actually admitted
12. Every off-record discussion, sidebar, or recess notation
13. Every instance of witness coaching, leading questions, or hearsay
14. Every inconsistency between this document and other documents in the case
15. Any spelling errors, name misspellings, or case number discrepancies that could indicate document authenticity issues

You must find ALL of these categories IF the content supports them. Do not skip categories because they seem unimportant — the defense determines importance, not you.

Return ONLY a valid JSON array. No commentary before or after. No markdown code fences. Begin your response with [ and end with ].`;
}

export function buildCourtSimulationPrompt(params: {
  simulationMode: string;
  skepticMode: boolean;
  expandedRecord: boolean;
  pleaQuestionnaireNotes: string | null;
  caseTitle: string;
  findings: {
    issueTitle: string;
    transcriptExcerpt: string;
    legalAnalysis: string;
    precedentName?: string | null;
    precedentCitation?: string | null;
    courtRuling?: string | null;
  }[];
  roundNumber: number;
  priorRounds: {
    stateArgument: string;
    courtCommentary: string;
    defenseResponse: string;
  }[];
}): string {
  const modeDescriptions: Record<string, string> = {
    direct_appeal: `DIRECT APPEAL — Standard of review: De novo for constitutional questions; harmless error (Chapman v. California) for trial errors. The court is bound by the trial record only. The State's burden is to show any error was harmless beyond a reasonable doubt.`,
    bangert_motion: `BANGERT MOTION (Plea Withdrawal) — Under State v. Bangert, 131 Wis. 2d 246 (1986), once defendant makes a prima facie showing the plea colloquy was defective, the burden shifts to the State to prove by clear and convincing evidence that the plea was knowingly and voluntarily entered. Defense must identify the specific colloquy failure.`,
    postconviction_974: `WIS. STAT. § 974.06 POSTCONVICTION — Defendant must show (1) ineffective assistance of counsel under Strickland v. Washington (deficiency + prejudice), AND overcome the Escalona-Naranjo procedural bar by showing a sufficient reason why the claim was not raised on direct appeal. IAC claims are fact-intensive — trial counsel's decisions must be examined for objective reasonableness.`,
    federal_habeas: `FEDERAL HABEAS CORPUS (28 U.S.C. § 2254) — Under AEDPA, the court may only grant relief if the state court decision was (1) contrary to, or involved an unreasonable application of, clearly established Federal law as determined by SCOTUS; or (2) based on an unreasonable determination of the facts. Deference to state court findings is extremely high. Procedural default is a threshold issue.`,
  };

  const modeDesc =
    modeDescriptions[params.simulationMode] ?? modeDescriptions.direct_appeal;

  const skepticNote = params.skepticMode
    ? `\nJUDICIAL SKEPTIC MODE ACTIVE: The judge actively challenges BOTH sides — pressing defense on procedural defaults and harmless error, pressing State on constitutional obligations. The judge is not passive.`
    : "";

  const expandedNote = params.expandedRecord
    ? `\nEXPANDED RECORD: The State may reference post-conviction affidavits, evidentiary hearings, and witness testimony beyond the trial record.`
    : "";

  const pleaNote = params.pleaQuestionnaireNotes
    ? `\nPLEA QUESTIONNAIRE NOTES: ${params.pleaQuestionnaireNotes}`
    : "";

  const findingsText = params.findings
    .map(
      (f, i) =>
        `ISSUE ${i + 1}: ${f.issueTitle}
Excerpt: "${f.transcriptExcerpt}"
Analysis: ${f.legalAnalysis}
${f.precedentName ? `Precedent: ${f.precedentName} (${f.precedentCitation}) — ${f.courtRuling}` : ""}`,
    )
    .join("\n\n");

  const priorRoundsText =
    params.priorRounds.length > 0
      ? `\nPRIOR ROUNDS:\n${params.priorRounds
          .map(
            (r, i) => `Round ${i + 1}:
STATE: ${r.stateArgument}
COURT: ${r.courtCommentary}
DEFENSE: ${r.defenseResponse}`,
          )
          .join("\n\n")}`
      : "";

  return `You are simulating oral argument in a real appellate proceeding. Case: ${params.caseTitle}

PROCEDURAL POSTURE:
${modeDesc}${skepticNote}${expandedNote}${pleaNote}

LEGAL ISSUES RAISED BY DEFENSE:
${findingsText}
${priorRoundsText}

This is ROUND ${params.roundNumber} of the hearing.

Generate this round of argument as a JSON object with this exact structure:
{
  "stateStrength": "MINIMAL | MODERATE | STRONG | OVERWHELMING",
  "defenseBurden": "One sentence describing what defense must demonstrate this round",
  "stateArgument": "The State's argument this round (2-4 paragraphs, citing specific facts and precedent, aggressive and well-reasoned)",
  "courtCommentary": "The judge's commentary and questions (1-3 paragraphs, probing both sides, citing the applicable standard of review)",
  "defenseResponse": "Defense counsel's response (2-4 paragraphs, directly engaging State's argument, citing specific record evidence and constitutional precedent)"
}

The arguments must be detailed, substantive, and legally precise. The State must actively try to show harmless error, procedural default, or lack of prejudice. Defense must advance constitutional claims with specific record citations. The judge must apply the correct standard of review.

Return ONLY a valid JSON object. No commentary. No markdown. Begin with { and end with }.`;
}

export function buildVerdictPrompt(params: {
  simulationMode: string;
  caseTitle: string;
  findings: { issueTitle: string }[];
  rounds: {
    stateStrength: string;
    stateArgument: string;
    courtCommentary: string;
    defenseResponse: string;
  }[];
}): string {
  const roundsSummary = params.rounds
    .map(
      (r, i) =>
        `Round ${i + 1} (State: ${r.stateStrength}): ${r.stateArgument.slice(0, 200)}...`,
    )
    .join("\n");

  return `You are the appellate judge in case: ${params.caseTitle}

After ${params.rounds.length} rounds of argument in a ${params.simulationMode.replace("_", " ").toUpperCase()} hearing, render your verdict.

ARGUMENT SUMMARY:
${roundsSummary}

Return a JSON object with this exact structure:
{
  "verdictRating": "STRONG DEFENSE WIN | DEFENSE WIN | MIXED | STATE WIN | STRONG STATE WIN",
  "verdictSummary": "3-5 paragraph judicial opinion explaining the ruling, citing specific arguments and standards",
  "defenseWon": true | false
}

Be honest and legally rigorous. If the defense raised serious constitutional issues with clear prejudice, rule for defense. If the State showed harmless error or procedural default, rule for State. Apply the correct standard.

Return ONLY valid JSON. No commentary. No markdown.`;
}

export function buildMotionPrompt(params: {
  caseTitle: string;
  simulationMode: string;
  findings: {
    issueTitle: string;
    transcriptExcerpt: string;
    legalAnalysis: string;
    precedentName?: string | null;
    precedentCitation?: string | null;
    precedentType?: string | null;
    courtRuling?: string | null;
    materialSimilarity?: string | null;
  }[];
  verdictSummary: string;
}): string {
  const findingsText = params.findings
    .map(
      (f, i) => `ISSUE ${i + 1}: ${f.issueTitle}
Record Support: "${f.transcriptExcerpt}"
Legal Basis: ${f.legalAnalysis}
${f.precedentName ? `Authority: ${f.precedentName}, ${f.precedentCitation} — ${f.courtRuling}` : ""}`,
    )
    .join("\n\n");

  const motionTypeMap: Record<string, string> = {
    direct_appeal: "BRIEF IN SUPPORT OF DIRECT APPEAL",
    bangert_motion: "MOTION TO WITHDRAW GUILTY PLEA (BANGERT MOTION)",
    postconviction_974:
      "MOTION FOR POST-CONVICTION RELIEF PURSUANT TO WIS. STAT. § 974.06",
    federal_habeas:
      "PETITION FOR WRIT OF HABEAS CORPUS PURSUANT TO 28 U.S.C. § 2254",
  };

  const motionType =
    motionTypeMap[params.simulationMode] ??
    motionTypeMap.direct_appeal;

  return `Generate a complete, court-ready legal motion titled "${motionType}" for the case: ${params.caseTitle}

Based on these findings from the court record:
${findingsText}

JUDICIAL GUIDANCE FROM SIMULATION:
${params.verdictSummary}

The motion must include:
1. Caption and title
2. Introduction and procedural history
3. Statement of facts with specific record citations
4. Legal argument sections — one per issue, each with: (a) standard of review, (b) constitutional/legal analysis, (c) application to these facts, (d) prejudice showing
5. Conclusion requesting specific relief
6. Certificate of service placeholder

Write the motion in full formal legal style. Every argument must cite specific passages from the record and controlling precedent. Use the exact legal standards for the applicable motion type. This motion should be ready to file, not a template.

Return the complete motion text only — no JSON wrapping, no code fences. Begin with the case caption.`;
}

export async function runCrossCaseMatching(
  newFindings: Array<{
    id: number;
    issueTitle: string;
    transcriptExcerpt: string;
    legalAnalysis: string;
    documentId: number;
  }>,
  otherFindings: Array<{
    id: number;
    issueTitle: string;
    transcriptExcerpt: string;
    documentId: number;
    documentTitle: string;
    caseTitle: string;
  }>,
): Promise<
  Array<{
    newFindingId: number;
    sourceDocumentId: number;
    sourceDocumentTitle: string;
    matchedPassage: string;
    explanation: string;
    relevanceScore: number;
  }>
> {
  if (newFindings.length === 0 || otherFindings.length === 0) return [];

  const prompt = `You are a legal cross-case analyst. Below are new legal findings from a document just analyzed, followed by existing findings from other cases in the system. Identify every meaningful cross-case match — where the same issue, pattern, or constitutional violation appears in another case's record.

NEW FINDINGS:
${newFindings
  .map(
    (f, i) =>
      `[NEW_${i}] ID:${f.id} — "${f.issueTitle}"\nExcerpt: "${f.transcriptExcerpt.slice(0, 300)}"`,
  )
  .join("\n\n")}

EXISTING FINDINGS FROM OTHER CASES:
${otherFindings
  .map(
    (f, i) =>
      `[OTHER_${i}] ID:${f.id} | Case: ${f.caseTitle} | Doc: "${f.documentTitle}" — "${f.issueTitle}"\nExcerpt: "${f.transcriptExcerpt.slice(0, 200)}"`,
  )
  .join("\n\n")}

Return a JSON array of cross-case matches. Each match:
{
  "newFindingId": <id of the new finding>,
  "otherFindingIndex": <index of the OTHER_ finding>,
  "matchedPassage": "<the relevant passage from the other finding's excerpt>",
  "explanation": "<why this cross-case pattern is legally significant>",
  "relevanceScore": <0.0 to 1.0>
}

Only include matches with relevanceScore >= 0.6. Return [] if no strong matches. Return ONLY valid JSON array.`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = msg.content[0]?.type === "text" ? msg.content[0].text : "[]";
    const cleaned = raw.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
    const matches = JSON.parse(cleaned) as Array<{
      newFindingId: number;
      otherFindingIndex: number;
      matchedPassage: string;
      explanation: string;
      relevanceScore: number;
    }>;

    return matches
      .filter((m) => m.otherFindingIndex >= 0 && m.otherFindingIndex < otherFindings.length)
      .map((m) => {
        const other = otherFindings[m.otherFindingIndex];
        return {
          newFindingId: m.newFindingId,
          sourceDocumentId: other.documentId,
          sourceDocumentTitle: `${other.caseTitle} — ${other.documentTitle}`,
          matchedPassage: m.matchedPassage,
          explanation: m.explanation,
          relevanceScore: Math.min(1, Math.max(0, m.relevanceScore)),
        };
      });
  } catch {
    return [];
  }
}
