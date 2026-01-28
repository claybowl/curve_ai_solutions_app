# Consultation Dashboard Platform

## TL;DR

> **Quick Summary**: Build a unified authenticated consultation platform with real-time video chat, collaborative E2B coding sandbox, AI assistance, and social features for conducting client meetings.
> 
> **Deliverables**:
> - Enhanced user profiles with consultation history
> - Board Room (waiting area + social lounge)
> - Consultation rooms with WebRTC video, screen sharing, and private chat
> - E2B sandbox integration with handoff control
> - Context-aware AI chatbot
> - File sharing with security
> - Consultation summaries and notes
> - Calendar integration (Google/Outlook)
> - Collaborative whiteboard
> - Code playground
> 
> **Estimated Effort**: XL (6-8 weeks)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Database Schema → Real-time Infrastructure → Video → E2B Integration → Consultation Room UI

---

## Context

### Original Request
Create an authenticated dashboard for conducting consultation meetings. Each user should have a unique profile with general information, assessment scores, and interaction history. Features include: private messaging, minimalist video chat with controls, E2B sandbox viewport for collaborative coding, file uploads, embedded AI chatbot visible to both parties, and consultation summaries.

### Interview Summary

**Key Discussions**:
- **"Bored Room"** was a joke - changed to professional **"Board Room"** serving as waiting room + social lounge
- **Video**: Traditional WebRTC preferred over E2B-based
- **E2B**: User has API key already ✅
- **Consultation modes**: Support ALL three - scheduled appointments, on-demand instant, AND async messaging
- **Sandbox control**: Handoff mode (consultant can grant/take control)
- **Tech stack**: Next.js/React/TypeScript/Tailwind/Node.js + Claude Code + Claude SDK + bash/curl/git
- **AI Chatbot**: Context-aware (sees history, sandbox, files) but NOT active participant
- **Persistence**: Sandboxes persistent with timeout (stay alive X hours after session)
- **Video features**: Screen sharing YES, recording NO
- **Additional features**: Whiteboard, code playground, session notes, calendar integration

### Research Findings

**Existing Infrastructure**:
- Dashboard exists at `/dashboard` with assessment data, tools, prompts, consultation center
- User profiles at `/profile` with personal info, contact details, security settings
- Consultation system with status tracking (scheduled, in_progress, in_review)
- Supabase Auth with user metadata
- Activity feed and notifications already implemented
- Neon PostgreSQL database

**Patterns to Follow**:
- Server actions pattern in `app/actions/*-actions.ts`
- Glass-panel design system from `components/donjon/`
- Authentication via `@/lib/supabase-server`
- Database queries via `@/lib/db`

---

## Work Objectives

### Core Objective
Build a comprehensive consultation platform that enables seamless consultant-client interactions through real-time communication, collaborative coding, AI assistance, and persistent session management.

### Concrete Deliverables

**Database Layer**:
- `consultation_sessions` table
- `consultation_messages` table (private chat)
- `consultation_summaries` table
- `sandbox_sessions` table (E2B session tracking)
- `file_uploads` table
- `whiteboard_snapshots` table
- `video_call_logs` table
- `board_room_posts` table (social lounge)
- `calendar_connections` table (OAuth tokens)

**Server Actions**:
- `consultation-actions.ts` - CRUD for consultations
- `message-actions.ts` - Private messaging
- `sandbox-actions.ts` - E2B sandbox management
- `file-actions.ts` - Secure file handling
- `whiteboard-actions.ts` - Whiteboard persistence
- `calendar-actions.ts` - Calendar sync

**API Routes**:
- `/api/socket` - Socket.io server for real-time features
- `/api/e2b` - E2B sandbox proxy
- `/api/video` - Video signaling (if needed beyond WebRTC)

**UI Components**:
- `EnhancedProfile` - Extended profile view with history
- `BoardRoom` - Waiting area + social lounge
- `ConsultationRoom` - Main meeting interface
- `VideoChat` - WebRTC video with controls
- `PrivateChat` - Async messaging interface
- `SandboxViewport` - E2B terminal/output viewer
- `AIChatbot` - Context-aware chat panel
- `FileManager` - Upload/download interface
- `ConsultationSummary` - Notes editor
- `CalendarConnect` - OAuth + availability picker
- `Whiteboard` - Collaborative drawing canvas
- `CodePlayground` - Simple Monaco/CodeMirror editor

