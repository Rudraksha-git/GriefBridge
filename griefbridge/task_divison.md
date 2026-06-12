# GriefBridge — Team Task Division

**Project:** GriefBridge · AI-powered Legacy & Bereavement Support System  
**Stack:** Next.js 14 · LangChain.js · Claude API · Pinecone · Prisma · PostgreSQL  
**Team size:** 4 people · ~10 tasks each · 25% load each

---

## Sync points — do these before anyone starts

| # | What | Who | When |
|---|---|---|---|
| 1 | P1 pushes bootstrapped repo + Prisma schema | P1 | Hour 0 |
| 2 | P2 & P3 share API response JSON shapes with P4 | P2, P3 → P4 | Hour 2 |
| 3 | P4 shares demo script so everyone knows the end-to-end flow | P4 → all | Hour 2 |

---

## Person 1 — Foundation & Agents

**Role:** Sets up the project skeleton everyone builds on, then owns 2 core agents.

### Tasks

**Setup (done first — unblocks everyone)**
- [ ] Bootstrap Next.js 14 project with Tailwind, Clerk, and Prisma
- [ ] Write `prisma/schema.prisma` — Task, Document, Memory, User models + run first migration
- [ ] Create `lib/anthropic.js`, `lib/pinecone.js`, `lib/prisma.js` — shared clients
- [ ] Set up `.env.local`, `next.config.js`, push repo to GitHub

**Agent work**
- [ ] Build `agents/orchestrator.js` — LangChain.js state machine, task triage and routing
- [ ] Build `agents/documentAgent.js` — Claude tool calls for document drafting
- [ ] Write `tools/documentTools.js` — PDFKit generation + Handlebars template fill
- [ ] Write 5 core document templates: bank closure, insurance claim, legal heir, EPF, Aadhaar
- [ ] Write `scripts/loadDemoData.js` — seed DB and pre-load sample task list

**Demo deliverable:** Orchestrator routing 5 tasks and document agent outputting a filled bank closure PDF in under 10 seconds.

---

## Person 2 — Executor Track APIs

**Role:** All task and document backend routes, notification agent, institution data.

### Tasks

**API routes**
- [ ] Build `app/api/tasks/route.js` — GET all tasks, prioritised by legal deadline
- [ ] Build `app/api/tasks/[id]/route.js` + `approve/route.js`
- [ ] Build `app/api/documents/route.js` — POST draft trigger
- [ ] Build `app/api/documents/[id]/route.js` + `approve/route.js`
- [ ] Build `app/api/notifications/route.js` — institution registry CRUD

**Tools & data**
- [ ] Write `tools/notificationTools.js` — draft notification letters per institution type
- [ ] Build `data/institutionRegistry.json` — 30+ banks, govt offices, insurers with contact details
- [ ] Build `agents/notificationAgent.js` — status tracking: pending → sent → resolved
- [ ] Write 5 remaining document templates: property mutation, digital account, pension, utility, employer

**Demo deliverable:** `/api/tasks` returns 14 prioritised tasks; `/api/notifications` shows 7 institutions with live status badges.

---

## Person 3 — Memory Track

**Role:** Full ingestion pipeline (voice, chat, photos) + Legacy Companion RAG system.

### Tasks

**Ingestion pipeline**
- [ ] Build `tools/audioTools.js` — Whisper API transcription with speaker timestamps
- [ ] Build `tools/chatParser.js` — WhatsApp/Telegram ZIP export to structured messages
- [ ] Build `tools/imageTools.js` — Claude Vision captioning + EXIF date/location extraction
- [ ] Build `tools/memoryTools.js` — chunk text, embed with OpenAI, upsert to Pinecone
- [ ] Build `app/api/memory/ingest/route.js` + `status/route.js` + `graph/route.js`
- [ ] Build `agents/ingestionAgent.js` — orchestrates all tools above in sequence

**Companion RAG**
- [ ] Build `agents/companionAgent.js` — semantic search → context retrieval → cited answer
- [ ] Build `app/api/companion/chat/route.js` + `history/route.js`
- [ ] Implement zero-hallucination guardrail — confidence threshold + "not found" fallback
- [ ] Pre-process Sharma family sample data → warm Pinecone index for demo day

**Demo deliverable:** Companion answers "What did Papa think about my career?" with a cited voice memo source.

---

## Person 4 — Frontend & Pitch

**Role:** All Next.js pages, shared components, UI polish, pitch deck, and demo ownership.

### Tasks

**Pages & components**
- [ ] Build `app/layout.js` — Clerk auth wrapper, sidebar nav, responsive shell
- [ ] Build `app/page.js` — landing/onboarding with drag-and-drop data upload UI
- [ ] Build `app/dashboard/page.js` + `components/TaskCard.jsx` — task list with deadline badges
- [ ] Build `app/documents/page.js` + `[id]/page.js` + `components/ApprovalModal.jsx`
- [ ] Build `app/notifications/page.js` — institution tracker with status pipeline UI
- [ ] Build `app/legacy/page.js` — memory graph overview + photo/audio timeline
- [ ] Build `app/legacy/chat/page.js` + `components/CompanionChat.jsx` — chat with source citations

**Demo & pitch**
- [ ] Build the pitch deck (5 slides: problem, solution, demo, tech, team)
- [ ] Own and rehearse the 5-minute demo script end to end

**Demo deliverable:** Fully clickable UI through all 5 screens with zero broken states + polished pitch deck ready.

---

## Load summary

| Person | Focus area | Tasks | Load |
|---|---|---|---|
| P1 | Foundation & agents | 9 | 25% |
| P2 | Executor track APIs | 9 | 25% |
| P3 | Memory track | 10 | 25% |
| P4 | Frontend & pitch | 9 | 25% |

---

## File ownership map

```
app/
  layout.js                 → P4
  page.js                   → P4
  dashboard/page.js         → P4
  documents/                → P4
  notifications/page.js     → P4
  legacy/                   → P4
  api/tasks/                → P2
  api/documents/            → P2
  api/notifications/        → P2
  api/memory/               → P3
  api/companion/            → P3

agents/
  orchestrator.js           → P1
  documentAgent.js          → P1
  notificationAgent.js      → P2
  ingestionAgent.js         → P3
  companionAgent.js         → P3

tools/
  documentTools.js          → P1
  audioTools.js             → P3
  chatParser.js             → P3
  imageTools.js             → P3
  memoryTools.js            → P3
  notificationTools.js      → P2

components/                 → P4
lib/                        → P1
prisma/schema.prisma        → P1
templates/                  → P1 (5) + P2 (5)
data/                       → P1 (demo seed) + P2 (registry)
```

---

*GriefBridge — Built at [Hackathon Name], [Date]*