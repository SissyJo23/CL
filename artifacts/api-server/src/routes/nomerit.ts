import { Router, type Response } from "express";
import { db, documentsTable, findingsTable, nomeritAnalysesTable, casesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { anthropic } from "../lib/anthropic";
import { logger } from "../lib/logger";

const router = Router({ mergeParams: true });

function sendSse(res: Response, event: unknown) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

async function callAnthropicWithRetry(
  params: Parameters<typeof anthropic.messages.create>[0],
  onStatus: (msg: string) => void,
  maxRetries = 3,
): Promise<Awaited<ReturnType<typeof anthropic.messages.create>>> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const headers = (err as { headers?: Record<string, string> })?.headers;
      if (status === 429 && attempt < maxRetries) {
        const retryAfterRaw = headers?.["retry-after"];
        const waitSecs = retryAfterRaw && !isNaN(parseInt(retryAfterRaw, 10))
          ? parseInt(retryAfterRaw, 10)
          : 60;
        for (let s = waitSecs; s > 0; s -= 10) {
          onStatus(`Rate limit reached — retrying in ${s} second${s === 1 ? "" : "s"}…`);
          await new Promise((r) => setTimeout(r, Math.min(10, s) * 1000));
        }
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

router.get("/cases/:caseId/documents/:id/nomerit-analysis", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const docId = Number(req.params.id);

  const [doc] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, docId), eq(documentsTable.caseId, caseId)));

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  const [analysis] = await db
    .select()
    .from(nomeritAnalysesTable)
    .where(eq(nomeritAnalysesTable.documentId, docId));

  if (!analysis) {
    res.status(404).json({ error: "No analysis found for this document" });
    return;
  }

  res.json(analysis);
});