**Pages**:
- `/consultation/room/[id]` - Active consultation room
- `/board-room` - Social lounge and waiting area
- `/consultations/history` - Past sessions list
- `/profile/consultations` - User's consultation history

### Definition of Done

**Functional Requirements**:
- [ ] User can view enhanced profile with consultation history
- [ ] User can enter Board Room and see other waiting clients
- [ ] User can initiate/join video call with screen sharing
- [ ] User can exchange private messages (real-time and async)
- [ ] Consultant can spin up E2B sandbox viewable by both parties
- [ ] Control can be handed off between consultant and client in sandbox
- [ ] AI chatbot responds with context from current session
- [ ] Files can be uploaded and downloaded securely
- [ ] Consultation summaries can be created and viewed
- [ ] Calendar shows availability and syncs with Google/Outlook
- [ ] Whiteboard supports collaborative drawing
- [ ] Code playground allows quick snippet testing

**Technical Requirements**:
- [ ] All database migrations run successfully
- [ ] Socket.io handles real-time messaging
- [ ] WebRTC establishes peer-to-peer video
- [ ] E2B SDK manages sandboxes with proper lifecycle
- [ ] AI chatbot receives context injection
- [ ] Files uploaded through E2B or secure direct upload
- [ ] Calendar OAuth flow completes successfully

### Must Have
- Real-time private messaging between consultant and client
- WebRTC video chat with mute/unmute and video toggle
- Screen sharing capability
- E2B sandbox integration with handoff control
- Context-aware AI chatbot
- Secure file upload/download
- Consultation summary creation and storage
- Board Room social lounge
- Enhanced user profiles with consultation history

### Must NOT Have (Guardrails)
- Video recording (explicitly excluded)
- Group video calls (1-on-1 only for MVP)
- End-to-end encryption (rely on HTTPS/WebRTC encryption)
- Complex permission systems (consultant has full access, client limited)
- Multiple concurrent sandboxes per session
- Automatic code generation without human review
- Public board room posts (authenticated users only)

---

## Verification Strategy

### Test Infrastructure Assessment

**Current State**: No test framework configured
**Decision**: Manual verification with detailed QA procedures

### Manual QA Procedures

**By Feature**:

| Feature | Verification Steps |
|---------|-------------------|
| **Enhanced Profile** | Navigate to `/profile`, verify consultation history tab shows past sessions |
| **Board Room** | Visit `/board-room`, verify can see other online users, post messages |
| **Video Chat** | Start consultation, verify video/audio connection, test mute/video toggle, verify screen sharing |
| **Private Messaging** | Send message in consultation room, verify real-time delivery, refresh page verify persistence |
| **E2B Sandbox** | Click "Start Sandbox", verify terminal appears, test handoff control button, verify code execution |
| **AI Chatbot** | Ask question in consultation, verify response references session context |
| **File Upload** | Upload file in consultation, verify other party can download, verify virus scan |
| **Consultation Summary** | End consultation, write summary, verify saved and viewable in history |
| **Calendar** | Connect Google calendar, verify availability shows, book consultation, verify appears in calendar |
| **Whiteboard** | Open whiteboard, draw shape, verify other party sees it, verify save/restore |
| **Code Playground** | Type code, run it, verify output, share to sandbox |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation - Week 1):
├── Task 1: Database Schema Design
├── Task 2: Real-time Infrastructure (Socket.io setup)
└── Task 3: E2B SDK Integration Setup

Wave 2 (Core Features - Week 2):
├── Task 4: Enhanced User Profile
├── Task 5: Private Messaging System
└── Task 6: Board Room (Social Lounge)

Wave 3 (Video & Chat - Week 3):
├── Task 7: WebRTC Video Implementation
└── Task 8: Context-Aware AI Chatbot

Wave 4 (Sandbox & Files - Week 4):
├── Task 9: E2B Sandbox Viewport with Handoff
└── Task 10: Secure File Manager

Wave 5 (Advanced Features - Weeks 5-6):
├── Task 11: Consultation Summaries
├── Task 12: Calendar Integration
├── Task 13: Whiteboard
└── Task 14: Code Playground

