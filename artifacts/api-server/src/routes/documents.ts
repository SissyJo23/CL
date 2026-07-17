import { Router, type Response } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { db, documentsTable, insertDocumentSchema, findingsTable, crossCaseMatchesTable, casesTable, categoriesTable } from "@workspace/db";
import { eq, and, desc, ne } from "drizzle-orm";
import { anthropic, buildAnalysisPrompt, buildChunkAnalysisPrompt, buildChunkSummary, runCrossCaseMatching } from "../lib/anthropic";
import { redactText, splitIntoChunks } from "../lib/redact";
import { logger } from "../lib/logger";

const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024, files: 10 } });

const VALID_MODES = ["inmate", "advocate", "attorney", "appellate"] as const;
type UserMode = typeof VALID_MODES[number];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  try {
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      return data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    } else if (file.mimetype === 'text/plain') {
      return file.buffer.toString('utf-8');
    } else {
      return file.buffer.toString('utf-8');
    }
  } catch (error) {
    logger.error({ error, filename: file.originalname }, "Failed to extract text from file");
    throw new Error(`Failed to extract text from ${file.originalname}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
        const waitSecs = retryAfterRaw && !isNaN(parseInt(retryAfterRaw, 10)) ? parseInt(retryAfterRaw, 10) : 60;
        for (let s = waitSecs; s > 0; s -= 10) {
          onStatus(`Rate limit reached — retrying in ${s} second${s === 1 ? "" : "s"}…`);
          await new Promise((r) => setTimeout(r, Math.min(10, s) * 1000));
        }
      } else if (status === 529 || status === 503) {
        if (attempt < maxRetries) {
          const waitSecs = Math.pow(2, attempt) * 5;
          onStatus(`Service overloaded — retrying in ${waitSecs} seconds…`);
          await new Promise((r) => setTimeout(r, waitSecs * 1000));
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

// ==========================================
// SSE STREAMING ANALYSIS WORKER
// ==========================================
async function executeDocumentAnalysisWithStreaming(
  caseId: number,
  docId: number,
  userMode: UserMode | undefined,
  res: Response
) {
  try {
    logger.info({ docId, caseId }, "SSE streaming analysis started");

    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(and(eq(documentsTable.id, docId), eq(documentsTable.caseId, caseId)));

    if (!doc) throw new Error("Document records missing during worker initialization");

    const otherDocs = await db
      .select()
      .from(documentsTable)
      .where(and(eq(documentsTable.caseId, caseId)));

    const otherDocsForPrompt = otherDocs
      .filter((d) => d.id !== docId)
      .map((d) => ({ id: d.id, title: d.title, content: d.content }));

    const userCategories = await db
      .select({ id: categoriesTable.id, name: categoriesTable.name, description: categoriesTable.description })
      .from(categoriesTable);

    const validCategoryIds = new Set(userCategories.map((c) => c.id));
    const contentToAnalyze = redactText(doc.content);
    const chunks = splitIntoChunks(contentToAnalyze);
    const isChunked = chunks.length > 1;

    type RawFinding = {
      issueTitle: string;
      transcriptExcerpt: string;
      legalAnalysis: string;
      pageNumber?: number | null;
      lineNumber?: number | null;
      categoryId?: number | null;
      precedentName?: string | null;
      precedentCitation?: string | null;
      precedentType?: string | null;
      courtRuling?: string | null;
      materialSimilarity?: string | null;
      proceduralStatus?: string | null;
      anticipatedBlock?: string | null;
      breakthroughArgument?: string | null;
      legalVehicle?: string | null;
      survivability?: string | null;
    };

    const allFindings: RawFinding[] = [];
    let chunkSummary = "";

    for (const { chunk, chunkIndex, totalChunks } of chunks) {
      const statusMsg = isChunked 
        ? `Analyzing chunk ${chunkIndex + 1}/${totalChunks}...` 
        : "Analyzing document...";
      
      res.write(`data: ${JSON.stringify({ type: 'status', message: statusMsg })}\n\n`);

      const prompt = isChunked
        ? buildChunkAnalysisPrompt(doc.documentType, doc.title, chunk, chunkIndex, totalChunks, chunkSummary, otherDocsForPrompt, userCategories)
        : buildAnalysisPrompt(doc.documentType, doc.title, chunk, otherDocsForPrompt, userCategories);

      const message = await callAnthropicWithRetry(
        { model: "claude-3-5-sonnet-latest", max_tokens: 8192, messages: [{ role: "user", content: prompt }] },
        (msg) => logger.info({ docId, chunkIndex }, msg)
      );

      const rawText = message.content[0]?.type === "text" ? message.content[0].text : "[]";
      let chunkFindings: RawFinding[] = [];

      try {
        let cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
        const arrayStart = cleaned.indexOf("[");
        const arrayEnd = cleaned.lastIndexOf("]");
        if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
          cleaned = cleaned.slice(arrayStart, arrayEnd + 1);
        }
        chunkFindings = JSON.parse(cleaned);
        if (!Array.isArray(chunkFindings)) chunkFindings = [];
      } catch (parseErr) {
        let recovered = false;
        try {
          let partial = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
          const arrayStart = partial.indexOf("[");
          if (arrayStart !== -1) partial = partial.slice(arrayStart);
          const lastComplete = partial.lastIndexOf("},");
          if (lastComplete !== -1) {
            const attempt = partial.slice(0, lastComplete + 1) + "]";
            const parsed = JSON.parse(attempt);
            if (Array.isArray(parsed) && parsed.length > 0) {
              chunkFindings = parsed;
              recovered = true;
            }
          }
        } catch { /* parse failure protection */ }

        if (!recovered) {
          if (!isChunked) {
            await db.update(documentsTable).set({ status: "error" }).where(eq(documentsTable.id, docId));
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to parse analysis response' })}\n\n`);
            return;
          }
          chunkFindings = [];
        }
      }

      allFindings.push(...chunkFindings);

      // Stream each finding as it's discovered
      for (const f of chunkFindings) {
        res.write(`data: ${JSON.stringify({ type: 'finding', data: f })}\n\n`);
      }

      if (isChunked && chunkIndex < totalChunks - 1) {
        chunkSummary = await buildChunkSummary(chunk, chunkSummary);
      }
    }

    // Save all findings to database
    const insertedFindings = [];
    for (const f of allFindings) {
      const resolvedCategoryId = f.categoryId != null && validCategoryIds.has(f.categoryId) ? f.categoryId : null;

      const [inserted] = await db
        .insert(findingsTable)
        .values({
          documentId: docId,
          caseId,
          issueTitle: f.issueTitle,
          transcriptExcerpt: f.transcriptExcerpt,
          legalAnalysis: f.legalAnalysis,
          categoryId: resolvedCategoryId,
          pageNumber: typeof f.pageNumber === "number" ? f.pageNumber : null,
          lineNumber: typeof f.lineNumber === "number" ? f.lineNumber : null,
          precedentName: f.precedentName ?? null,
          precedentCitation: f.precedentCitation ?? null,
          precedentType: f.precedentType ?? null,
          courtRuling: f.courtRuling ?? null,
          materialSimilarity: f.materialSimilarity ?? null,
          proceduralStatus: f.proceduralStatus ?? null,
          anticipatedBlock: f.anticipatedBlock ?? null,
          breakthroughArgument: f.breakthroughArgument ?? null,
          legalVehicle: f.legalVehicle ?? null,
          survivability: f.survivability ?? null,
        })
        .returning();
      insertedFindings.push(inserted);
    }

    // Cross-case matching
    if (insertedFindings.length > 0) {
      try {
        const otherCaseFindings = await db
          .select({
            id: findingsTable.id,
            issueTitle: findingsTable.issueTitle,
            transcriptExcerpt: findingsTable.transcriptExcerpt,
            documentId: findingsTable.documentId,
            documentTitle: documentsTable.title,
            caseTitle: casesTable.title,
          })
          .from(findingsTable)
          .innerJoin(documentsTable, eq(findingsTable.documentId, documentsTable.id))
          .innerJoin(casesTable, eq(findingsTable.caseId, casesTable.id))
          .where(ne(findingsTable.documentId, docId));

        if (otherCaseFindings.length > 0) {
          const crossMatches = await runCrossCaseMatching(insertedFindings, otherCaseFindings);
          for (const match of crossMatches) {
            await db.insert(crossCaseMatchesTable).values({
              findingId: match.newFindingId,
              sourceDocumentId: match.sourceDocumentId,
              sourceDocumentTitle: match.sourceDocumentTitle,
              matchedPassage: match.matchedPassage,
              explanation: match.explanation,
              relevanceScore: String(match.relevanceScore),
            });
          }
          res.write(`data: ${JSON.stringify({ type: 'cross_case_done' })}\n\n`);
        }
      } catch (crossErr) {
        logger.error({ crossErr }, "Cross-case tracking exception bypassed");
      }
    }

    // Update document status
    await db
      .update(documentsTable)
      .set({ status: "analyzed", findingCount: insertedFindings.length, updatedAt: new Date() })
      .where(eq(documentsTable.id, docId));

    await db
      .update(casesTable)
      .set({ hasAnalysis: true, updatedAt: new Date() })
      .where(eq(casesTable.id, caseId));

    logger.info({ docId, findingCount: insertedFindings.length }, "SSE streaming analysis complete!");
    
    // Send completion event
    res.write(`data: ${JSON.stringify({ type: 'done', findingCount: insertedFindings.length })}\n\n`);

  } catch (error) {
    logger.error({ error, docId }, "SSE streaming pipeline crash");
    await db
      .update(documentsTable)
      .set({ status: "error" })
      .where(eq(documentsTable.id, docId));
    res.write(`data: ${JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'Analysis failed' })}\n\n`);
  }
}

