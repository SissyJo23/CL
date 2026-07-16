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

async function ocrWithVision(buffer: Buffer, mimeType: string): Promise<string> {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const useMime = allowed.includes(mimeType) ? mimeType : "image/jpeg";
  const base64 = buffer.toString("base64");
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 8192,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: useMime as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 } },
        { type: "text", text: "Transcribe all text from this document image exactly as it appears. Return only the raw transcribed text, preserving structure." },
      ],
    }],
  });
  return msg.content[0]?.type === "text" ? msg.content[0].text : "";
}

async function ocrPdfWithAnthropic(buffer: Buffer): Promise<string> {
  const base64 = buffer.toString("base64");
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 8192,
    messages: [{
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64,
          },
        } as unknown as { type: "text"; text: string },
        {
          type: "text",
          text: "Transcribe all text from this PDF document exactly as it appears. Return only the raw transcribed text, preserving structure and layout. Include all pages.",
        },
      ],
    }],
  });
  return msg.content[0]?.type === "text" ? msg.content[0].text : "";
}

async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  const mime = file.mimetype;
  if (mime === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
    let pdfText = "";
    try {
      const result = await pdfParse(file.buffer);
      pdfText = result.text?.trim() ?? "";
    } catch {
      pdfText = "";
    }
    if (pdfText.length < 100) {
      return await ocrPdfWithAnthropic(file.buffer);
    }
    return pdfText;
  }
  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  if (mime.startsWith("image/")) {
    return await ocrWithVision(file.buffer, mime);
  }
  return file.buffer.toString("utf-8");
}

// Optimized Background Async File Extraction Pipeline
router.post(
  "/cases/:caseId/documents/upload",
  upload.array("files", 10),
  async (req, res) => {
    const caseId = Number(req.params.caseId);
    const files = req.files as Express.Multer.File[] | undefined;
    const documentType = (req.body as { documentType?: string }).documentType ?? "other";

    logger.info({ caseId, fileCount: files?.length ?? 0, documentType }, "Document upload initiated");

    if (!files || files.length === 0) {
      logger.warn({ caseId }, "Upload request with no files");
      res.status(400).json({ error: "No files provided" });
      return;
    }

    const created: typeof documentsTable.$inferSelect[] = [];

    // Phase 1: Create background database placeholders instantly
    for (const file of files) {
      try {
        const title = file.originalname.replace(/\.[^.]+$/, "");
        const [row] = await db
          .insert(documentsTable)
          .values({
            caseId,
            title,
            documentType,
            content: "Extracting file text payload...",
            status: "analyzing",
          })
          .returning();
        
        created.push(row);
      } catch (err) {
        logger.error({ caseId, fileName: file.originalname }, "Placeholder allocation insertion failed");
      }
    }

    // RESPOND IMMEDIATELY TO SAFELY END THE HTTP REQUEST TIMEOUT WINDOW (<50ms)
    res.status(201).json(created);

    // Phase 2: Asynchronous Background Decompression and Extraction Loop
    (async () => {
      let index = 0;
      for (const file of files) {
        const rowPlaceholder = created[index];
        index++;
        if (!rowPlaceholder) continue;

        try {
          logger.info({ fileName: file.originalname, docId: rowPlaceholder.id }, "Beginning background text extraction routine");
          const extractedText = await extractTextFromFile(file);
          logger.info({ fileName: file.originalname, docId: rowPlaceholder.id, textLength: extractedText.length }, "Text extraction routine complete");

          if (!extractedText.trim()) {
            throw new Error("Text processing engine returned clean empty buffers.");
          }

          // Update data block with text payload
          await db
            .update(documentsTable)
            .set({ content: extractedText, updatedAt: new Date() })
            .where(eq(documentsTable.id, rowPlaceholder.id));

          logger.info({ docId: rowPlaceholder.id }, "Forwarding internal analysis workflow handshake natively");
          
          // Fixed Internal Handshake Hook targeting localhost to avoid external routing drops
          await fetch(`http://localhost:10000/cases/${caseId}/documents/${rowPlaceholder.id}/analyze?mode=attorney`, {
            method: "POST",
            headers: { 
              ...(req.headers.authorization ? { "Authorization": req.headers.authorization } : {})
            }
          });

        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Processing failed";
          logger.error({ fileName: file.originalname, docId: rowPlaceholder.id, error: errorMsg }, "Background parsing sequence crash configuration dropped");
          
          await db
            .update(documentsTable)
            .set({ status: "error" })
            .where(eq(documentsTable.id, rowPlaceholder.id));
        }
      }
    })();
  },
);

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