Wave 6 (Integration & Polish - Weeks 7-8):
├── Task 15: Consultation Room Assembly
├── Task 16: Testing & Bug Fixes
└── Task 17: Documentation
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 (Database) | None | 4,5,6,7,8,9,10,11 | 2, 3 |
| 2 (Socket.io) | None | 5,7 | 1, 3 |
| 3 (E2B Setup) | None | 9 | 1, 2 |
| 4 (Profile) | 1 | None | 5,6 |
| 5 (Messaging) | 1,2 | 8,15 | 4,6 |
| 6 (Board Room) | 1,2 | 15 | 4,5 |
| 7 (Video) | 2 | 15 | 8 |
| 8 (AI Chatbot) | 5 | 15 | 7 |
| 9 (Sandbox) | 1,3 | 15 | 10 |
| 10 (Files) | 1 | 15 | 9 |
| 11 (Summaries) | 1 | 15 | 12,13,14 |
| 12 (Calendar) | 1 | None | 11,13,14 |
| 13 (Whiteboard) | 1,2 | 15 | 11,12,14 |
| 14 (Code Playground) | None | 15 | 11,12,13 |
| 15 (Assembly) | 5,6,7,8,9,10,11,13,14 | None | 16,17 |
| 16 (Testing) | 15 | None | 17 |
| 17 (Documentation) | 15 | None | 16 |

### Critical Path

Database Schema → Socket.io → Private Messaging → AI Chatbot → Consultation Room Assembly

---

## TODOs

### Wave 1: Foundation (Week 1)

- [ ] 1. Database Schema Design

  **What to do**:
  - Create SQL migrations for all new tables
  - Define relationships and indexes
  - Set up Row Level Security (RLS) policies
  
  **Tables to create**:
  - `consultation_sessions` - id, consultant_id, client_id, status, started_at, ended_at, scheduled_at, type
  - `consultation_messages` - id, session_id, sender_id, content, type, created_at
  - `consultation_summaries` - id, session_id, summary, notes, created_by, created_at
  - `sandbox_sessions` - id, consultation_id, e2b_instance_id, status, created_at, expires_at
  - `file_uploads` - id, consultation_id, uploaded_by, filename, storage_path, size, mime_type, created_at
  - `whiteboard_snapshots` - id, consultation_id, snapshot_data, created_at
  - `video_call_logs` - id, consultation_id, started_at, ended_at, screen_shared
  - `board_room_posts` - id, author_id, content, created_at, reply_to_id
  - `calendar_connections` - id, user_id, provider, access_token, refresh_token, expires_at

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - Database design requires careful planning
  - **Skills**: Not critical, but `git-master` helpful for migration versioning
  - **Reasoning**: Database schema is foundational; mistakes here cascade

  **Parallelization**:
  - **Can Run In Parallel**: YES with Task 2 and 3
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 4,5,6,7,8,9,10,11
  - **Blocked By**: None

  **References**:
  - `supabase/migrations/` - Existing migration patterns
  - `lib/db.ts` - Database connection pattern
  - Supabase docs on RLS policies

  **Acceptance Criteria**:
  - [ ] All migration files created and tested
  - [ ] `npm run db:migrate` applies without errors
  - [ ] RLS policies prevent unauthorized access
  - [ ] Foreign key constraints defined

- [ ] 2. Real-time Infrastructure Setup

  **What to do**:
  - Set up Socket.io server
  - Create room management for consultations
  - Implement authentication middleware
  - Set up message broadcasting
  
  **Must NOT do**:
  - Don't use Socket.io for video (use WebRTC separately)
  - Don't broadcast to wrong rooms

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - Real-time systems are complex
  - **Skills**: None specifically, but experience with WebSockets needed
  - **Reasoning**: Room management and auth are critical security points

  **Parallelization**:
  - **Can Run In Parallel**: YES with Task 1 and 3
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 5,7
  - **Blocked By**: None

  **References**:
  - Socket.io documentation: https://socket.io/docs/v4/
  - `app/api/chat/route.ts` - Existing chat endpoint pattern
  - Next.js docs on custom servers (if needed)

  **Acceptance Criteria**:
  - [ ] Socket.io server running on separate port or `/api/socket`
  - [ ] Can connect with authentication token
  - [ ] Join room and receive messages
  - [ ] Disconnect and reconnect works

