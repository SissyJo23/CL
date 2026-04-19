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

const WI_EXECUTIVE_OPTIONS_FALLBACK = [
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
];

const WI_ADMIN_OPTIONS_FALLBACK = [
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
];

const WI_LADDER = [
  { step: 1, court: "WI Circuit Court", description: "Trial court — direct post-conviction motion, plea withdrawal, or new trial motion" },
  { step: 2, court: "WI Court of Appeals", description: "Intermediate appellate court — direct appeal or § 974.06 appeal" },
  { step: 3, court: "WI Supreme Court", description: "Discretionary review — petition for review (PDR)" },
  { step: 4, court: "U.S. District Court (E.D. or W.D. Wis.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires exhaustion of state remedies" },
  { step: 5, court: "7th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
  { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
];

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

function isWisconsinJurisdiction(jurisdiction: string | null): boolean {
  if (!jurisdiction) return false;
  const lower = jurisdiction.toLowerCase().trim();
  return (
    lower.includes("wisconsin") ||
    lower === "wi" ||
    lower === "wis" ||
    lower === "wis." ||
    lower.startsWith("wi ") ||
    lower.startsWith("wis ") ||
    lower.startsWith("wis.") ||
    lower.includes(", wi") ||
    lower.includes(" wi,") ||
    lower.includes("(wi)") ||
    lower.includes("(wis)")
  );
}

function sanitizeLadderStatus(status: string | undefined): "Completed" | "Pending" | "Available" | "Blocked" {
  if (status === "Completed" || status === "Pending" || status === "Available" || status === "Blocked") {
    return status;
  }
  return "Pending";
}

function buildReliefPrompt(params: {
  caseTitle: string;
  jurisdiction: string | null;
  caseNumber: string | null;
  findings: {
    issueTitle: string;
    legalAnalysis: string;
    proceduralStatus: string | null;
  }[];
}): string {
  const findingsText = params.findings
    .map(
      (f, i) =>
        `FINDING ${i + 1}: ${f.issueTitle}\nLegal Analysis: ${f.legalAnalysis.slice(0, 600)}\nProcedural Status: ${f.proceduralStatus ?? "Unknown"}`,
    )
    .join("\n\n");

  return `You are a senior post-conviction appellate analyst. Analyze this Wisconsin criminal case for post-conviction relief pathways.

CASE: ${params.caseTitle}
JURISDICTION: ${params.jurisdiction ?? "Wisconsin (assumed)"}
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
1. For ladderStatus: Assess each of the 6 Wisconsin ladder steps. If the jurisdiction or findings suggest certain steps have been completed (e.g., direct appeal was taken), mark them Completed. If the next logical step is available, mark it Available. Steps that cannot be reached yet are Pending. Steps that are blocked due to procedural default or other bars are Blocked.
2. For federalReadyClaims: Only include findings that (a) explicitly mention or implicate the 5th, 6th, or 14th Amendment in the legal analysis AND (b) have proceduralStatus = "Preserved". If no findings meet this standard, return an empty array.
3. For martinezApplies: Martinez v. Ryan (2012) allows cause to excuse procedural default of IAC claims where post-conviction counsel was also ineffective. This applies if there are IAC claims that were defaulted AND post-conviction counsel likely failed to raise them. If no IAC-type claims exist, return false.
4. For executiveOptions: Always include the three Wisconsin executive options: (a) Governor's Pardon via WI Pardons Advisory Board, (b) Sentence Commutation, (c) WI Parole Commission (for pre-1999 convictions only). Describe each accurately.
5. For administrativeOptions: Always include the three Wisconsin administrative options: (a) Program Review Committee Earned Release, (b) Challenge Incarceration Program (CIP), (c) Wisconsin Risk Reduction Program (WRRP). Describe each accurately.

Return ONLY valid JSON. No commentary. No markdown fences. Begin with { and end with }.`;
}

async function generateAndPersistPathway(
  caseId: number,
  existingCase: { title: string; jurisdiction: string | null; caseNumber: string | null; createdAt: Date },
  preserveTolled?: boolean,
): Promise<{ pathway: Record<string, unknown>; martinezReason: string | null; isEstimate: boolean } | { error: string }> {
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
    logger.error({ parseErr, caseId }, "Failed to parse relief pathway response");
    return { error: "Failed to parse AI response. Please try again." };
  }

  const ladderWithDefaults = WI_LADDER.map((rung) => {
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
    : WI_EXECUTIVE_OPTIONS_FALLBACK;

  const administrativeOptions = Array.isArray(parsed.administrativeOptions) && parsed.administrativeOptions.length > 0
    ? parsed.administrativeOptions
    : WI_ADMIN_OPTIONS_FALLBACK;

  const martinezReason = parsed.martinezReason ?? null;

  const tolledValue = preserveTolled ?? false;

  const [created] = await db
    .insert(reliefPathwaysTable)
    .values({
      caseId,
      jurisdiction: existingCase.jurisdiction ?? "Wisconsin",
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
        jurisdiction: existingCase.jurisdiction ?? "Wisconsin",
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
    message: `Relief Pathway Engine currently supports Wisconsin cases only. Detected jurisdiction: "${jurisdiction ?? "unknown"}". Multi-state support is planned for a future release.`,
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

  if (!isWisconsinJurisdiction(existingCase.jurisdiction)) {
    res.status(422).json(unsupportedJurisdictionResponse(existingCase.jurisdiction));
    return;
  }

  const [existing] = await db
    .select()
    .from(reliefPathwaysTable)
    .where(eq(reliefPathwaysTable.caseId, caseId));

  if (existing) {
    res.json({ ...existing, aedpaIsEstimate: existing.aedpaIsEstimate ?? true, martinezReason: existing.martinezReason ?? null });
    return;
  }

  try {
    const result = await generateAndPersistPathway(caseId, existingCase);
    if ("error" in result) {
      res.status(500).json({ error: result.error });
      return;
    }
    res.json({ ...result.pathway, aedpaIsEstimate: result.isEstimate, martinezReason: result.martinezReason });
  } catch (err) {
    logger.error({ err, caseId }, "Relief pathway generation failed");
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

  if (!isWisconsinJurisdiction(existingCase.jurisdiction)) {
    res.status(422).json(unsupportedJurisdictionResponse(existingCase.jurisdiction));
    return;
  }

  const [existing] = await db
    .select({ aedpaTolled: reliefPathwaysTable.aedpaTolled })
    .from(reliefPathwaysTable)
    .where(eq(reliefPathwaysTable.caseId, caseId));

  try {
    const result = await generateAndPersistPathway(caseId, existingCase, existing?.aedpaTolled ?? false);
    if ("error" in result) {
      res.status(500).json({ error: result.error });
      return;
    }
    res.json({ ...result.pathway, aedpaIsEstimate: result.isEstimate, martinezReason: result.martinezReason });
  } catch (err) {
    logger.error({ err, caseId }, "Relief pathway regeneration failed");
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

  const [existing] = await db
    .select()
    .from(reliefPathwaysTable)
    .where(eq(reliefPathwaysTable.caseId, caseId));

  if (!existing) {
    res.status(404).json({ error: "No relief pathway found for this case" });
    return;
  }

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

  if (aedpaDeadline !== undefined) updateData.aedpaDeadline = aedpaDeadline;
  if (aedpaTolled !== undefined) updateData.aedpaTolled = aedpaTolled;

  const [updated] = await db
    .update(reliefPathwaysTable)
    .set(updateData)
    .where(eq(reliefPathwaysTable.caseId, caseId))
    .returning();

  res.json(updated);
});

export default router;
