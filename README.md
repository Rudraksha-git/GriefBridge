# GriefBridge 🕊️
### An AI-powered Legacy & Bereavement Support System

> *"We give families back their time to grieve — not file paperwork."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 20+](https://img.shields.io/badge/node-20+-brightgreen.svg)](https://nodejs.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![LangChain.js](https://img.shields.io/badge/agents-LangChain.js-purple.svg)](https://js.langchain.com/)
[![Claude API](https://img.shields.io/badge/LLM-Claude%20API-orange.svg)](https://www.anthropic.com/)

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [Agent Breakdown](#agent-breakdown)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Demo Walkthrough](#demo-walkthrough)
- [Ethical Guardrails](#ethical-guardrails)
- [Team & Task Division](#team--task-division)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## The Problem

When someone dies, their family faces two simultaneous crises:

1. **The emotional crisis** — grief, loss, and the need to mourn.
2. **The administrative crisis** — an avalanche of 70+ tasks across banks, government offices, insurance companies, utility providers, and digital platforms, typically taking 6–12 months to resolve.

These two crises collide at the worst possible time. Families are expected to locate documents, draft legal notices, visit offices, follow up on institutions, and manage digital estates — all while grieving.

**There is no good technology solution for this today.** GriefBridge changes that.

---

## The Solution

GriefBridge is a **multi-agent AI system** that operates on two parallel tracks:

| Track | What it does |
|---|---|
| **Executor Track** | Autonomously handles all post-death administrative tasks — drafting documents, notifying institutions, tracking deadlines — with human approval at every step |
| **Memory Track** | Ingests the deceased's voice notes, chats, photos, and documents to build a queryable legacy that the family can interact with forever |

Together, these tracks give families one thing back that no technology has ever been able to: **time**.

---

## Core Features

### Executor Track
- **Smart task checklist** — Auto-generates a personalised list of 70+ tasks based on the deceased's profile (assets, accounts, nationality), sorted by legal deadline
- **Document auto-fill** — Drafts legal notices, bank closure letters, insurance claim forms, and government notifications using extracted data
- **Institution notification manager** — Tracks which banks, agencies, and platforms have been notified and follows up on pending responses
- **Deadline calendar** — Surfaces time-critical tasks (e.g. death certificate filing, probate initiation) with countdown alerts
- **Human-in-the-loop** — Nothing is ever filed or sent without explicit family approval

### Memory Track
- **Multi-modal ingestion** — Processes WhatsApp exports, voice memos, photo albums, scanned letters, video transcripts, and social media archives
- **Memory graph builder** — Structures raw inputs into a knowledge graph of events, relationships, opinions, stories, and wisdom
- **Legacy Companion chat** — Family members can ask natural language questions and receive grounded answers sourced only from the deceased's actual data
- **Source citation** — Every answer cites its exact source (e.g. "Voice memo, March 2021") with playback where available
- **Zero hallucination policy** — If the answer isn't in the data, the system says so — it never fabricates

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FAMILY INPUT LAYER                    │
│        Documents · Voice memos · Photos · Chats         │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  ORCHESTRATOR AGENT                      │
│     Triage · Routing · Priority queue · Scheduling      │
└──────────┬────────────────────────────────┬─────────────┘
           │                                │
           ▼                                ▼
┌─────────────────────┐          ┌──────────────────────┐
│   EXECUTOR TRACK    │          │    MEMORY TRACK       │
│                     │          │                       │
│  ┌───────────────┐  │          │  ┌────────────────┐   │
│  │ Document      │  │          │  │ Ingestion      │   │
│  │ Agent         │  │          │  │ Agent          │   │
│  └───────────────┘  │          │  └────────────────┘   │
│  ┌───────────────┐  │          │  ┌────────────────┐   │
│  │ Notification  │  │          │  │ Legacy         │   │
│  │ Agent         │  │          │  │ Companion      │   │
│  └───────────────┘  │          │  └────────────────┘   │
└──────────┬──────────┘          └──────────┬────────────┘
           │                                │
           ▼                                ▼
┌─────────────────────────────────────────────────────────┐
│                     OUTPUT LAYER                         │
│  Task Dashboard · Drafted Docs · Legacy Portal · Chat   │
└─────────────────────────────────────────────────────────┘
```

---

## Agent Breakdown

### 1. Orchestrator Agent
**Framework:** LangChain.js state machine  
**Role:** The central brain. Receives all inputs, assesses urgency, maintains the master task state, and delegates to sub-agents.

**Responsibilities:**
- Parses uploaded documents to extract key profile data (accounts, insurance policies, assets)
- Classifies tasks by urgency: `CRITICAL` (legal deadlines) → `HIGH` (financial) → `STANDARD` → `MEMORY`
- Maintains a persistent state graph across sessions
- Surfaces the daily action queue to the family dashboard

**Key tools:** `classify_task`, `update_state`, `route_to_agent`, `schedule_reminder`

---

### 2. Document Agent
**Role:** Drafts, fills, and manages all legal and administrative documents.

**Responsibilities:**
- Extracts relevant data from uploaded files (account numbers, policy IDs, dates)
- Selects the correct document template from a library of 50+ forms (India-specific: death certificate, legal heir certificate, EPFO nomination, ITR filing)
- Uses Claude API to draft personalised cover letters and notices
- Outputs print-ready PDFs with a one-click approval mechanism

**Supported document types:**
- Bank account closure / nominee transfer letters
- Insurance claim initiation letters
- Legal heir certificates (state-specific)
- EPF/EPS withdrawal forms
- Aadhaar/PAN deactivation requests
- Property mutation applications
- Digital account memorialisation / deletion requests (Google, Meta, Apple)

**Key tools:** `extract_document_data`, `fill_template`, `draft_letter`, `generate_pdf`, `await_approval`

---

### 3. Notification Agent
**Role:** Tracks, drafts, and manages outbound communications to institutions.

**Responsibilities:**
- Maintains a registry of all institutions that need to be notified
- Drafts institution-specific notification emails and letters
- Tracks response status (notified → acknowledged → resolved)
- Sends automated follow-up reminders for unacknowledged notifications
- Supports bulk drafting across all financial institutions simultaneously

**Status tracking states:**
```
PENDING → DRAFTED → APPROVED → SENT → ACKNOWLEDGED → RESOLVED
```

**Key tools:** `build_institution_registry`, `draft_notification`, `track_status`, `send_followup`

---

### 4. Memory Ingestion Agent
**Role:** Transforms raw personal data into a structured, queryable memory graph.

**Responsibilities:**
- **Voice processing:** Transcribes audio using Whisper, extracts named entities, dates, emotions, and topics
- **Chat processing:** Parses WhatsApp/Telegram exports, identifies meaningful conversations, filters noise
- **Photo processing:** Uses vision model to caption photos, identify people, extract dates and locations from EXIF
- **Document processing:** OCRs handwritten letters, extracts structured data from scanned documents
- **Graph building:** Creates a Neo4j-compatible knowledge graph of memories, relationships, and life events

**Supported input formats:**
- `.zip` WhatsApp/Telegram chat exports
- `.m4a`, `.mp3`, `.wav`, `.ogg` voice memos
- `.jpg`, `.png`, `.heic` photo albums
- `.pdf` scanned letters and documents
- `.mp4` video messages (audio transcription)

**Key tools:** `transcribe_audio`, `parse_chat_export`, `caption_image`, `ocr_document`, `build_memory_graph`, `embed_and_store`

---

### 5. Legacy Companion Agent
**Role:** Conversational interface over the memory graph — the "Ask them" layer.

**Responsibilities:**
- Receives natural language questions from family members
- Performs semantic search over the vector store (Pinecone/Chroma)
- Retrieves the most relevant memory chunks
- Generates grounded responses citing the exact source
- Plays back original audio or shows original photos where available
- **Hard guardrail:** If confidence score < threshold, responds with "I couldn't find a clear answer to that in [Name]'s data" — never invents

**Example queries:**
```
"What did Dad think about us moving to Bangalore?"
"Does Nani have a recipe for kheer anywhere?"
"What was Papa's advice about buying a house?"
"Did Dadi ever talk about her childhood in Lahore?"
```

**Key tools:** `semantic_search`, `retrieve_context`, `generate_response`, `cite_source`, `retrieve_media`

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **LLM** | Claude 3.5 Sonnet (Anthropic) | Reasoning, drafting, conversation |
| **Agent framework** | LangChain.js + LangGraph.js | Multi-agent orchestration & state management |
| **Voice transcription** | OpenAI Whisper API | Audio → text conversion |
| **Vector database** | Pinecone / Chroma | Semantic memory storage & retrieval |
| **Embeddings** | `text-embedding-3-small` | Memory chunk embedding |
| **Document processing** | pdf-parse, Tesseract.js | PDF parsing & OCR |
| **PDF generation** | PDFKit + Handlebars | Filled document output |
| **Image captioning** | Claude Vision | Photo understanding |
| **Framework** | Next.js 14 (App Router) | Full-stack — UI + API routes in one project |
| **Styling** | Tailwind CSS | Dashboard & chat UI |
| **Database** | PostgreSQL + Prisma ORM | Task state & user data |
| **File storage** | AWS S3 / local MinIO | Uploaded media storage |
| **Voice synthesis** | ElevenLabs (optional) | Voice playback of responses |
| **Auth** | Clerk (Next.js native) | Family member access control |

---

## Project Structure

With Next.js 14 (App Router), the frontend and backend live in **one project**. API routes replace Express — no separate server needed.

```
griefbridge/
├── README.md
├── .env.local                             # Environment variables
├── package.json
├── next.config.js
├── tailwind.config.js
├── prisma/
│   └── schema.prisma                      # DB schema (Task, Memory, User)
│
├── app/                                   # Next.js App Router root
│   ├── layout.js                          # Root layout (auth wrapper, nav)
│   ├── page.js                            # Landing / onboarding page
│   │
│   ├── dashboard/
│   │   └── page.js                        # Task dashboard (Executor Track)
│   │
│   ├── documents/
│   │   ├── page.js                        # Document list & approval UI
│   │   └── [id]/
│   │       └── page.js                    # Single document review page
│   │
│   ├── notifications/
│   │   └── page.js                        # Institution tracker
│   │
│   ├── legacy/
│   │   ├── page.js                        # Memory portal overview
│   │   └── chat/
│   │       └── page.js                    # Legacy Companion chat
│   │
│   └── api/                               # API Routes (replaces Express)
│       ├── tasks/
│       │   ├── route.js                   # GET /api/tasks
│       │   └── [id]/
│       │       ├── route.js               # GET, PATCH /api/tasks/:id
│       │       └── approve/
│       │           └── route.js           # PATCH /api/tasks/:id/approve
│       ├── documents/
│       │   ├── route.js                   # POST /api/documents/draft
│       │   └── [id]/
│       │       ├── route.js               # GET /api/documents/:id
│       │       └── approve/
│       │           └── route.js           # POST /api/documents/:id/approve
│       ├── memory/
│       │   ├── ingest/
│       │   │   └── route.js               # POST /api/memory/ingest
│       │   ├── status/
│       │   │   └── route.js               # GET /api/memory/status
│       │   └── graph/
│       │       └── route.js               # GET /api/memory/graph
│       └── companion/
│           ├── chat/
│           │   └── route.js               # POST /api/companion/chat
│           └── history/
│               └── route.js               # GET /api/companion/history
│
├── agents/                                # AI agent logic (server-side only)
│   ├── orchestrator.js                    # LangChain.js orchestrator
│   ├── documentAgent.js                   # Document drafting agent
│   ├── notificationAgent.js               # Institution notification agent
│   ├── ingestionAgent.js                  # Memory ingestion agent
│   └── companionAgent.js                  # Legacy companion chat agent
│
├── tools/                                 # Agent tools
│   ├── documentTools.js                   # PDF fill, template, OCR
│   ├── audioTools.js                      # Whisper transcription
│   ├── chatParser.js                      # WhatsApp/Telegram export parser
│   ├── imageTools.js                      # Vision captioning, EXIF
│   ├── memoryTools.js                     # Embedding, vector store ops
│   └── notificationTools.js               # Email/letter drafting
│
├── components/                            # Shared UI components
│   ├── TaskCard.jsx
│   ├── CompanionChat.jsx
│   ├── MemoryGraph.jsx
│   └── ApprovalModal.jsx
│
├── templates/                             # Document templates
│   ├── bankClosure.hbs
│   ├── insuranceClaim.hbs
│   ├── legalHeir.hbs
│   └── ... (50+ templates)
│
├── lib/                                   # Shared utilities
│   ├── prisma.js                          # Prisma client singleton
│   ├── pinecone.js                        # Vector DB client
│   └── anthropic.js                       # Claude API client
│
└── data/
    ├── sample/                            # Sample data for demo
    │   ├── voice_memos/
    │   ├── chat_export.zip
    │   └── sample_documents/
    └── institutionRegistry.json           # Institutions & contact database
```

---

## Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+

### 1. Clone the repository
```bash
git clone https://github.com/your-team/griefbridge.git
cd griefbridge
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your API keys (see Environment Variables section)
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up the database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the application
```bash
npm run dev
```

Open `http://localhost:3000` in your browser. That's it — Next.js serves both the UI and API routes from one command.

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# LLM
ANTHROPIC_API_KEY=sk-ant-...

# Voice transcription
OPENAI_API_KEY=sk-...          # Used for Whisper + embeddings

# Vector database
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=griefbridge-memories

# Database (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/griefbridge

# File storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=griefbridge-uploads

# Auth (Clerk — Next.js native)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard

# Optional — voice synthesis
ELEVENLABS_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Running the Application

### Ingest sample data (demo mode)
```bash
node scripts/loadDemoData.js
```
This loads the fictional "Sharma family" dataset included in `data/sample/` — pre-populated voice memos, WhatsApp export, and documents ready for demo.

### Run the agent pipeline manually
```bash
node agents/orchestrator.js --mode=demo
```

### Build for production
```bash
npm run build
npm start
```

### Run tests
```bash
npm test
```

---

## API Reference

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get full task checklist |
| `GET` | `/api/tasks/{id}` | Get single task details |
| `PATCH` | `/api/tasks/{id}/approve` | Approve a drafted action |
| `PATCH` | `/api/tasks/{id}/status` | Update task status |

### Documents

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/draft` | Trigger document drafting for a task |
| `GET` | `/api/documents/{id}` | Download drafted document |
| `POST` | `/api/documents/{id}/approve` | Approve & mark ready-to-send |

### Memory Ingestion

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/memory/ingest` | Upload files for ingestion |
| `GET` | `/api/memory/status` | Check ingestion progress |
| `GET` | `/api/memory/graph` | Get memory graph summary |

### Legacy Companion

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/companion/chat` | Send a message to the companion |
| `GET` | `/api/companion/history` | Get conversation history |

---

## Demo Walkthrough

For hackathon judges or first-time users, here is the full 5-minute demo flow:

**Step 1 — Upload the data package**
Navigate to the Ingestion tab. Upload the contents of `data/sample/` — a WhatsApp export ZIP, 3 voice memos, a photo album, and a scanned will. Watch the memory graph populate in real time.

**Step 2 — Review the task dashboard**
The Orchestrator surfaces a prioritised checklist: 7 critical tasks (legal deadlines), 12 standard tasks, 4 memory-related items. The death certificate window is 15 days — it appears at the top in red.

**Step 3 — Draft a legal document**
Click "Draft SBI bank closure letter." The Document Agent fills the letter in ~8 seconds using account details extracted from the uploaded bank statement. Review the pre-filled draft. Click Approve to mark it ready to print and send.

**Step 4 — Query the Legacy Portal**
Navigate to the Legacy tab. Type: *"What did Papa think about my career choice?"* — The Companion retrieves a specific voice memo from March 2021 and a WhatsApp message from 2023, displays the transcript, and offers to play back the original audio.

**Step 5 — Ask for a recipe**
Type: *"What was Dadi's recipe for gajar ka halwa?"* — System returns a scanned handwritten recipe card, OCR'd and displayed alongside the original image.

---

## Ethical Guardrails

GriefBridge is built with the following non-negotiable ethical principles:

| Guardrail | Implementation |
|---|---|
| **Human-in-the-loop** | No document is ever sent or filed without explicit user approval. The system drafts; humans decide. |
| **No hallucination** | The Legacy Companion only answers from ingested data. If confidence < 0.75, it explicitly states it couldn't find a clear answer. |
| **Source transparency** | Every companion response cites its exact source with a timestamp. |
| **Data privacy** | All data is stored in the user's private cloud instance. It is never used for model training. |
| **Access control** | A designated estate administrator controls which family members can access which data. |
| **Honest framing** | The Legacy Companion is clearly framed as a memory archive, not a simulation of the person. |

---

## Roadmap

- [ ] WhatsApp Business API integration for direct institution notifications
- [ ] Multi-language support (Hindi, Bengali, Tamil, Telugu)
- [ ] Mobile app (React Native) for field document scanning
- [ ] Integration with DigiLocker for instant government document retrieval
- [ ] Lawyer marketplace for tasks requiring professional help
- [ ] Encrypted family data vault with time-locked memory releases ("open on their birthday")
- [ ] Cross-border support (NRI estate handling, international bank notifications)

---

## Contributing

We welcome contributions. Please read `CONTRIBUTING.md` before submitting a pull request.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then submit a PR to main
```

---

## Team & Task Division

GriefBridge is split across four clear ownership areas so team members can work in parallel with minimal conflicts. Each person owns specific files, routes, and agents.

---

### 👤 Person 1 — Agent Architect & Backend Logic

**Owns:** `agents/`, `tools/`, `lib/`

**Responsibilities:**
- Build and wire up all 5 LangChain.js agents (`orchestrator.js`, `documentAgent.js`, `notificationAgent.js`, `ingestionAgent.js`, `companionAgent.js`)
- Implement all agent tools in `tools/` — document fill, Whisper transcription, chat parser, image captioning, memory embedding
- Set up `lib/anthropic.js` (Claude client), `lib/pinecone.js` (vector DB), `lib/prisma.js` (DB singleton)
- Design and test the LangGraph orchestration state machine
- Write `scripts/loadDemoData.js` for demo ingestion

**Key files:**
```
agents/orchestrator.js
agents/documentAgent.js
agents/notificationAgent.js
agents/ingestionAgent.js
agents/companionAgent.js
tools/audioTools.js
tools/chatParser.js
tools/imageTools.js
tools/memoryTools.js
lib/anthropic.js
lib/pinecone.js
```

**Deliverable by demo:** All 5 agents running end-to-end on sample data with console output showing reasoning steps.

---

### 👤 Person 2 — Executor Track (Documents & Notifications)

**Owns:** `app/api/tasks/`, `app/api/documents/`, `app/api/notifications/`, `tools/documentTools.js`, `tools/notificationTools.js`, `templates/`

**Responsibilities:**
- Build all API routes for tasks and documents (`/api/tasks`, `/api/documents`)
- Implement `documentTools.js` — PDF template filling with PDFKit + Handlebars, OCR with Tesseract.js
- Build the 10 most important document templates in `templates/` (bank closure, insurance claim, legal heir, EPF, Aadhaar deactivation)
- Build `notificationTools.js` — institution registry lookup, email/letter draft generation
- Set up Prisma schema and migrations for `Task` and `Document` models
- Write the institution registry JSON (`data/institutionRegistry.json`)

**Key files:**
```
app/api/tasks/route.js
app/api/tasks/[id]/route.js
app/api/tasks/[id]/approve/route.js
app/api/documents/route.js
app/api/documents/[id]/route.js
app/api/documents/[id]/approve/route.js
tools/documentTools.js
tools/notificationTools.js
templates/ (all .hbs files)
prisma/schema.prisma
data/institutionRegistry.json
```

**Deliverable by demo:** Working `/api/documents/draft` endpoint that returns a filled, downloadable SBI bank closure letter PDF in under 10 seconds.

---

### 👤 Person 3 — Memory Track (Ingestion & Companion)

**Owns:** `app/api/memory/`, `app/api/companion/`, `agents/ingestionAgent.js`, `agents/companionAgent.js`

**Responsibilities:**
- Build all API routes for memory ingestion and companion chat
- Implement the full ingestion pipeline: file upload → Whisper transcription → chat parsing → image captioning → chunking → embedding → Pinecone upsert
- Build the Legacy Companion RAG pipeline: query → semantic search → context retrieval → Claude response → source citation
- Implement the zero-hallucination guardrail (confidence threshold check)
- Set up Prisma `Memory` model and vector store index
- Process the sample data package (voice memos, WhatsApp export, photos) into a working demo vector store

**Key files:**
```
app/api/memory/ingest/route.js
app/api/memory/status/route.js
app/api/memory/graph/route.js
app/api/companion/chat/route.js
app/api/companion/history/route.js
agents/ingestionAgent.js
agents/companionAgent.js
```

**Deliverable by demo:** Working `/api/companion/chat` endpoint that answers "What did Papa think about my career?" with a cited answer from the sample voice memo.

---

### 👤 Person 4 — Frontend & UX

**Owns:** `app/` (all page files), `components/`, styling

**Responsibilities:**
- Build all 5 Next.js pages: Landing (`/`), Dashboard (`/dashboard`), Documents (`/documents`), Notifications (`/notifications`), Legacy Portal (`/legacy`, `/legacy/chat`)
- Build shared components: `TaskCard.jsx`, `CompanionChat.jsx`, `MemoryGraph.jsx`, `ApprovalModal.jsx`
- Integrate Clerk auth — wrap layout with `<ClerkProvider>`, protect routes
- Wire all pages to the API routes built by Persons 2 & 3 using `fetch` / SWR
- Build the file upload UI for memory ingestion (drag & drop ZIP, audio, photos)
- Make the demo look polished — this is what judges see

**Key files:**
```
app/layout.js
app/page.js
app/dashboard/page.js
app/documents/page.js
app/documents/[id]/page.js
app/notifications/page.js
app/legacy/page.js
app/legacy/chat/page.js
components/TaskCard.jsx
components/CompanionChat.jsx
components/MemoryGraph.jsx
components/ApprovalModal.jsx
tailwind.config.js
```

**Deliverable by demo:** A fully clickable UI that walks through the 5-step demo flow without any broken states or unstyled pages.

---

### Collaboration Map

```
Person 1 (Agents)  ──────────────────────────────────────┐
                                                          │ feeds
Person 2 (Executor APIs) ──► /api/tasks, /api/documents  ┤
                                                          │ consumed by
Person 3 (Memory APIs)  ──► /api/memory, /api/companion  ┤
                                                          │
Person 4 (Frontend) ─────────────────────────────────────┘
```

**Sync points (do these together):**
- `prisma/schema.prisma` — agree on models before anyone writes DB queries
- `lib/` clients — Person 1 sets these up first; everyone imports from here
- API response shapes — Persons 2 & 3 define the JSON contracts; Person 4 codes to them

---

## Team

Built with care at [Hackathon Name] — [Date]

| Name | Role |
|---|---|
| — | Agent Architect & Backend Logic |
| — | Executor Track (Documents & Notifications) |
| — | Memory Track (Ingestion & Companion) |
| — | Frontend & UX |

---

## License

MIT License — see `LICENSE` for details.

---

> *GriefBridge does not replace grief counsellors, lawyers, or the irreplaceable comfort of family. It removes the paperwork so that those things can take centre stage.*