- [ ] 3. E2B SDK Integration Setup

  **What to do**:
  - Install `@e2b/sdk` package
  - Create E2B client wrapper
  - Set up API key configuration
  - Test basic sandbox creation
  
  **Must NOT do**:
  - Don't expose E2B API key to client
  - Don't create sandboxes without cleanup logic

  **Recommended Agent Profile**:
  - **Category**: `quick` - SDK integration is straightforward
  - **Skills**: None required
  - **Reasoning**: SDK has good docs, mostly configuration

  **Parallelization**:
  - **Can Run In Parallel**: YES with Task 1 and 2
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 9
  - **Blocked By**: None

  **References**:
  - E2B docs: https://e2b.dev/docs
  - `.env.local` - Add E2B_API_KEY

  **Acceptance Criteria**:
  - [ ] `npm install @e2b/sdk` completes
  - [ ] Can create sandbox from server action
  - [ ] Sandbox auto-cleans up after timeout
  - [ ] API key stored securely (server-side only)

### Wave 2: Core Features (Week 2)

- [ ] 4. Enhanced User Profile

  **What to do**:
  - Extend existing `/profile` page
  - Add "Consultation History" tab
  - Show assessment scores with visualizations
  - Display interaction history (Board Room posts, messages)
  
  **Must NOT do**:
  - Don't duplicate existing profile fields
  - Don't show other users' private data

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - UI-heavy task
  - **Skills**: `frontend-ui-ux`
  - **Reasoning**: Need to match existing design system and create visualizations

  **Parallelization**:
  - **Can Run In Parallel**: YES with 5,6
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `app/profile/page.tsx` - Existing profile page
  - `components/dashboard/AssessmentOverview.tsx` - Assessment display pattern
  - `components/ui/tabs.tsx` - Tab component

  **Acceptance Criteria**:
  - [ ] Navigate to `/profile` shows new tabs
  - [ ] Consultation history lists past sessions
  - [ ] Assessment scores displayed with progress bars
  - [ ] Responsive on mobile devices

- [ ] 5. Private Messaging System

  **What to do**:
  - Create message database table (from Task 1)
  - Build chat UI component
  - Integrate with Socket.io for real-time
  - Support async (load history) and real-time (new messages)
  
  **Must NOT do**:
  - Don't allow messaging outside of consultation context (for privacy)
  - Don't store messages without consultation_id

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Chat UI is complex
  - **Skills**: `frontend-ui-ux`
  - **Reasoning**: Chat interfaces need polished UX

  **Parallelization**:
  - **Can Run In Parallel**: YES with 4,6
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 8,15
  - **Blocked By**: Tasks 1,2

  **References**:
  - `app/api/chat/route.ts` - Existing chat API
  - `components/ui/scroll-area.tsx` - Scrollable chat area
  - Common chat UI patterns

  **Acceptance Criteria**:
  - [ ] Send message appears instantly in UI
  - [ ] Other participant receives in real-time
  - [ ] Scroll to bottom on new messages
  - [ ] Load message history on join

- [ ] 6. Board Room (Social Lounge)

  **What to do**:
  - Create `/board-room` page
  - Show online users list
  - Implement public posts (like a forum)
  - Support replies/threads
  
  **Must NOT do**:
  - Don't show users as "online" if inactive > 5 minutes
  - Don't allow anonymous posts

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Social features need good UX
  - **Skills**: `frontend-ui-ux`
  - **Reasoning**: Forum-style UI with real-time elements

  **Parallelization**:
  - **Can Run In Parallel**: YES with 4,5
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1,2

  **References**:
  - Discord/Slack UI patterns for inspiration
  - `components/ui/avatar.tsx` - User avatars

  **Acceptance Criteria**:
  - [ ] See list of online users
  - [ ] Post message visible to all in room
  - [ ] Can reply to posts
  - [ ] Posts persist (not just ephemeral chat)

### Wave 3: Video & AI (Week 3)