router.delete("/cases/:caseId/documents/:id", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const id = Number(req.params.id);
  await db
    .delete(documentsTable)
    .where(and(eq(documentsTable.id, id), eq(documentsTable.caseId, caseId)));
  res.status(204).send();
});

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

const VALID_MODES = ["inmate", "advocate", "attorney", "appellate"] as const;
type UserMode = typeof VALID_MODES[number];

router.post("/cases/:caseId/documents/:id/analyze", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const docId = Number(req.params.id);

  const rawMode = req.query.mode;
  const userMode: UserMode | undefined =
    typeof rawMode === "string" && VALID_MODES.includes(rawMode as UserMode)
      ? (rawMode as UserMode)
      : undefined;

  const [doc] = await db
    .select()
    .from(documentsTable)
    .where(and(eq(documentsTable.id, docId), eq(documentsTable.caseId, caseId)));

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  if (doc.status === "analyzing") {
    res.status(409).json({ error: "Analysis is already in progress for this document." });
    return;
  }

  // 1. Instantly mark as analyzing in DB
  await db
    .update(documentsTable)
    .set({ status: "analyzing" })
    .where(eq(documentsTable.id, docId));

  // 2. Clear old findings if re-analyzing
  if (doc.status === "analyzed") {
    await db.delete(findingsTable).where(
      and(eq(findingsTable.documentId, docId), eq(findingsTable.caseId, caseId))
    );
  }

  // 3. RESPOND IMMEDIATELY TO BYPASS RENDER TIMEOUTS
  res.status(202).json({ message: "Analysis started in background" });

  // 4. Run the heavy AI processing inside an asynchronous wrapper
  (async () => {
    try {
      logger.info({ docId, caseId, userMode: userMode ?? "attorney" }, "Starting background document analysis");

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
          ? buildChunkAnalysisPrompt(
              doc.documentType, doc.title, chunk, chunkIndex, totalChunks,
              chunkSummary, otherDocsForPrompt, userCategories,
            )
          : buildAnalysisPrompt(
              doc.documentType, doc.title, chunk, otherDocsForPrompt, userCategories,
            );

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
          } else if (arrayStart !== -1) {
            cleaned = cleaned.slice(arrayStart);
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
                logger.warn({ docId, chunkIndex, recovered: parsed.length }, "AI response truncated — recovered partial findings");
              }
            }
          } catch { /* partial recovery also failed */ }

          if (!recovered) {
            logger.error({ err: parseErr, docId, chunkIndex }, "Failed to parse AI findings response");
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
        const resolvedCategoryId =
          f.categoryId != null && validCategoryIds.has(f.categoryId) ? f.categoryId : null;

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

      // Cross-case correlations setup
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
            .where(ne(findingsTable.documentId, docId))
            .orderBy(desc(findingsTable.id));

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
          logger.error({ crossErr }, "Cross-case execution bypassed");
        }
      }

      // 5. Update state to analyzed once fully complete
      await db
        .update(documentsTable)
        .set({ status: "analyzed", findingCount: insertedFindings.length, updatedAt: new Date() })
        .where(eq(documentsTable.id, docId));

      await db
        .update(casesTable)
        .set({ hasAnalysis: true, updatedAt: new Date() })
        .where(eq(casesTable.id, caseId));

      logger.info({ docId }, "Background analysis complete!");

    } catch (err) {
      logger.error({ err, docId }, "Background loop execution failed");
      await db
        .update(documentsTable)
        .set({ status: "error" })
        .where(eq(documentsTable.id, docId));
    }
  })();
});

export default router;
