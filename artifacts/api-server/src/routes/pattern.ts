import { Router, type Response } from "express";
import { db, documentsTable, findingsTable, patternAnalysesTable, casesTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { anthropic } from "../lib/anthropic";
import { logger } from "../lib/logger";

const router = Router({ mergeParams: true });

function sendSse(res: Response, event: unknown) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

function buildPatternPrompt(params: {
  documents: { title: string; documentType: string; content: string }[];
  findings: { issueTitle: string; transcriptExcerpt: string; categoryId: number | null; proceduralStatus: string | null }[];
}): string {
  const docsText = params.documents
    .map((d, i) =>
      `DOCUMENT ${i + 1} [${d.documentType.toUpperCase()}]: "${d.title}"\n${d.content.slice(0, 4000)}`
    )
    .join("\n\n---\n\n");

  const findingsText = params.findings
    .map((f, i) =>
      `FINDING ${i + 1}: ${f.issueTitle}\nExcerpt: "${f.transcriptExcerpt.slice(0, 200)}"\nCategory: ${f.categoryId ?? "none"} | Status: ${f.proceduralStatus ?? "unknown"}`
    )
    .join("\n\n");

  return `You are a senior post-conviction appellate analyst performing a full pattern recognition analysis on a criminal case record.

This is for a criminal post-conviction case. The narrative must be written as if explaining to a federal judge why voluntary consent to a plea was structurally impossible.

ALL CASE DOCUMENTS (in chronological order):
${docsText}

ALL EXTRACTED FINDINGS:
${findingsText}

TASK: Analyze all documents and findings together as a single integrated record. Identify the sequence of events, pressure factors, identity inconsistencies, and critical decision points that reveal whether a voluntary plea was structurally possible.

Return a single JSON object with EXACTLY these 6 keys:

{
  "timeline": [
    {
      "date": "YYYY-MM-DD or descriptive date string",
      "event": "What happened",
      "who": "Parties involved",
      "decision": "Any decision made at this hearing/event",
      "deferred": "What was deferred or left unresolved (null if nothing)"
    }
  ],
  "identityFlags": [
    {
      "field": "The field with discrepancy (e.g., case number, defendant name, date of birth)",
      "values": ["value1 from doc A", "value2 from doc B"],
      "documents": ["Document title 1", "Document title 2"],
      "severity": "HIGH | MEDIUM | LOW"
    }
  ],
  "decisionPoints": [
    {
      "date": "YYYY-MM-DD or descriptive date string",
      "pendingMotions": "What motions or issues were unresolved at this moment",
      "defendantPresent": true,
      "whatDefendantKnew": "What information the defendant had available at this moment",
      "choiceMade": "What decision was made and by whom"
    }
  ],
  "coercionTimeline": [
    {
      "date": "YYYY-MM-DD or descriptive date string",
      "factor": "Short label for this coercion factor",
      "cumulativeScore": <integer 0-100 running total at this point>,
      "description": "How this factor contributed to a coercive environment"
    }
  ],
  "coercionScore": <integer 0-100, final cumulative coercion index>,
  "narrativeSummary": "A full narrative in plain prose (5-10 paragraphs) explaining the sequence of events, how each pressure factor built on the last, why the defendant could not have made a truly voluntary choice, and what this means for post-conviction relief. Write this as if addressing a federal judge who is deciding whether to grant habeas relief. Cite specific dates, document names, and facts from the record."
}

Rules:
- timeline must be in strict chronological order
- coercionTimeline entries must be in chronological order with cumulativeScore strictly non-decreasing
- coercionScore must equal the final cumulativeScore value in the coercionTimeline array
- identityFlags must only list actual discrepancies found across the documents
- narrativeSummary must be substantive prose, not bullet points
- Return ONLY valid JSON. No commentary. No markdown fences. Begin with { and end with }.`;
}

router.post("/cases/:caseId/pattern-analysis", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const [existingCase] = await db
    .select({ id: casesTable.id })
    .from(casesTable)
    .where(eq(casesTable.id, caseId));

  if (!existingCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    await db
      .insert(patternAnalysesTable)
      .values({ caseId, status: "analyzing" })
      .onConflictDoUpdate({
        target: patternAnalysesTable.caseId,
        set: { status: "analyzing", updatedAt: new Date() },
      });

    sendSse(res, { type: "status", message: "Loading case documents..." });

    const documents = await db
      .select()
      .from(documentsTable)
      .where(and(eq(documentsTable.caseId, caseId), eq(documentsTable.status, "analyzed")))
      .orderBy(asc(documentsTable.createdAt), asc(documentsTable.id));

    if (documents.length === 0) {
      sendSse(res, { type: "error", message: "No analyzed documents found for this case. Analyze documents first." });
      await db
        .update(patternAnalysesTable)
        .set({ status: "error", updatedAt: new Date() })
        .where(eq(patternAnalysesTable.caseId, caseId));
      res.end();
      return;
    }

    sendSse(res, { type: "status", message: `Loaded ${documents.length} document${documents.length === 1 ? "" : "s"}. Loading findings...` });

    const findings = await db
      .select({
        issueTitle: findingsTable.issueTitle,
        transcriptExcerpt: findingsTable.transcriptExcerpt,
        categoryId: findingsTable.categoryId,
        proceduralStatus: findingsTable.proceduralStatus,
      })
      .from(findingsTable)
      .where(eq(findingsTable.caseId, caseId));

    sendSse(res, { type: "status", message: `Found ${findings.length} finding${findings.length === 1 ? "" : "s"}. Running pattern analysis with Claude...` });

    const prompt = buildPatternPrompt({ documents, findings });

    let rawText = "";
    let attempt = 0;
    const maxRetries = 3;

    while (attempt <= maxRetries) {
      try {
        const message = await anthropic.messages.create({
          model: "claude-opus-4-5",
          max_tokens: 8192,
          messages: [{ role: "user", content: prompt }],
        });
        rawText = message.content[0]?.type === "text" ? message.content[0].text : "{}";
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        const headers = (err as { headers?: Record<string, string> })?.headers;
        if (status === 429 && attempt < maxRetries) {
          const retryAfterRaw = headers?.["retry-after"];
          const waitSecs = retryAfterRaw && !isNaN(parseInt(retryAfterRaw, 10))
            ? parseInt(retryAfterRaw, 10)
            : 60;
          for (let s = waitSecs; s > 0; s -= 10) {
            sendSse(res, { type: "status", message: `Rate limit reached — retrying in ${s} second${s === 1 ? "" : "s"}…` });
            await new Promise((r) => setTimeout(r, Math.min(10, s) * 1000));
          }
          attempt++;
        } else {
          throw err;
        }
      }
    }

    sendSse(res, { type: "status", message: "Parsing analysis results..." });

    let cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
    const objStart = cleaned.indexOf("{");
    const objEnd = cleaned.lastIndexOf("}");
    if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
      cleaned = cleaned.slice(objStart, objEnd + 1);
    }

    let parsed: {
      timeline?: unknown[];
      identityFlags?: unknown[];
      decisionPoints?: unknown[];
      coercionTimeline?: unknown[];
      coercionScore?: number;
      narrativeSummary?: string;
    };

    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      logger.error({ parseErr, caseId, rawSnippet: rawText.slice(0, 300) }, "Failed to parse pattern analysis response");
      sendSse(res, { type: "error", message: "Failed to parse AI response. Please try again." });
      await db
        .update(patternAnalysesTable)
        .set({ status: "error", updatedAt: new Date() })
        .where(eq(patternAnalysesTable.caseId, caseId));
      res.end();
      return;
    }

    await db
      .update(patternAnalysesTable)
      .set({
        timeline: (parsed.timeline ?? []) as object,
        identityFlags: (parsed.identityFlags ?? []) as object,
        decisionPoints: (parsed.decisionPoints ?? []) as object,
        coercionTimeline: (parsed.coercionTimeline ?? []) as object,
        coercionScore: typeof parsed.coercionScore === "number" ? parsed.coercionScore : null,
        narrativeSummary: typeof parsed.narrativeSummary === "string" ? parsed.narrativeSummary : null,
        status: "complete",
        updatedAt: new Date(),
      })
      .where(eq(patternAnalysesTable.caseId, caseId));

    sendSse(res, { type: "done" });
    res.end();
  } catch (err) {
    logger.error({ err, caseId }, "Pattern analysis failed");
    const status = (err as { status?: number })?.status;
    let userMessage: string;
    if (status === 429) {
      userMessage = "Rate limit reached after multiple retries. Please wait a minute and try again.";
    } else if (status === 401) {
      userMessage = "API key is invalid or missing. Contact the administrator.";
    } else if (status && status >= 500) {
      userMessage = "The AI service is temporarily unavailable. Please try again shortly.";
    } else if (err instanceof Error && err.message && !err.message.startsWith("{")) {
      userMessage = err.message;
    } else {
      userMessage = "Pattern analysis failed. Please try again.";
    }
    sendSse(res, { type: "error", message: userMessage });
    try {
      await db
        .update(patternAnalysesTable)
        .set({ status: "error", updatedAt: new Date() })
        .where(eq(patternAnalysesTable.caseId, caseId));
    } catch { /* non-fatal */ }
    res.end();
  }
});

router.get("/cases/:caseId/pattern-analysis", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const [row] = await db
    .select()
    .from(patternAnalysesTable)
    .where(eq(patternAnalysesTable.caseId, caseId));

  if (!row) {
    res.status(404).json({ error: "No pattern analysis found for this case" });
    return;
  }

  res.json(row);
});

export default router;