- [ ] 7. WebRTC Video Implementation

  **What to do**:
  - Choose WebRTC library (SimpleWebRTC, Daily.co, or Twilio)
  - Implement video component with mute/video toggle
  - Add screen sharing capability
  - Handle connection establishment and ICE
  
  **Must NOT do**:
  - Don't implement recording (explicitly excluded)
  - Don't support group calls (1-on-1 only)

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - WebRTC is notoriously complex
  - **Skills**: None specifically, but deep WebRTC knowledge needed
  - **Reasoning**: NAT traversal, signaling, error handling are hard

  **Parallelization**:
  - **Can Run In Parallel**: YES with 8
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 15
  - **Blocked By**: Task 2

  **References**:
  - SimpleWebRTC: https://github.com/simplewebrtc
  - Daily.co React hooks: https://docs.daily.co/reference/daily-react
  - WebRTC samples: https://webrtc.github.io/samples/

  **Acceptance Criteria**:
  - [ ] Video call establishes between two browsers
  - [ ] Mute/unmute audio works
  - [ ] Enable/disable video works
  - [ ] Screen sharing displays to other party
  - [ ] Call ends cleanly

- [ ] 8. Context-Aware AI Chatbot

  **What to do**:
  - Extend existing chatbot with consultation context
  - Inject session data: messages, sandbox output, files
  - Create system prompt that explains context
  - Stream responses like existing chat
  
  **Must NOT do**:
  - Don't make chatbot interrupt conversation
  - Don't share sensitive data in context

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - Context injection is nuanced
  - **Skills**: None specifically
  - **Reasoning**: Need to balance context window vs relevance

  **Parallelization**:
  - **Can Run In Parallel**: YES with 7
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1,2,5

  **References**:
  - `app/api/chat/route.ts` - Existing AI chat API
  - OpenAI/Anthropic docs on system prompts
  - Context window management strategies

  **Acceptance Criteria**:
  - [ ] Chatbot responds to queries
  - [ ] Response references current session context
  - [ ] Sandbox output mentioned if relevant
  - [ ] Shared files referenced when appropriate

### Wave 4: Sandbox & Files (Week 4)

- [ ] 9. E2B Sandbox Viewport with Handoff Control

  **What to do**:
  - Create sandbox management UI
  - Implement terminal output viewer
  - Build handoff control button ("Give Control" / "Take Control")
  - Preconfigure with Next.js/React/TypeScript/Claude Code
  
  **Must NOT do**:
  - Don't allow both parties to type simultaneously
  - Don't expose sandbox filesystem directly

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - Complex integration
  - **Skills**: None specifically
  - **Reasoning**: E2B integration + state management is tricky

  **Parallelization**:
  - **Can Run In Parallel**: YES with 10
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1,3

  **References**:
  - E2B docs: https://e2b.dev/docs
  - Terminal emulators: xterm.js
  - Claude Code CLI docs

  **Acceptance Criteria**:
  - [ ] Click "Start Sandbox" creates E2B instance
  - [ ] Terminal output streams to viewport
  - [ ] Handoff button changes control
  - [ ] Code changes can be downloaded

- [ ] 10. Secure File Manager

  **What to do**:
  - Build upload interface with drag-and-drop
  - Store files via E2B or secure direct upload
  - Implement download with virus scan
  - Show file list with metadata
  
  **Must NOT do**:
  - Don't allow executable files (.exe, .sh)
  - Don't store files indefinitely (set retention)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - UI component
  - **Skills**: `frontend-ui-ux`
  - **Reasoning**: File UI needs to be intuitive

  **Parallelization**:
  - **Can Run In Parallel**: YES with 9
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 15
  - **Blocked By**: Task 1

  **References**:
  - `components/ui/dropzone` or similar
  - Virus scanning APIs (ClamAV, VirusTotal)
  - File type validation libraries

  **Acceptance Criteria**:
  - [ ] Drag and drop file uploads
  - [ ] File appears in shared list
  - [ ] Other party can download
  - [ ] Invalid file types rejected

### Wave 5: Advanced Features (Weeks 5-6)

- [ ] 11. Consultation Summaries

  **What to do**:
  - Create summary editor (rich text or markdown)
  - Store summaries in database
  - Display in consultation history
  - Allow editing post-session

  **Recommended Agent Profile**:
  - **Category**: `quick` - Straightforward CRUD
  - **Skills**: None
  - **Reasoning**: Standard form + storage

  **Parallelization**:
  - **Can Run In Parallel**: YES with 12,13,14
  - **Parallel Group**: Wave 5
  - **Blocks**: Task 15
  - **Blocked By**: Task 1

  **References**:
  - Rich text editors: TipTap, Quill, Slate
  - `components/ui/textarea.tsx` - Basic editor

  **Acceptance Criteria**:
  - [ ] Write summary during/after consultation
  - [ ] View summary in history
  - [ ] Edit existing summary

