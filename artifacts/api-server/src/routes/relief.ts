import { Router } from "express";
import { z } from "zod/v4";
import { db, casesTable, findingsTable, reliefPathwaysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { anthropic } from "../lib/anthropic";
import { logger } from "../lib/logger";

const VALID_STATUSES = ["Completed", "Pending", "Available", "Blocked"] as const;

const stepUpdateSchema = z.object({
  step: z.number().int().min(1).max(6),
  status: z.enum(VALID_STATUSES).optional(),
  completedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").nullable().optional(),
  notes: z.string().nullable().optional(),
});

const putBodySchema = z.object({
  stepUpdates: z.array(stepUpdateSchema).optional(),
  aedpaDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
  aedpaTolled: z.boolean().optional(),
});

const router = Router({ mergeParams: true });

type SupportedState = "WI" | "IL" | "MN";

type LadderRung = {
  step: number;
  court: string;
  description: string;
};

type ReliefOption = {
  option: string;
  body: string;
  description: string;
  eligibilityNote: string;
};

type StateData = {
  name: string;
  circuit: string;
  ladder: LadderRung[];
  executiveOptions: ReliefOption[];
  administrativeOptions: ReliefOption[];
  ladderPromptInstructions: string;
  executivePromptInstructions: string;
  administrativePromptInstructions: string;
};

const STATE_DATA: Record<SupportedState, StateData> = {
  WI: {
    name: "Wisconsin",
    circuit: "7th Circuit",
    ladder: [
      { step: 1, court: "WI Circuit Court", description: "Trial court — direct post-conviction motion, plea withdrawal, or new trial motion" },
      { step: 2, court: "WI Court of Appeals", description: "Intermediate appellate court — direct appeal or § 974.06 appeal" },
      { step: 3, court: "WI Supreme Court", description: "Discretionary review — petition for review (PDR)" },
      { step: 4, court: "U.S. District Court (E.D. or W.D. Wis.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires exhaustion of state remedies" },
      { step: 5, court: "7th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon",
        body: "Wisconsin Pardon Advisory Board / Governor of Wisconsin",
        description: "A pardon forgives the conviction and restores civil rights. Applicants must complete their sentence (including supervision), wait five years post-discharge, and submit a formal application to the Pardon Advisory Board, which makes recommendations to the Governor. The Governor has sole discretion to grant or deny.",
        eligibilityNote: "Must have completed entire sentence including supervision; minimum five-year waiting period post-discharge required.",
      },
      {
        option: "Sentence Commutation",
        body: "Governor of Wisconsin",
        description: "Commutation reduces an existing sentence without removing the conviction. Applicants may apply directly to the Governor's office. There is no formal board review requirement, though the Governor may consult with the Department of Corrections. Applications must demonstrate compelling circumstances such as rehabilitation, terminal illness, or manifest injustice.",
        eligibilityNote: "No statutory waiting period; Governor has broad discretion to grant, modify, or deny.",
      },
      {
        option: "Wisconsin Parole Commission",
        body: "Wisconsin Parole Commission",
        description: "For prisoners sentenced before December 31, 1999 (indeterminate sentencing), the Parole Commission has jurisdiction to grant discretionary parole. Prisoners are reviewed based on rehabilitation progress, institutional behavior, community support, and risk assessment. Post-1999 sentences use the Truth-in-Sentencing system and are not eligible for parole.",
        eligibilityNote: "Applies only to pre-January 1, 2000 convictions sentenced under indeterminate sentencing law.",
      },
    ],
    administrativeOptions: [
      {
        option: "Program Review Committee (PRC) Earned Release",
        body: "Wisconsin Department of Corrections — Program Review Committee",
        description: "The PRC Earned Release Program allows eligible prisoners to earn early release by completing approved substance abuse treatment programs. After completing the program, the prisoner appears before the PRC, which may recommend early release to the sentencing court. The court retains discretion to approve or deny.",
        eligibilityNote: "Eligible for prisoners whose offense involved alcohol or controlled substance use; serious violent offenders may be excluded.",
      },
      {
        option: "Challenge Incarceration Program (CIP)",
        body: "Wisconsin Department of Corrections",
        description: "CIP is an intensive boot camp-style program combining physical training, substance abuse education, and life skills. Successful completion may result in early release. Participants must be nominated by the sentencing judge or parole board and meet eligibility criteria. The program is typically 6 months.",
        eligibilityNote: "Eligibility determined by sentencing court nomination and DOC screening; excludes certain violent and sex offenders.",
      },
      {
        option: "Wisconsin Risk Reduction Program (WRRP)",
        body: "Wisconsin Department of Corrections",
        description: "WRRP offers cognitive-behavioral programs, vocational training, and educational programming to reduce recidivism risk. Completion of WRRP may positively influence parole decisions, earned release eligibility, and reduce assigned risk scores. Participation is voluntary but documented in institutional records reviewed by the PRC.",
        eligibilityNote: "Available to most incarcerated individuals; participation documented in institutional file used for earned release and parole reviews.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Wisconsin ladder steps (WI Circuit Court → WI Court of Appeals → WI Supreme Court → U.S. District Court (E.D./W.D. Wis.) → 7th Circuit → SCOTUS). If the jurisdiction or findings suggest certain steps have been completed (e.g., direct appeal was taken), mark them Completed. If the next logical step is available, mark it Available. Steps that cannot be reached yet are Pending. Steps that are blocked due to procedural default or other bars are Blocked.",
    executivePromptInstructions: "Always include the three Wisconsin executive options: (a) Governor's Pardon via WI Pardon Advisory Board, (b) Sentence Commutation via Governor, (c) WI Parole Commission (for pre-1999 convictions only). Describe each accurately.",
    administrativePromptInstructions: "Always include the three Wisconsin administrative options: (a) Program Review Committee Earned Release, (b) Challenge Incarceration Program (CIP), (c) Wisconsin Risk Reduction Program (WRRP). Describe each accurately.",
  },

  IL: {
    name: "Illinois",
    circuit: "7th Circuit",
    ladder: [
      { step: 1, court: "IL Circuit Court", description: "Trial court — post-conviction petition under 725 ILCS 5/122-1 et seq. (Post-Conviction Hearing Act), or motion for new trial" },
      { step: 2, court: "IL Appellate Court", description: "Intermediate appellate court — direct appeal or appeal from post-conviction denial" },
      { step: 3, court: "IL Supreme Court", description: "Discretionary review — petition for leave to appeal (PLA)" },
      { step: 4, court: "U.S. District Court (N.D./C.D./S.D. Ill.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Illinois state remedies" },
      { step: 5, court: "7th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon",
        body: "Illinois Prisoner Review Board / Governor of Illinois",
        description: "An Illinois pardon forgives the offense and may restore civil rights. Applicants file with the Illinois Prisoner Review Board, which conducts a public hearing and forwards a recommendation to the Governor. The Governor has sole discretion to grant or deny. A 'pardon with innocence' finding removes conviction records from public view.",
        eligibilityNote: "No mandatory waiting period; Board considers rehabilitation, circumstances of offense, and post-release conduct. Typically sought after release.",
      },
      {
        option: "Sentence Commutation",
        body: "Governor of Illinois / Illinois Prisoner Review Board",
        description: "Commutation reduces an active sentence without removing the underlying conviction. The Illinois Prisoner Review Board reviews commutation petitions and forwards recommendations to the Governor. Applications typically require demonstration of extraordinary rehabilitation, terminal illness, or a compelling manifest-injustice claim.",
        eligibilityNote: "May be sought while incarcerated; Governor has broad discretion; Board recommendation is advisory only.",
      },
      {
        option: "Illinois Court of Claims — Wrongful Conviction",
        body: "Illinois Court of Claims",
        description: "Illinois law (735 ILCS 5/2-702) allows a person who was wrongfully convicted and imprisoned to seek a certificate of innocence from the circuit court and then file for compensation in the Court of Claims. A successful claim may yield up to $199,150 (or more in some cases) plus attorney fees and may restore certain civil rights.",
        eligibilityNote: "Requires proving actual innocence by a preponderance of the evidence; not available for those who contributed to wrongful conviction by false confession or perjury.",
      },
    ],
    administrativeOptions: [
      {
        option: "Illinois Meritorious Good Time (MGT) Credit",
        body: "Illinois Department of Corrections",
        description: "The Illinois DOC may award Meritorious Good Time credits to incarcerated individuals who participate in programming, education, or vocational training. MGT credit can reduce the mandatory supervised release (MSR) date. Eligibility and credit amounts are determined by facility staff and DOC policy.",
        eligibilityNote: "Excludes certain Class X and violent felons; credits are administrative and subject to DOC discretion.",
      },
      {
        option: "Electronic Detention / Electronic Home Monitoring",
        body: "Illinois Department of Corrections / Sentencing Court",
        description: "Illinois allows certain offenders to serve the final portion of their sentence on electronic monitoring (EM) or electronic home detention. The IDOC may initiate a petition to the sentencing court or the court may impose EM as part of the original sentence. EM is particularly available for non-violent offenders within the last year of their sentence.",
        eligibilityNote: "Excludes sex offenders, certain violent felons, and those with EM violations; sentencing court must approve.",
      },
      {
        option: "Work Release / Day Release (Minimum Security)",
        body: "Illinois Department of Corrections",
        description: "Illinois DOC minimum-security facilities may place eligible incarcerated individuals on work release or day release programs, allowing them to leave the facility for employment while serving their sentence. Successful participation builds a record of rehabilitation and may accelerate consideration for supervised release.",
        eligibilityNote: "Requires placement at minimum-security facility, satisfactory institutional conduct, and IDOC approval; not available to all offense types.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Illinois ladder steps (IL Circuit Court → IL Appellate Court → IL Supreme Court → U.S. District Court (N.D./C.D./S.D. Ill.) → 7th Circuit → SCOTUS). Illinois post-conviction petitions are governed by the Post-Conviction Hearing Act (725 ILCS 5/122-1 et seq.). Mark steps Completed if the findings or record show prior proceedings. Mark the next available step Available. Pending steps cannot be reached yet. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include three Illinois executive options: (a) Governor's Pardon via the Illinois Prisoner Review Board, (b) Sentence Commutation via the Illinois Prisoner Review Board and Governor, (c) Illinois Court of Claims wrongful conviction compensation under 735 ILCS 5/2-702. Describe each accurately for Illinois.",
    administrativePromptInstructions: "Include three Illinois administrative options: (a) Meritorious Good Time (MGT) credit from IDOC, (b) Electronic Home Monitoring / Electronic Detention, (c) Work Release / Day Release program. Describe each accurately for Illinois.",
  },

  MN: {
    name: "Minnesota",
    circuit: "8th Circuit",
    ladder: [
      { step: 1, court: "MN District Court", description: "Trial court — post-conviction petition under Minn. Stat. § 590.01 et seq. (Post-Conviction Relief Act)" },
      { step: 2, court: "MN Court of Appeals", description: "Intermediate appellate court — direct appeal or post-conviction appeal" },
      { step: 3, court: "MN Supreme Court", description: "Discretionary review — petition for further review" },
      { step: 4, court: "U.S. District Court (D. Minn.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Minnesota state remedies" },
      { step: 5, court: "8th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon / Board of Pardons",
        body: "Minnesota Board of Pardons",
        description: "Minnesota's Board of Pardons consists of the Governor, the Attorney General, and the Chief Justice of the Supreme Court. Applications are filed with the Board's executive director. The Board may grant a full pardon, pardon extraordinary (which seals the conviction), or a pardon that restores specific civil rights. Hearings are public and applicants may appear in person.",
        eligibilityNote: "Must be discharged from sentence, including supervision, for the required waiting period (varies by offense); serious violent offenders face heightened scrutiny.",
      },
      {
        option: "Sentence Commutation",
        body: "Minnesota Board of Pardons",
        description: "The Minnesota Board of Pardons has authority to commute sentences, including reducing a life sentence to a term of years, making an individual eligible for supervised release. Commutation petitions must demonstrate compelling rehabilitation, manifest injustice, or changed circumstances. The Board reviews all three-member approval is required.",
        eligibilityNote: "May be sought while incarcerated; unanimous vote of all three Board members required to grant commutation.",
      },
    ],
    administrativeOptions: [
      {
        option: "Supervised Release (Parole)",
        body: "Minnesota Department of Corrections — Supervised Release Unit",
        description: "Minnesota operates a supervised release system (replacing traditional parole) where most prisoners are released to community supervision after serving a portion of their sentence. The Commissioner of Corrections and the Risk Assessment Unit determine the supervised release date based on offense, institutional behavior, programming completion, and risk scores.",
        eligibilityNote: "Supervised release is automatic for most offenders at the statutory release date; revocation and extension are possible for serious violations.",
      },
      {
        option: "Challenge Incarceration Program (CIP)",
        body: "Minnesota Department of Corrections",
        description: "Minnesota's CIP (boot camp program) provides intensive 6-month programming including physical fitness, cognitive behavioral therapy, and substance abuse treatment. Successful completion results in early release to supervised release. Participants must be nominated by the facility and approved by the Commissioner of Corrections.",
        eligibilityNote: "Not available to sex offenders or certain violent offenders; DOC nomination required; must meet risk and programming criteria.",
      },
      {
        option: "Work Release / Transitional Release",
        body: "Minnesota Department of Corrections",
        description: "Eligible incarcerated individuals may be placed on work release or at a transitional facility for the final portion of their sentence. Work release allows employment in the community while residing at a correctional facility or halfway house. Transitional release programs support reentry and reduce recidivism.",
        eligibilityNote: "Available to offenders nearing their supervised release date; excludes certain offense types; DOC approval required based on institutional conduct and risk assessment.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Minnesota ladder steps (MN District Court → MN Court of Appeals → MN Supreme Court → U.S. District Court (D. Minn.) → 8th Circuit Court of Appeals → SCOTUS). Minnesota post-conviction petitions are governed by the Post-Conviction Relief Act (Minn. Stat. § 590.01). Mark steps Completed if prior proceedings are evident. Mark the next available step Available. Pending steps cannot yet be reached. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include two Minnesota executive options: (a) Governor's Pardon and Pardon Extraordinary via the Minnesota Board of Pardons (Governor + AG + Chief Justice), (b) Sentence Commutation via the Board of Pardons (unanimous vote required). Describe each accurately for Minnesota.",
    administrativePromptInstructions: "Include three Minnesota administrative options: (a) Supervised Release (parole equivalent) from MN DOC, (b) Challenge Incarceration Program (CIP boot camp), (c) Work Release / Transitional Release. Describe each accurately for Minnesota.",
  },
};

const SUPPORTED_STATES = Object.keys(STATE_DATA) as SupportedState[];

function detectJurisdiction(jurisdiction: string | null): SupportedState | null {
  if (!jurisdiction) return null;
  const lower = jurisdiction.toLowerCase().trim();

  if (
    lower.includes("wisconsin") ||
    lower === "wi" || lower === "wis" || lower === "wis." ||
    lower.startsWith("wi ") || lower.startsWith("wis ") || lower.startsWith("wis.") ||
    lower.includes(", wi") || lower.includes(" wi,") ||
    lower.includes("(wi)") || lower.includes("(wis)")
  ) return "WI";

  if (
    lower.includes("illinois") ||
    lower === "il" || lower === "ill" || lower === "ill." ||
    lower.startsWith("il ") || lower.startsWith("ill ") ||
    lower.includes(", il") || lower.includes(" il,") ||
    lower.includes("(il)") || lower.includes("(ill)") ||
    lower.includes("cook county") || lower.includes("chicago")
  ) return "IL";

  if (
    lower.includes("minnesota") ||
    lower === "mn" ||
    lower.startsWith("mn ") || lower.includes(", mn") || lower.includes(" mn,") ||
    lower.includes("(mn)") ||
    lower.includes("minneapolis") || lower.includes("st. paul") || lower.includes("saint paul")
  ) return "MN";

  return null;
}

function sanitizeLadderStatus(status: string | undefined): "Completed" | "Pending" | "Available" | "Blocked" {
  if (status === "Completed" || status === "Pending" || status === "Available" || status === "Blocked") {
    return status;
  }
  return "Pending";
}

function calculateAedpaDeadline(caseCreatedAt: Date): { deadline: string; isEstimate: boolean } {
  const convictionFinalDate = new Date(caseCreatedAt);
  convictionFinalDate.setDate(convictionFinalDate.getDate() + 20);
  const deadline = new Date(convictionFinalDate);
  deadline.setDate(deadline.getDate() + 365);
  return {
    deadline: deadline.toISOString().split("T")[0],
    isEstimate: true,
  };
}

function buildReliefPrompt(params: {
  caseTitle: string;
  jurisdiction: string | null;
  caseNumber: string | null;
  state: SupportedState;
  findings: {
    issueTitle: string;
    legalAnalysis: string;
    proceduralStatus: string | null;
  }[];
}): string {
  const sd = STATE_DATA[params.state];
  const findingsText = params.findings
    .map(
      (f, i) =>
        `FINDING ${i + 1}: ${f.issueTitle}\nLegal Analysis: ${f.legalAnalysis.slice(0, 600)}\nProcedural Status: ${f.proceduralStatus ?? "Unknown"}`,
    )
    .join("\n\n");

  return `You are a senior post-conviction appellate analyst. Analyze this ${sd.name} criminal case for post-conviction relief pathways.

CASE: ${params.caseTitle}
JURISDICTION: ${params.jurisdiction ?? `${sd.name} (assumed)`}
STATE: ${sd.name} (${sd.circuit})
CASE NUMBER: ${params.caseNumber ?? "Unknown"}

FINDINGS FROM RECORD:
${findingsText || "No findings extracted yet."}

TASK: Analyze the case and return a single JSON object with EXACTLY these keys:

{
  "ladderStatus": [
    {
      "step": <integer 1-6>,
      "court": "<court name>",
      "status": "Completed | Pending | Available | Blocked",
      "notes": "<1-2 sentence note on status or what is needed at this step, or null>"
    }
  ],
  "federalReadyClaims": [
    {
      "issueTitle": "<title of the finding>",
      "amendment": "<5th | 6th | 14th | Other>",
      "readyReason": "<one sentence explaining why this claim is federal-ready>"
    }
  ],
  "martinezApplies": <true | false>,
  "martinezReason": "<1-2 sentences explaining why Martinez v. Ryan (2012) does or does not apply to this case>",
  "executiveOptions": [
    {
      "option": "<option name>",
      "body": "<the body or official that handles this>",
      "description": "<2-3 sentences on the process, eligibility, and how to apply>",
      "eligibilityNote": "<any specific eligibility requirement or restriction>"
    }
  ],
  "administrativeOptions": [
    {
      "option": "<option name>",
      "body": "<administering body>",
      "description": "<2-3 sentences on what this is, eligibility criteria, and how to apply>",
      "eligibilityNote": "<any specific eligibility requirement or restriction>"
    }
  ]
}

INSTRUCTIONS:
1. For ladderStatus: ${sd.ladderPromptInstructions}
2. For federalReadyClaims: Only include findings that (a) explicitly mention or implicate the 5th, 6th, or 14th Amendment in the legal analysis AND (b) have proceduralStatus = "Preserved". If no findings meet this standard, return an empty array.
3. For martinezApplies: Martinez v. Ryan (2012) allows cause to excuse procedural default of IAC claims where post-conviction counsel was also ineffective. This applies if there are IAC claims that were defaulted AND post-conviction counsel likely failed to raise them. If no IAC-type claims exist, return false.
4. For executiveOptions: ${sd.executivePromptInstructions}
5. For administrativeOptions: ${sd.administrativePromptInstructions}

Return ONLY valid JSON. No commentary. No markdown fences. Begin with { and end with }.`;
}

async function generateAndPersistPathway(
  caseId: number,
  existingCase: { title: string; jurisdiction: string | null; caseNumber: string | null; createdAt: Date },
  state: SupportedState,
  preserveTolled?: boolean,
): Promise<{ pathway: Record<string, unknown>; martinezReason: string | null; isEstimate: boolean } | { error: string }> {
  const sd = STATE_DATA[state];

  const findings = await db
    .select({
      issueTitle: findingsTable.issueTitle,
      legalAnalysis: findingsTable.legalAnalysis,
      proceduralStatus: findingsTable.proceduralStatus,
    })
    .from(findingsTable)
    .where(eq(findingsTable.caseId, caseId));

  const { deadline, isEstimate } = calculateAedpaDeadline(existingCase.createdAt);

  const prompt = buildReliefPrompt({
    caseTitle: existingCase.title,
    jurisdiction: existingCase.jurisdiction,
    caseNumber: existingCase.caseNumber,
    state,
    findings,
  });

  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content[0]?.type === "text" ? message.content[0].text : "{}";
  let cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
    cleaned = cleaned.slice(objStart, objEnd + 1);
  }

  let parsed: {
    ladderStatus?: unknown[];
    federalReadyClaims?: unknown[];
    martinezApplies?: boolean;
    martinezReason?: string;
    executiveOptions?: unknown[];
    administrativeOptions?: unknown[];
  };

  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    logger.error({ parseErr, caseId, state }, "Failed to parse relief pathway response");
    return { error: "Failed to parse AI response. Please try again." };
  }

  const ladderWithDefaults = sd.ladder.map((rung) => {
    const ai = (parsed.ladderStatus ?? []).find(
      (s: unknown) => (s as { step?: number }).step === rung.step,
    ) as { status?: string; notes?: string } | undefined;
    return {
      step: rung.step,
      court: rung.court,
      description: rung.description,
      status: sanitizeLadderStatus(ai?.status),
      completedAt: null as string | null,
      notes: ai?.notes ?? null,
    };
  });

  const rawFederalClaims = Array.isArray(parsed.federalReadyClaims) ? parsed.federalReadyClaims : [];
  const preservedTitles = new Set(
    findings
      .filter((f) => typeof f.proceduralStatus === "string" && f.proceduralStatus.toLowerCase().includes("preserved"))
      .map((f) => f.issueTitle?.toLowerCase().trim()),
  );

  const CONSTITUTIONAL_AMENDMENTS = ["5th", "6th", "14th", "fifth", "sixth", "fourteenth"];
  const federalReadyClaims = rawFederalClaims.filter((claim: unknown) => {
    const c = claim as { amendment?: string; issueTitle?: string };
    const amendmentText = (c.amendment ?? "").toLowerCase();
    const hasValidAmendment = CONSTITUTIONAL_AMENDMENTS.some((a) => amendmentText.includes(a));
    const titleLower = (c.issueTitle ?? "").toLowerCase().trim();
    const isPreserved = preservedTitles.has(titleLower);
    return hasValidAmendment && isPreserved;
  });

  const executiveOptions = Array.isArray(parsed.executiveOptions) && parsed.executiveOptions.length > 0
    ? parsed.executiveOptions
    : sd.executiveOptions;

  const administrativeOptions = Array.isArray(parsed.administrativeOptions) && parsed.administrativeOptions.length > 0
    ? parsed.administrativeOptions
    : sd.administrativeOptions;

  const martinezReason = parsed.martinezReason ?? null;
  const tolledValue = preserveTolled ?? false;

  const [created] = await db
    .insert(reliefPathwaysTable)
    .values({
      caseId,
      jurisdiction: existingCase.jurisdiction ?? sd.name,
      ladderStatus: ladderWithDefaults as object,
      aedpaDeadline: deadline,
      aedpaTolled: tolledValue,
      aedpaIsEstimate: isEstimate,
      federalReadyClaims: federalReadyClaims as object,
      martinezApplies: parsed.martinezApplies ?? false,
      martinezReason,
      executiveOptions: executiveOptions as object,
      administrativeOptions: administrativeOptions as object,
    })
    .onConflictDoUpdate({
      target: reliefPathwaysTable.caseId,
      set: {
        jurisdiction: existingCase.jurisdiction ?? sd.name,
        ladderStatus: ladderWithDefaults as object,
        aedpaDeadline: deadline,
        aedpaTolled: tolledValue,
        aedpaIsEstimate: isEstimate,
        federalReadyClaims: federalReadyClaims as object,
        martinezApplies: parsed.martinezApplies ?? false,
        martinezReason,
        executiveOptions: executiveOptions as object,
        administrativeOptions: administrativeOptions as object,
        updatedAt: new Date(),
      },
    })
    .returning();

  return { pathway: created as unknown as Record<string, unknown>, martinezReason, isEstimate };
}

function unsupportedJurisdictionResponse(jurisdiction: string | null) {
  return {
    error: "Unsupported jurisdiction",
    message: `Relief Pathway Engine currently supports Wisconsin (WI), Illinois (IL), and Minnesota (MN). Detected jurisdiction: "${jurisdiction ?? "unknown"}". Additional states are planned for future releases.`,
    supportedStates: SUPPORTED_STATES,
  };
}

router.get("/cases/:caseId/relief-pathway", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const [existingCase] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.id, caseId));

  if (!existingCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const state = detectJurisdiction(existingCase.jurisdiction);
  if (!state) {
    res.status(422).json(unsupportedJurisdictionResponse(existingCase.jurisdiction));
    return;
  }

  const [existing] = await db
    .select()
    .from(reliefPathwaysTable)
    .where(eq(reliefPathwaysTable.caseId, caseId));

  if (existing) {
    res.json({ ...existing, aedpaIsEstimate: existing.aedpaIsEstimate ?? true, martinezReason: existing.martinezReason ?? null, detectedState: state });
    return;
  }

  try {
    const result = await generateAndPersistPathway(caseId, existingCase, state);
    if ("error" in result) {
      res.status(500).json({ error: result.error });
      return;
    }
    res.json({ ...result.pathway, aedpaIsEstimate: result.isEstimate, martinezReason: result.martinezReason, detectedState: state });
  } catch (err) {
    logger.error({ err, caseId, state }, "Relief pathway generation failed");
    const status = (err as { status?: number })?.status;
    let message = "Failed to generate relief pathway. Please try again.";
    if (status === 429) message = "Rate limit reached. Please wait a moment and try again.";
    else if (status === 401) message = "API key is invalid or missing.";
    res.status(500).json({ error: message });
  }
});

router.post("/cases/:caseId/relief-pathway/regenerate", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const [existingCase] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.id, caseId));

  if (!existingCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const state = detectJurisdiction(existingCase.jurisdiction);
  if (!state) {
    res.status(422).json(unsupportedJurisdictionResponse(existingCase.jurisdiction));
    return;
  }

  const [existing] = await db
    .select({ aedpaTolled: reliefPathwaysTable.aedpaTolled })
    .from(reliefPathwaysTable)
    .where(eq(reliefPathwaysTable.caseId, caseId));

  try {
    const result = await generateAndPersistPathway(caseId, existingCase, state, existing?.aedpaTolled ?? false);
    if ("error" in result) {
      res.status(500).json({ error: result.error });
      return;
    }
    res.json({ ...result.pathway, aedpaIsEstimate: result.isEstimate, martinezReason: result.martinezReason, detectedState: state });
  } catch (err) {
    logger.error({ err, caseId, state }, "Relief pathway regeneration failed");
    res.status(500).json({ error: "Failed to regenerate relief pathway. Please try again." });
  }
});

router.put("/cases/:caseId/relief-pathway", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const parsed = putBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
    return;
  }

  const [[existingCase], [existing]] = await Promise.all([
    db.select({ jurisdiction: casesTable.jurisdiction }).from(casesTable).where(eq(casesTable.id, caseId)),
    db.select().from(reliefPathwaysTable).where(eq(reliefPathwaysTable.caseId, caseId)),
  ]);

  if (!existing) {
    res.status(404).json({ error: "No relief pathway found for this case" });
    return;
  }

  const detectedState = detectJurisdiction(existingCase?.jurisdiction ?? null);

  const { stepUpdates, aedpaDeadline, aedpaTolled } = parsed.data;
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (stepUpdates !== undefined && stepUpdates.length > 0) {
    const currentLadder = (existing.ladderStatus ?? []) as {
      step: number;
      court: string;
      description: string;
      status: string;
      completedAt: string | null;
      notes: string | null;
    }[];

    const mergedLadder = currentLadder.map((rung) => {
      const patch = stepUpdates.find((u) => u.step === rung.step);
      if (!patch) return rung;
      return {
        ...rung,
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.completedAt !== undefined ? { completedAt: patch.completedAt } : {}),
        ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      };
    });
    updateData.ladderStatus = mergedLadder;
  }

  if (aedpaDeadline !== undefined) {
    updateData.aedpaDeadline = aedpaDeadline;
    updateData.aedpaIsEstimate = false;
  }
  if (aedpaTolled !== undefined) updateData.aedpaTolled = aedpaTolled;

  const [updated] = await db
    .update(reliefPathwaysTable)
    .set(updateData)
    .where(eq(reliefPathwaysTable.caseId, caseId))
    .returning();

  res.json({ ...updated, detectedState });
});

export default router;
