import { Router, type Response } from "express";
import { db } from "@workspace/db";
import {
  courtSessionsTable,
  courtRoundsTable,
} from "@workspace/db";
import { motionsTable } from "@workspace/db";
import { casesTable } from "@workspace/db";
import { findingsTable } from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import {
  anthropic,
  buildCourtSimulationPrompt,
  buildVerdictPrompt,
  buildMotionPrompt,
} from "../lib/anthropic";

const router = Router();

function sendSse(res: Response, event: unknown) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

router.get("/cases/:caseId/court-sessions", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const rows = await db
    .select()
    .from(courtSessionsTable)
    .where(eq(courtSessionsTable.caseId, caseId))
    .orderBy(asc(courtSessionsTable.createdAt));
  res.json(rows.map((r) => ({ ...r, documentIds: JSON.parse(r.documentIds) })));
});

router.post("/cases/:caseId/court-sessions", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const {
    simulationMode,
    skepticMode = false,
    expandedRecord = false,
    pleaQuestionnaireNotes,
    documentIds = [],
  } = req.body as {
    simulationMode: string;
    skepticMode?: boolean;
    expandedRecord?: boolean;
    pleaQuestionnaireNotes?: string | null;
    documentIds?: number[];
  };

  if (!simulationMode) {
    res.status(400).json({ error: "simulationMode is required" });
    return;
  }

  const [row] = await db
    .insert(courtSessionsTable)
    .values({
      caseId,
      simulationMode,
      skepticMode,
      expandedRecord,
      pleaQuestionnaireNotes: pleaQuestionnaireNotes ?? null,
      documentIds: JSON.stringify(documentIds),
    })
    .returning();

  res.status(201).json({ ...row, documentIds });
});

router.get("/cases/:caseId/court-sessions/:id", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);

  const [session] = await db
    .select()
    .from(courtSessionsTable)
    .where(and(eq(courtSessionsTable.id, id), eq(courtSessionsTable.caseId, caseId)));

  if (!session) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const rounds = await db
    .select()
    .from(courtRoundsTable)
    .where(eq(courtRoundsTable.sessionId, id))
    .orderBy(asc(courtRoundsTable.roundNumber));

  res.json({
    session: { ...session, documentIds: JSON.parse(session.documentIds) },
    rounds,
  });
});