- [ ] 12. Calendar Integration

  **What to do**:
  - Implement Google Calendar OAuth
  - Implement Outlook OAuth
  - Show availability picker
  - Create events when consultation scheduled

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - OAuth is complex
  - **Skills**: None specifically
  - **Reasoning**: OAuth flows, token refresh, error handling

  **Parallelization**:
  - **Can Run In Parallel**: YES with 11,13,14
  - **Parallel Group**: Wave 5
  - **Blocks**: None (can work independently)
  - **Blocked By**: Task 1

  **References**:
  - Google Calendar API: https://developers.google.com/calendar
  - Microsoft Graph API: https://docs.microsoft.com/en-us/graph/
  - NextAuth.js OAuth patterns

  **Acceptance Criteria**:
  - [ ] Connect Google calendar
  - [ ] Connect Outlook calendar
  - [ ] See availability slots
  - [ ] Scheduled consultation appears in calendar

- [ ] 13. Whiteboard

  **What to do**:
  - Integrate tldraw or Excalidraw
  - Sync drawings via Socket.io
  - Save snapshots to database
  - Load previous whiteboard state

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Complex canvas UI
  - **Skills**: `frontend-ui-ux`
  - **Reasoning**: Canvas-based UIs need performance tuning

  **Parallelization**:
  - **Can Run In Parallel**: YES with 11,12,14
  - **Parallel Group**: Wave 5
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1,2

  **References**:
  - tldraw: https://tldraw.dev/
  - Excalidraw: https://docs.excalidraw.com/
  - Canvas performance best practices

  **Acceptance Criteria**:
  - [ ] Draw shape on whiteboard
  - [ ] Other party sees it in real-time
  - [ ] Save whiteboard snapshot
  - [ ] Load previous snapshot

- [ ] 14. Code Playground

  **What to do**:
  - Integrate Monaco Editor or CodeMirror
  - Support multiple languages
  - Run code in isolated environment (or E2B)
  - Share code to sandbox

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Editor integration
  - **Skills**: `frontend-ui-ux`
  - **Reasoning**: Code editors have complex UX requirements

  **Parallelization**:
  - **Can Run In Parallel**: YES with 11,12,13
  - **Parallel Group**: Wave 5
  - **Blocks**: Task 15
  - **Blocked By**: None

  **References**:
  - Monaco Editor: https://microsoft.github.io/monaco-editor/
  - CodeMirror: https://codemirror.net/
  - WebContainers (StackBlitz) for in-browser execution

  **Acceptance Criteria**:
  - [ ] Type code in editor
  - [ ] Syntax highlighting works
  - [ ] Run code and see output
  - [ ] Share to E2B sandbox

### Wave 6: Integration & Polish (Weeks 7-8)

- [ ] 15. Consultation Room Assembly

  **What to do**:
  - Create `/consultation/room/[id]` page
  - Layout: Video | Chat + AI | Sandbox | Files | Whiteboard
  - Tab or split-pane interface
  - Integrate all components from previous tasks
  - Handle room join/leave lifecycle

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain` - Complex integration
  - **Skills**: `frontend-ui-ux`
  - **Reasoning**: Need to coordinate many moving parts

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential)
  - **Parallel Group**: Wave 6
  - **Blocks**: Tasks 16,17
  - **Blocked By**: Tasks 5,6,7,8,9,10,11,13,14

  **References**:
  - Layout patterns: Discord, VS Code, Figma
  - Resizable panels: react-resizable-panels

  **Acceptance Criteria**:
  - [ ] All components load in room
  - [ ] Video connects on join
  - [ ] Chat works immediately
  - [ ] Can start sandbox
  - [ ] Can open whiteboard
  - [ ] Layout responsive/adjustable

- [ ] 16. Testing & Bug Fixes

  **What to do**:
  - Test all user flows
  - Fix bugs discovered
  - Performance optimization
  - Cross-browser testing

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` - Thorough testing needed
  - **Skills**: None specifically
  - **Reasoning**: Need to systematically test everything

  **Parallelization**:
  - **Can Run In Parallel**: YES with 17
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: Task 15

  **Acceptance Criteria**:
  - [ ] All features from Definition of Done work
  - [ ] No console errors
  - [ ] Works in Chrome, Firefox, Safari
  - [ ] Mobile responsive where applicable