router.post("/cases/:caseId/documents/:id/analyze-nomerit", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const docId = Number(req.params.id);

  const [doc] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, docId), eq(documentsTable.caseId, caseId)));

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  if (doc.documentType !== "no_merit_report") {
    res.status(400).json({ error: "Document is not a no-merit report" });
    return;
  }

  const caseFindings = await db
    .select()
    .from(findingsTable)
    .where(eq(findingsTable.caseId, caseId));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  await db
    .insert(nomeritAnalysesTable)
    .values({ documentId: docId, caseId, status: "analyzing" })
    .onConflictDoUpdate({
      target: nomeritAnalysesTable.documentId,
      set: { status: "analyzing", updatedAt: new Date() },
    });

  try {
    const findingsText = caseFindings.length > 0
      ? caseFindings
          .map((f, i) =>
            `FINDING ${i + 1}: ${f.issueTitle}\nExcerpt: "${(f.transcriptExcerpt ?? "").slice(0, 300)}"\nAnalysis: ${(f.legalAnalysis ?? "").slice(0, 400)}\nPrecedent: ${f.precedentName ?? "none"} ${f.precedentCitation ?? ""}`
          )
          .join("\n\n")
      : "No findings have been extracted from this case yet.";

    const phase1Prompt = `You are a post-conviction appellate analyst specializing in Ineffective Assistance of Appellate Counsel (IAAC) claims under Strickland v. Washington and Anders v. California / Smith v. Robbins (Wisconsin).

A no-merit report is a document filed by appellate counsel certifying they reviewed the entire record and found no arguable issue for appeal. If counsel missed an "arguable" issue — one a reasonable attorney could argue in good faith — that constitutes IAAC.

NO-MERIT REPORT CONTENT:
${doc.content.slice(0, 12000)}

CASE FINDINGS ALREADY EXTRACTED FROM THE RECORD:
${findingsText}

TASK:
Perform a gap analysis. Compare what counsel addressed in the no-merit report against the case findings above.

Return ONLY a valid JSON object with exactly these 3 keys:

{
  "claimsDismissed": [
    {
      "issueTitle": "Brief title of the issue counsel identified and dismissed",
      "counselReasoning": "Counsel's stated reason for dismissing this issue",
      "pageRef": "Page reference from the no-merit report, or null"
    }
  ],
  "missedFindings": [
    {
      "findingTitle": "Title of the case finding",
      "findingExcerpt": "Key excerpt from the finding",
      "whyMissed": "Why this finding does not appear to have been addressed by counsel in the no-merit report"
    }
  ],
  "arguableIssues": [
    {
      "issueTitle": "Title of the arguable issue",
      "findingBasis": "The case finding(s) this is based on",
      "arguableStandard": "Why a reasonable attorney could argue this issue in good faith (Anders standard: low bar — any colorable argument qualifies)",
      "estimatedStrength": "weak|moderate|strong"
    }
  ]
}

The "arguable" standard under Anders/Smith is LOW: an issue qualifies if any reasonable attorney could argue it without frivolity. Do not apply a merits filter — if there is a non-frivolous argument, include it.`;

    sendSse(res, { type: "status", message: "Phase 1: Extracting dismissed claims and identifying gaps..." });

    const phase1Response = await callAnthropicWithRetry(
      {
        model: "claude-opus-4-5",
        max_tokens: 8192,
        messages: [{ role: "user", content: phase1Prompt }],
      },
      (msg) => sendSse(res, { type: "status", message: msg }),
    );

    const phase1Raw = phase1Response.content[0]?.type === "text" ? phase1Response.content[0].text : "{}";

    type Phase1Result = {
      claimsDismissed: Array<{ issueTitle: string; counselReasoning: string; pageRef: string | null }>;
      missedFindings: Array<{ findingTitle: string; findingExcerpt: string; whyMissed: string }>;
      arguableIssues: Array<{ issueTitle: string; findingBasis: string; arguableStandard: string; estimatedStrength: string }>;
    };

    let phase1: Phase1Result = { claimsDismissed: [], missedFindings: [], arguableIssues: [] };

    try {
      let cleaned = phase1Raw.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
      const objStart = cleaned.indexOf("{");
      const objEnd = cleaned.lastIndexOf("}");
      if (objStart !== -1 && objEnd !== -1) cleaned = cleaned.slice(objStart, objEnd + 1);
      phase1 = JSON.parse(cleaned);
    } catch (err) {
      logger.error({ err, docId }, "Failed to parse Phase 1 no-merit response");
      sendSse(res, { type: "error", message: "Failed to parse gap analysis response. Please try again." });
      await db.update(nomeritAnalysesTable).set({ status: "error", updatedAt: new Date() }).where(eq(nomeritAnalysesTable.documentId, docId));
      res.end();
      return;
    }

    sendSse(res, { type: "status", message: `Found ${phase1.arguableIssues.length} arguable issue(s). Phase 2: Drafting IAAC arguments and motion...` });

    const arguableText = phase1.arguableIssues.length > 0
      ? phase1.arguableIssues
          .map((ai, i) =>
            `ARGUABLE ISSUE ${i + 1}: ${ai.issueTitle}\nBasis: ${ai.findingBasis}\nArgumentable Because: ${ai.arguableStandard}\nStrength: ${ai.estimatedStrength}`
          )
          .join("\n\n")
      : "No arguable issues were identified.";

    const phase2Prompt = `You are a post-conviction appellate attorney drafting an Ineffective Assistance of Appellate Counsel (IAAC) motion for a Wisconsin criminal case.

Wisconsin follows Smith v. Robbins, 528 U.S. 259 (2000) (not Anders v. California directly, though the arguable standard is equivalent). The IAAC claim must satisfy both prongs of Strickland v. Washington, 466 U.S. 668 (1984):
- Prong 1 (Deficient Performance): Counsel's failure to raise the issue was objectively unreasonable — below the standard of a reasonably competent appellate attorney
- Prong 2 (Prejudice): There is a reasonable probability that, but for counsel's deficiency, the outcome of the appeal would have been different

Additionally, under Martinez v. Ryan, 566 U.S. 1 (2012), ineffective assistance of post-conviction counsel can excuse procedural default of a substantial IAAC claim.

ARGUABLE ISSUES IDENTIFIED:
${arguableText}

CASE FINDINGS FROM THE RECORD:
${findingsText.slice(0, 6000)}

TASK:
1. For each arguable issue, generate a complete IAAC argument object.
2. Draft a full motion in Markdown format.

Return ONLY a valid JSON object with exactly these 2 keys:

{
  "iaacArguments": [
    {
      "issueTitle": "Title of the arguable issue",
      "counselFailure": "Specific description of what appellate counsel failed to do",
      "prong1": "Why counsel's failure was objectively unreasonable under Strickland prong 1 — cite specific record evidence and compare to what a competent attorney would have done",
      "prong2": "Why there is a reasonable probability the appeal would have succeeded — cite relevant legal standards and how the issue would have fared on appeal",
      "martinezApplicable": true or false,
      "martinezReason": "If martinezApplicable is true: explain why Martinez v. Ryan applies to excuse any procedural default of this IAAC claim. If false: null"
    }
  ],
  "draftMotionText": "Full draft motion in Markdown format. Include: case caption placeholder, statement of the case, standard of review under Strickland/Smith v. Robbins, argument section (one section per arguable issue with full IAAC analysis), Martinez v. Ryan section if applicable, and conclusion/prayer for relief. Use Wisconsin-specific procedural language. Cite record evidence from the findings. Write as if to be filed in a Wisconsin circuit court."
}`;

    const phase2Response = await callAnthropicWithRetry(
      {
        model: "claude-opus-4-5",
        max_tokens: 8192,
        messages: [{ role: "user", content: phase2Prompt }],
      },
      (msg) => sendSse(res, { type: "status", message: msg }),
    );

    const phase2Raw = phase2Response.content[0]?.type === "text" ? phase2Response.content[0].text : "{}";

    type Phase2Result = {
      iaacArguments: Array<{
        issueTitle: string;
        counselFailure: string;
        prong1: string;
        prong2: string;
        martinezApplicable: boolean;
        martinezReason: string | null;
      }>;
      draftMotionText: string;
    };

    let phase2: Phase2Result = { iaacArguments: [], draftMotionText: "" };

    try {
      let cleaned = phase2Raw.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
      const objStart = cleaned.indexOf("{");
      const objEnd = cleaned.lastIndexOf("}");
      if (objStart !== -1 && objEnd !== -1) cleaned = cleaned.slice(objStart, objEnd + 1);
      phase2 = JSON.parse(cleaned);
    } catch (err) {
      logger.error({ err, docId }, "Failed to parse Phase 2 no-merit response");
      sendSse(res, { type: "error", message: "Failed to parse motion drafting response. Please try again." });
      await db.update(nomeritAnalysesTable).set({ status: "error", updatedAt: new Date() }).where(eq(nomeritAnalysesTable.documentId, docId));
      res.end();
      return;
    }

    const martinezApplicable = phase2.iaacArguments.some((a) => a.martinezApplicable === true);

    await db
      .update(nomeritAnalysesTable)
      .set({
        claimsDismissed: phase1.claimsDismissed,
        missedFindings: phase1.missedFindings,
        arguableIssues: phase1.arguableIssues,
        iaacArguments: phase2.iaacArguments,
        martinezApplicable,
        draftMotionText: phase2.draftMotionText,
        status: "complete",
        updatedAt: new Date(),
      })
      .where(eq(nomeritAnalysesTable.documentId, docId));

    sendSse(res, { type: "done" });
    res.end();
  } catch (err) {
    logger.error({ err, docId }, "No-merit analysis failed");
    await db.update(nomeritAnalysesTable).set({ status: "error", updatedAt: new Date() }).where(eq(nomeritAnalysesTable.documentId, docId));
    sendSse(res, { type: "error", message: "Analysis failed. Please try again." });
    res.end();
  }
});

export default router;
