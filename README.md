# AI Tax Workspace Prototype

A Vercel-ready interaction prototype for a shared CPA and client tax
workspace. The current milestone contains the application foundation and mock
data boundary only. Product screens intentionally have not been started yet.

## Stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS 4
- shadcn/ui using the current `base-nova` preset and Base UI primitives
- Zustand for upcoming client-side workspace state
- Motion for upcoming context and disclosure transitions
- Deterministic TypeScript fixtures; no backend or database

## Run locally

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run check
npm run build
```

## Mock data architecture

Components will import from `@/mock-data`, which exposes an asynchronous,
query-style `mockRepository`. They should not import fixture arrays directly.
That makes `src/mock-data/repository.ts` the replaceable boundary for a future
API client.

```text
src/mock-data/
  types.ts                     Domain model
  constants.ts                 Shared statuses, roles, and thresholds
  people.ts                    Firms, users, access contexts, and clients
  demo-data.ts                 Hand-authored edge cases and linked workflows
  generate-complex-return.ts   Seeded large-return generator
  database.ts                  Internal fixture assembly
  repository.ts                Public mock API/query boundary
  index.ts                     Public exports
src/lib/
  fake-ai.ts                   Single entry point for simulated AI behavior
scripts/
  validate-mock-data.ts        Referential integrity and volume checks
```

The seeded dataset currently contains:

- 9 users covering all 6 required roles
- 5 clients and 5 tax returns in distinct workflow states
- 20 hand-authored source documents
- 180 generated Northstar documents, for 200 total
- 19 hand-authored return fields
- 240 generated Northstar fields, for 259 total
- High-, medium-, and low-confidence AI outputs
- One deliberately wrong extraction with a human correction history
- Document, field, issue, task, thread, and message relationships suitable for
  multi-hop navigation

Run `npm run validate:data` after changing fixtures. It verifies identifiers,
source pointers, cross-object links, role coverage, scale constraints, and the
required AI correction case.

## Dependency note

`npm audit` currently reports three production high-severity advisories in the
PostCSS and Sharp versions pinned inside Next.js 16.2.12. This project was
generated with the current `create-next-app@latest`; npm's proposed forced fix
incorrectly downgrades Next.js to 9.3.3, so it has not been applied. Re-check
the audit when the next patched Next.js release is available.

## What's real vs. simulated

| Area | Real in the prototype | Simulated |
| --- | --- | --- |
| App foundation | Next.js routing foundation, strict TypeScript, Tailwind, shadcn components, Zustand and Motion dependencies | No product routes or shell yet |
| Data access | Typed async repository, filtering, pagination, relationship assembly, and integrity validation | All records are in-memory TypeScript fixtures |
| Users and roles | Six role types, explicit permissions, staff/client workspace contexts, and one dual-context employee | No authentication, authorization server, sessions, or identity provider |
| Tax returns | One shared status vocabulary and real cross-entity references | Filing status changes are not persisted outside the browser |
| Source traceability | Page, block, section, and bounding-box pointers plus inspectable transformations | Documents are structured text blocks, not parsed PDFs |
| Collaboration | Return-scoped threads, internal/client visibility, linked tasks, owners, due dates, and outstanding actions | Sending messages and notifications is not connected to external services |
| AI | Typed fake-AI functions, confidence scoring, evidence pointers, uncertainty, anomaly shapes, and correction records | No model call, OCR, embeddings, retrieval system, or LLM API |
| Scale | Seeded generation of 180 documents and 240 fields; repository search/filter/pagination operate on the full dataset | Volume is generated in memory and does not measure database or network performance |

## Product decisions

These are explicit defaults to review before UI implementation:

- **Assigned scope:** the challenge list was left unspecified, so the working
  assumption is all 10 challenges in the supplied priority order.
- **Shared statuses:** Not Started, Awaiting Client Info, In Preparation, In
  Review, Client Approval Needed, Filed, and Amended.
- **Internal nuance:** `statusDetail` and `waitingSince` add operational detail
  beneath the shared status; they do not introduce a second status vocabulary.
- **AI confidence:** 90-100 is high confidence, 70-89 remains reviewable, and
  below 70 requires prominent human review.
- **Field states:** AI generated/unverified, verified, locked, editable, and
  needs approval. Origin and interaction state are separate properties.
- **Dual-context employee:** Mateo Ruiz is one user identity with a staff
  workspace and a clearly named personal-return workspace.
- **Scale case:** Northstar Manufacturing has 180 seeded generated documents
  and 240 seeded generated fields in addition to four hand-authored anchor
  documents and fields.
- **Prototype date:** workflow dates and urgency examples are anchored to July
  27, 2026, with extension deadlines in September and October 2026.