- [ ] 17. Documentation

  **What to do**:
  - Write user guide for clients
  - Document admin/consultant features
  - API documentation
  - Deployment notes

  **Recommended Agent Profile**:
  - **Category**: `writing` - Documentation task
  - **Skills**: None
  - **Reasoning**: Clear documentation is essential

  **Parallelization**:
  - **Can Run In Parallel**: YES with 16
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: Task 15

  **Acceptance Criteria**:
  - [ ] User guide covers all features
  - [ ] Admin guide explains consultant tools
  - [ ] API endpoints documented

---

## Environment Variables

Add to `.env.local`:

```bash
# E2B Configuration
E2B_API_KEY=your_e2b_api_key_here
E2B_SANDBOX_TIMEOUT_HOURS=24

# WebRTC (if using Daily.co)
DAILY_CO_API_KEY=your_daily_co_key
DAILY_CO_DOMAIN=your_domain.daily.co

# Or Twilio (alternative)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token

# Google Calendar OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Microsoft Outlook OAuth
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret

# AI Model (existing)
OPENAI_API_KEY=your_key
# or
ANTHROPIC_API_KEY=your_key
```

---

## Package Installation

```bash
# Real-time
npm install socket.io socket.io-client

# E2B
npm install @e2b/sdk

# WebRTC (choose one)
npm install @daily-co/daily-react
# OR
npm install simplewebrtc

# Whiteboard
npm install @tldraw/tldraw
# OR
npm install @excalidraw/excalidraw

# Code Editor
npm install @monaco-editor/react
# OR
npm install @uiw/react-codemirror

# Calendar
npm install googleapis @microsoft/microsoft-graph-client

# Utilities
npm install react-resizable-panels date-fns
```

---

## Success Criteria

### Verification Commands

```bash
# Database migrations
npm run db:migrate

# Dev server
npm run dev

# Build test
npm run build
```

### Final Checklist

- [ ] All 17 tasks completed
- [ ] All Must Have features present
- [ ] All Must NOT Have exclusions verified absent
- [ ] Environment variables documented
- [ ] User guide written
- [ ] Admin guide written
- [ ] Code reviewed
- [ ] No console errors in production build

---

## Additional Recommendations

### Sensible Defaults Applied

**File Uploads**:
- Max size: 50MB per file
- Allowed types: Images, documents, code files (no executables)
- Retention: 90 days after consultation ends

**Sandbox**:
- Timeout: 24 hours after last activity
- Auto-save: Code changes every 30 seconds
- Max concurrent sandboxes: 5 per consultant

**Chat History**:
- Retention: 1 year
- Exportable by client: YES
- Searchable: YES

**Video Calls**:
- Max duration: 4 hours
- Quality: Auto-adapt to connection
- Fallback: Audio-only if video fails

**Board Room**:
- Posts retention: 30 days
- Max posts per user per hour: 10 (anti-spam)

### Security Considerations

1. **Authentication**: All Socket.io connections must validate JWT
2. **Authorization**: Users can only access their own consultations
3. **File Uploads**: Virus scan all uploads, block executable types
4. **E2B**: Sandboxes isolated, no persistence of sensitive data
5. **Video**: WebRTC is encrypted, but no end-to-end guarantee
6. **Rate Limiting**: Prevent spam on Board Room and messaging

### Performance Optimizations

1. **Lazy Loading**: Load whiteboard and code playground on demand
2. **Virtualization**: Virtualize long message lists
3. **Debouncing**: Debounce whiteboard sync to reduce network traffic
4. **Caching**: Cache user profiles and consultation summaries
5. **CDN**: Serve static files from CDN in production

### Future Enhancements (Out of Scope)

- Recording and transcription
- Group consultations (3+ people)
- Mobile native apps
- AI-generated consultation summaries
- Integration with project management tools (Jira, Linear)
- Whiteboard templates
- Screen annotation/drawing on shared screen
