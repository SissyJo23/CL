---
name: Document upload lifecycle
description: Production behavior and design rule for CaseLight document uploads.
---

Document ingestion and AI analysis must be separate lifecycle steps. A successful upload should extract and persist content as `pending`; AI analysis may later transition it to `analyzed` or `error`.

**Why:** Production accepted multipart files and extracted their text, but the background AI call could remain in progress long enough that the UI appeared to reject the upload.

**How to apply:** Never report an upload as fully processed before analysis completes, and never leave an upload in `analyzing` merely because the analysis worker is slow or unavailable.