// ==========================================
// SHARED CORE BACKGROUND ANALYSIS WORKER (for uploads)
// ==========================================
async function executeDocumentAnalysis(caseId: number, docId: number, userMode: UserMode | undefined) {
  try {
    logger.info({ docId, caseId }, "Background worker executing analysis loop directly in memory");

    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(and(eq(documentsTable.id, docId), eq(documentsTable.caseId, caseId)));

    if (!doc) throw new Error("Document records missing during worker initialization");

    const otherDocs = await db
      .select()
      .from(documentsTable)
      .where(and(eq(documentsTable.caseId, caseId)));

    const otherDocsForPrompt = otherDocs
      .filter((d) => d.id !== docId)
      .map((d) => ({ id: d.id, title: d.title, content: d.content }));

    const userCategories = await db
      .select({ id: categoriesTable.id, name: categoriesTable.name, description: categoriesTable.description })
      .from(categoriesTable);

    const validCategoryIds = new Set(userCategories.map((c) => c.id));
    const contentToAnalyze = redactText(doc.content);
    const chunks = splitIntoChunks(contentToAnalyze);
    const isChunked = chunks.length > 1;

    type RawFinding = {
      issueTitle: string;
      transcriptExcerpt: string;
      legalAnalysis: string;
      pageNumber?: number | null;
      lineNumber?: number | null;
      categoryId?: number | null;
      precedentName?: string | null;
      precedentCitation?: string | null;
      precedentType?: string | null;
      courtRuling?: string | null;
      materialSimilarity?: string | null;
      proceduralStatus?: string | null;
      anticipatedBlock?: string | null;
      breakthroughArgument?: string | null;
      legalVehicle?: string | null;
      survivability?: string | null;
    };

    const allFindings: RawFinding[] = [];
    let chunkSummary = "";

    for (const { chunk, chunkIndex, totalChunks } of chunks) {
      const prompt = isChunked
        ? buildChunkAnalysisPrompt(doc.documentType, doc.title, chunk, chunkIndex, totalChunks, chunkSummary, otherDocsForPrompt, userCategories)
        : buildAnalysisPrompt(doc.documentType, doc.title, chunk, otherDocsForPrompt, userCategories);

      const message = await callAnthropicWithRetry(
        { model: "claude-3-5-sonnet-latest", max_tokens: 8192, messages: [{ role: "user", content: prompt }] },
        (msg) => logger.info({ docId, chunkIndex }, msg)
      );

      const rawText = message.content[0]?.type === "text" ? message.content[0].text : "[]";
      let chunkFindings: RawFinding[] = [];

      try {
        let cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
        const arrayStart = cleaned.indexOf("[");
        const arrayEnd = cleaned.lastIndexOf("]");
        if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
          cleaned = cleaned.slice(arrayStart, arrayEnd + 1);
        }
        chunkFindings = JSON.parse(cleaned);
        if (!Array.isArray(chunkFindings)) chunkFindings = [];
      } catch (parseErr) {
        let recovered = false;
        try {
          let partial = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
          const arrayStart = partial.indexOf("[");
          if (arrayStart !== -1) partial = partial.slice(arrayStart);
          const lastComplete = partial.lastIndexOf("},");
          if (lastComplete !== -1) {
            const attempt = partial.slice(0, lastComplete + 1) + "]";
            const parsed = JSON.parse(attempt);
            if (Array.isArray(parsed) && parsed.length > 0) {
              chunkFindings = parsed;
              recovered = true;
            }
          }
        } catch { /* parse failure protection */ }

        if (!recovered) {
          if (!isChunked) {
            await db.update(documentsTable).set({ status: "error" }).where(eq(documentsTable.id, docId));
            return;
          }
          chunkFindings = [];
        }
      }

      allFindings.push(...chunkFindings);

      if (isChunked && chunkIndex < totalChunks - 1) {
        chunkSummary = await buildChunkSummary(chunk, chunkSummary);
      }
    }

    const insertedFindings = [];
    for (const f of allFindings) {
      const resolvedCategoryId = f.categoryId != null && validCategoryIds.has(f.categoryId) ? f.categoryId : null;

      const [inserted] = await db
        .insert(findingsTable)
        .values({
          documentId: docId,
          caseId,
          issueTitle: f.issueTitle,
          transcriptExcerpt: f.transcriptExcerpt,
          legalAnalysis: f.legalAnalysis,
          categoryId: resolvedCategoryId,
          pageNumber: typeof f.pageNumber === "number" ? f.pageNumber : null,
          lineNumber: typeof f.lineNumber === "number" ? f.lineNumber : null,
          precedentName: f.precedentName ?? null,
          precedentCitation: f.precedentCitation ?? null,
          precedentType: f.precedentType ?? null,
          courtRuling: f.courtRuling ?? null,
          materialSimilarity: f.materialSimilarity ?? null,
          proceduralStatus: f.proceduralStatus ?? null,
          anticipatedBlock: f.anticipatedBlock ?? null,
          breakthroughArgument: f.breakthroughArgument ?? null,
          legalVehicle: f.legalVehicle ?? null,
          survivability: f.survivability ?? null,
        })
        .returning();
      insertedFindings.push(inserted);
    }

    if (insertedFindings.length > 0) {
      try {
        const otherCaseFindings = await db
          .select({
            id: findingsTable.id,
            issueTitle: findingsTable.issueTitle,
            transcriptExcerpt: findingsTable.transcriptExcerpt,
            documentId: findingsTable.documentId,
            documentTitle: documentsTable.title,
            caseTitle: casesTable.title,
          })
          .from(findingsTable)
          .innerJoin(documentsTable, eq(findingsTable.documentId, documentsTable.id))
          .innerJoin(casesTable, eq(findingsTable.caseId, casesTable.id))
          .where(ne(findingsTable.documentId, docId));

        if (otherCaseFindings.length > 0) {
          const crossMatches = await runCrossCaseMatching(insertedFindings, otherCaseFindings);
          for (const match of crossMatches) {
            await db.insert(crossCaseMatchesTable).values({
              findingId: match.newFindingId,
              sourceDocumentId: match.sourceDocumentId,
              sourceDocumentTitle: match.sourceDocumentTitle,
              matchedPassage: match.matchedPassage,
              explanation: match.explanation,
              relevanceScore: String(match.relevanceScore),
            });
          }
        }
      } catch (crossErr) {
        logger.error({ crossErr }, "Cross-case tracking exception bypassed");
      }
    }

    await db
      .update(documentsTable)
      .set({ status: "analyzed", findingCount: insertedFindings.length, updatedAt: new Date() })
      .where(eq(documentsTable.id, docId));

    await db
      .update(casesTable)
      .set({ hasAnalysis: true, updatedAt: new Date() })
      .where(eq(casesTable.id, caseId));

    logger.info({ docId }, "Background memory analysis worker complete!");
  } catch (error) {
    logger.error({ error, docId }, "Memory worker pipeline runtime crash");
    await db
      .update(documentsTable)
      .set({ status: "error" })
      .where(eq(documentsTable.id, docId));
  }
}

