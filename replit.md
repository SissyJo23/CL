# CaseLight — Legal Document Analyzer & Court Simulator

## What This App Does
A full-stack advocacy tool that reads legal documents (transcripts, police reports, appeals, etc.) and produces exhaustive AI-powered analysis of every line, date, signature, and procedural element. Features a 4-round+ AI court simulator (Defense vs State vs AI judge) across 4 legal modes. Mission: "Just because you didn't get justice doesn't mean you don't deserve it."

## Tech Stack
- **Monorepo**: pnpm workspaces
- **Frontend**: React + Vite (artifacts/legal-analyzer), wouter routing, shadcn/ui, TanStack Query
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: Anthropic Claude (user's own API key — NOT Replit AI Integrations)
- **Codegen**: Orval → generates React Query hooks and Zod schemas from openapi.yaml

## Project Structure
```
lib/
  api-spec/openapi.yaml          — single source of truth for API
  api-client-react/              — generated React Query hooks
  api-zod/                       — generated Zod schemas
  db/src/schema/                 — Drizzle ORM schema
    cases.ts, documents.ts, categories.ts, findings.ts, court.ts, motions.ts,
    pattern-analyses.ts, relief-pathways.ts, nomerit-analyses.ts

artifacts/
  api-server/src/
    routes/                      — Express routes (cases, documents, findings, categories, court, motions, export, pattern, relief, nomerit)
    lib/anthropic.ts             — Anthropic client + all AI prompts + DOCUMENT_TYPE_LABELS
  legal-analyzer/src/
    pages/                       — React pages (Home, CaseNew, CaseShow, DocumentShow, NomeritPage, CourtNew, CourtRun, CourtShow, MotionShow, PatternPage, ReliefPage)
    components/                  — CategoryFilter, FindingCard, etc.
```

## Key Architecture Decisions
1. **User's own Anthropic key**: `ANTHROPIC_API_KEY` env secret — user purchases from console.anthropic.com. NOT via Replit integrations.
2. **Exhaustive analysis**: AI prompt mandates covering every line — 15 mandatory coverage categories.
3. **Permanent result cache**: Findings are stored in DB; re-analysis only on explicit request.
4. **SSE streaming**: Document analysis and court simulation stream results via Server-Sent Events (fetch + ReadableStream on frontend).
5. **Cross-case matching**: Every finding cross-referenced against all other documents in the case.
6. **4 court modes**: direct_appeal, bangert_motion, postconviction_974, federal_habeas.

## Environment Variables Required
- `DATABASE_URL` — provisioned automatically by Replit
- `ANTHROPIC_API_KEY` — **user must supply this** (their Claude console key, starts with sk-ant-)
- `PORT` — set automatically per artifact

## API Regeneration
After changing `lib/api-spec/openapi.yaml`:
```bash
pnpm --filter @workspace/api-spec run codegen
```

## Database Changes
After updating schema files in `lib/db/src/schema/`:
```bash
pnpm --filter @workspace/db run push
```

## Color System for Categories
Categories have 5 colors: blue, yellow, red, pink, orange. Rendered as badges on FindingCards.

## No-Merit Report Analyzer (Feature 3)
When a document is typed as `no_merit_report`, the document page shows a violet "Run No-Merit Analysis" button. This triggers a two-phase AI analysis:
1. **Phase 1**: Extracts dismissed claims from the report, identifies case findings counsel missed, and assesses arguability under Anders/Smith v. Robbins
2. **Phase 2**: Drafts per-issue IAAC arguments (Strickland prongs) and a full Wisconsin-specific draft motion, including Martinez v. Ryan analysis

Results stored in `nomerit_analyses` table. Analysis page: `/cases/:caseId/documents/:id/nomerit`.

## Court Simulation Modes
1. **Direct Appeal** — De novo / harmless error standard
2. **Bangert Motion** — Plea withdrawal; burden shifts to State (State v. Bangert, 131 Wis. 2d 246)
3. **§974.06 Postconviction** — IAC (Strickland) + Escalona-Naranjo procedural bar
4. **Federal Habeas** — AEDPA § 2254 deference, SCOTUS clearly established law

## Tone Guidelines
- Never cold or clinical. Warm, determined, advocacy-first.
- No emojis anywhere in the UI.
- Key copy: "Just because you didn't get justice doesn't mean you don't deserve it."
- Analysis complete: "We went through every line. Here's everything we found."
- Disclaimer shown respectfully — not cold legalese.