router.post("/cases/:caseId/court-sessions/:id/run", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const sessionId = Number(req.params.id);

  const [session] = await db
    .select()
    .from(courtSessionsTable)
    .where(
      and(
        eq(courtSessionsTable.id, sessionId),
        eq(courtSessionsTable.caseId, caseId),
      ),
    );

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [caseRow] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.id, caseId));

  if (!caseRow) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const docIds: number[] = JSON.parse(session.documentIds);

  const allFindings = await db
    .select()
    .from(findingsTable)
    .where(eq(findingsTable.caseId, caseId));

  const relevantFindings = docIds.length > 0
    ? allFindings.filter((f) => docIds.includes(f.documentId))
    : allFindings;

  if (relevantFindings.length === 0) {
    res.status(400).json({
      error: "No findings found. Please analyze documents first.",
    });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  await db
    .update(courtSessionsTable)
    .set({ status: "running", updatedAt: new Date() })
    .where(eq(courtSessionsTable.id, sessionId));

  try {
    const NUM_ROUNDS = session.skepticMode ? 5 : 4;
    const priorRounds: {
      stateArgument: string;
      courtCommentary: string;
      defenseResponse: string;
    }[] = [];

    const findingsForPrompt = relevantFindings.slice(0, 15).map((f) => ({
      issueTitle: f.issueTitle,
      transcriptExcerpt: f.transcriptExcerpt,
      legalAnalysis: f.legalAnalysis,
      precedentName: f.precedentName,
      precedentCitation: f.precedentCitation,
      courtRuling: f.courtRuling,
    }));

    for (let roundNum = 1; roundNum <= NUM_ROUNDS; roundNum++) {
      const prompt = buildCourtSimulationPrompt({
        simulationMode: session.simulationMode,
        skepticMode: session.skepticMode,
        expandedRecord: session.expandedRecord,
        pleaQuestionnaireNotes: session.pleaQuestionnaireNotes,
        caseTitle: caseRow.title,
        findings: findingsForPrompt,
        roundNumber: roundNum,
        priorRounds,
      });

      const message = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      });

      const rawText =
        message.content[0]?.type === "text" ? message.content[0].text : "{}";
      let roundData: {
        stateStrength: string;
        defenseBurden: string;
        stateArgument: string;
        courtCommentary: string;
        defenseResponse: string;
      };

      try {
        const cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
        roundData = JSON.parse(cleaned);
      } catch {
        sendSse(res, {
          type: "error",
          message: `Failed to parse round ${roundNum} response`,
        });
        break;
      }

      const [insertedRound] = await db
        .insert(courtRoundsTable)
        .values({
          sessionId,
          roundNumber: roundNum,
          stateStrength: roundData.stateStrength ?? "MODERATE",
          defenseBurden: roundData.defenseBurden ?? "",
          stateArgument: roundData.stateArgument ?? "",
          courtCommentary: roundData.courtCommentary ?? "",
          defenseResponse: roundData.defenseResponse ?? "",
        })
        .returning();

      sendSse(res, { type: "round", data: insertedRound });
      priorRounds.push({
        stateArgument: roundData.stateArgument,
        courtCommentary: roundData.courtCommentary,
        defenseResponse: roundData.defenseResponse,
      });
    }

    const verdictPrompt = buildVerdictPrompt({
      simulationMode: session.simulationMode,
      caseTitle: caseRow.title,
      findings: findingsForPrompt,
      rounds: priorRounds,
    });

    const verdictMsg = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: verdictPrompt }],
    });

    const verdictRaw =
      verdictMsg.content[0]?.type === "text"
        ? verdictMsg.content[0].text
        : "{}";

    let verdictData: {
      verdictRating: string;
      verdictSummary: string;
      defenseWon: boolean;
    } = {
      verdictRating: "MIXED",
      verdictSummary: "",
      defenseWon: false,
    };

    try {
      const cleaned = verdictRaw.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
      verdictData = JSON.parse(cleaned);
    } catch {
      // Use defaults
    }

    await db
      .update(courtSessionsTable)
      .set({
        status: "completed",
        verdictRating: verdictData.verdictRating,
        verdictSummary: verdictData.verdictSummary,
        defenseWon: verdictData.defenseWon,
        totalRounds: priorRounds.length,
        updatedAt: new Date(),
      })
      .where(eq(courtSessionsTable.id, sessionId));

    sendSse(res, {
      type: "verdict",
      rating: verdictData.verdictRating,
      summary: verdictData.verdictSummary,
      defenseWon: verdictData.defenseWon,
    });

    if (verdictData.defenseWon) {
      const motionPrompt = buildMotionPrompt({
        caseTitle: caseRow.title,
        simulationMode: session.simulationMode,
        findings: relevantFindings.slice(0, 20).map((f) => ({
          issueTitle: f.issueTitle,
          transcriptExcerpt: f.transcriptExcerpt,
          legalAnalysis: f.legalAnalysis,
          precedentName: f.precedentName,
          precedentCitation: f.precedentCitation,
          precedentType: f.precedentType,
          courtRuling: f.courtRuling,
          materialSimilarity: f.materialSimilarity,
        })),
        verdictSummary: verdictData.verdictSummary,
      });

      const motionMsg = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 8192,
        messages: [{ role: "user", content: motionPrompt }],
      });

      const motionContent =
        motionMsg.content[0]?.type === "text"
          ? motionMsg.content[0].text
          : "";

      const motionTitleMap: Record<string, string> = {
        direct_appeal: "Brief in Support of Direct Appeal",
        bangert_motion: "Motion to Withdraw Guilty Plea (Bangert Motion)",
        postconviction_974:
          "Motion for Post-Conviction Relief — Wis. Stat. § 974.06",
        federal_habeas:
          "Petition for Writ of Habeas Corpus — 28 U.S.C. § 2254",
      };

      const [insertedMotion] = await db
        .insert(motionsTable)
        .values({
          caseId,
          sessionId,
          title:
            motionTitleMap[session.simulationMode] ??
            "Post-Conviction Motion",
          content: motionContent,
        })
        .returning();

      await db
        .update(casesTable)
        .set({ hasMotion: true, updatedAt: new Date() })
        .where(eq(casesTable.id, caseId));

      sendSse(res, { type: "motion", data: insertedMotion });
    }

    sendSse(res, { type: "done" });
    res.end();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    sendSse(res, { type: "error", message: msg });
    await db
      .update(courtSessionsTable)
      .set({ status: "error", updatedAt: new Date() })
      .where(eq(courtSessionsTable.id, sessionId));
    res.end();
  }
});

export default router;