// ==========================================
// EXPRESS ROUTE ACTIONS
// ==========================================
router.get("/cases/:caseId/documents", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const rows = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.caseId, caseId))
    .orderBy(desc(documentsTable.createdAt));
  res.json(rows);
});

router.post("/redact", async (req, res) => {
  const { text } = req.body as { text?: string };
  if (typeof text !== "string") {
    res.status(400).json({ error: "text field required" });
    return;
  }
  const redacted = redactText(text);
  const changesCount = (text.match(/\[REDACTED[^\]]*\]/g) ?? []).length;
  const actualChanges = (redacted.match(/\[REDACTED[^\]]*\]/g) ?? []).length;
  res.json({ redacted, changesCount: actualChanges });
});

router.post("/cases/:caseId/documents", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const parsed = insertDocumentSchema.safeParse({ ...req.body, caseId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .insert(documentsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(row);
});

router.post("/cases/:caseId/documents/upload", upload.array("files", 10), async (req, res) => {
  const caseId = Number(req.params.caseId);
  const files = req.files as Express.Multer.File[] | undefined;
  const documentType = (req.body as { documentType?: string }).documentType ?? "other";

  if (!files || files.length === 0) {
    res.status(400).json({ error: "No files provided" });
    return;
  }

  const created: typeof documentsTable.$inferSelect[] = [];

  for (const file of files) {
    try {
      const title = file.originalname.replace(/\.[^.]+$/, "");
      const [row] = await db
        .insert(documentsTable)
        .values({
          caseId,
          title,
          documentType,
          content: "Extracting file layout strings...",
          status: "analyzing",
        })
        .returning();
      created.push(row);
    } catch (err) {
      logger.error({ caseId, error: err }, "Placeholder database row creation crash");
    }
  }

  res.status(201).json(created);

  for (let i = 0; i < created.length && i < files.length; i++) {
    const rowPlaceholder = created[i];
    const file = files[i];
    
    (async (cId: number, dId: number, f: Express.Multer.File) => {
      try {
        logger.info({ docId: dId, filename: f.originalname }, "Starting background document processing");
        
        const extractedText = await extractTextFromFile(f);
        if (!extractedText.trim()) {
          throw new Error("Document content parsing returned empty content");
        }

        await db
          .update(documentsTable)
          .set({ content: extractedText, updatedAt: new Date() })
          .where(eq(documentsTable.id, dId));

        await executeDocumentAnalysis(cId, dId, undefined);
        
        logger.info({ docId: dId }, "Background document processing complete");
      } catch (err) {
        logger.error({ docId: dId, error: err }, "Async file payload processing crash");
        await db
          .update(documentsTable)
          .set({ status: "error" })
          .where(eq(documentsTable.id, dId));
      }
    })(caseId, rowPlaceholder.id, file);
  }
});

// ==========================================
// SSE STREAMING ANALYZE ROUTE (UPDATED)
// ==========================================
router.post("/cases/:caseId/documents/:id/analyze", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const docId = Number(req.params.id);
  const rawMode = req.query.mode;
  const userMode: UserMode | undefined =
    typeof rawMode === "string" && VALID_MODES.includes(rawMode as UserMode) ? (rawMode as UserMode) : undefined;

  const [doc] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, docId), eq(documentsTable.caseId, caseId)));

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  // Check if already analyzing
  if (doc.status === "analyzing") {
    res.status(409).json({ error: "Document is already being analyzed" });
    return;
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.flushHeaders();

  // Send initial status
  res.write(`data: ${JSON.stringify({ type: 'status', message: 'Starting analysis...' })}\n\n`);

  // Update document status
  await db.update(documentsTable).set({ 
    status: "analyzing", 
    updatedAt: new Date() 
  }).where(eq(documentsTable.id, docId));

  // Delete old findings if re-analyzing
  if (doc.status === "analyzed") {
    await db.delete(findingsTable).where(
      and(eq(findingsTable.documentId, docId), eq(findingsTable.caseId, caseId))
    );
  }

  try {
    // Run streaming analysis
    await executeDocumentAnalysisWithStreaming(caseId, docId, userMode, res);
  } catch (error) {
    logger.error({ error, docId }, "Streaming analysis failed");
    res.write(`data: ${JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'Analysis failed' })}\n\n`);
  } finally {
    res.end();
  }
});

// ==========================================
// STATUS ENDPOINT (for polling)
// ==========================================
router.get("/cases/:caseId/documents/:id/status", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);
  
  const [doc] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, id), eq(documentsTable.caseId, caseId)));
  
  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  
  res.json({
    id: doc.id,
    status: doc.status,
    findingCount: doc.findingCount,
    updatedAt: doc.updatedAt
  });
});

// ==========================================
// GET DOCUMENT (unchanged)
// ==========================================
router.get("/cases/:caseId/documents/:id", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);
  const [row] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, id), eq(documentsTable.caseId, caseId)));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

// ==========================================
// DELETE DOCUMENT (unchanged)
// ==========================================
router.delete("/cases/:caseId/documents/:id", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);
  await db
    .delete(documentsTable)
    .where(and(eq(documentsTable.id, id), eq(documentsTable.caseId, caseId)));
  res.status(204).send();
});

export default router;
