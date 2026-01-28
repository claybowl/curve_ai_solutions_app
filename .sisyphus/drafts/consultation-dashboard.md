# Draft: Authenticated Consultation Dashboard

## Initial Requirements (User Stated)

### Core Features
1. **User Profile** - Unique to each user account
   - General information about the user
   - Assessment scores
   - History of interactions with the "bored room" (board room?)

2. **Private Messaging** - Chat between consultant and client
   - One-on-one private messages

3. **Video Chat** - Minimalist with essential controls
   - Mute feature
   - Audio/video toggle options
   - Could use E2B or traditional approach

4. **E2B Sandbox Viewport** - Collaborative coding environment
   - Viewable by both parties (consultant + client)
   - Spin up sandbox with logs
   - Claude Code preconfigured
   - Generate code downloadable by client

5. **File Upload/Download** - Secure file sharing
   - Upload files for download
   - Could use E2B for security

6. **AI Chatbot** - Embedded and visible to both parties
   - Shared AI assistant during consultation

7. **Consultation Summaries** - Record keeping
   - Store summaries of each consultation

8. **Additional Features** - TBD based on recommendations

## Clarified Requirements (from user interview)

### Terminology
- **"Bored Room"** - A playful name! Likely a waiting/lobby area or lounge feature

### Video Chat
- **Traditional WebRTC** preferred (faster implementation)
- Need to clarify: recording, screen sharing

### E2B Integration
- **Has E2B API key** ✅
- Need to clarify: persistence, preconfigured stacks

### Consultation Flow
- **ALL modes**: Scheduled appointments + On-demand instant + Async messaging
- Very comprehensive - needs flexible architecture

## Clarified Requirements (Continued)

### Board Room
- **Virtual Waiting Room** - Clients wait before consultation starts
- **Social Lounge** - Clients can interact with each other (community feature)
- Name changed from "Bored Room" joke to professional "Board Room"

### E2B Sandbox
- **Control Mode**: Handoff mode - consultant can grant/take control
- **Tech Stack Preconfigured**:
  - Next.js, React, TypeScript, Tailwind
  - Node.js
  - Claude Code (CLI)
  - Claude SDK
  - bash, curl, git
- Need to clarify: persistence (ephemeral vs saved sessions)

### AI Chatbot
- **Context-aware**: Can see consultation history, sandbox output, shared files
- Uses existing AI infrastructure
- **NOT** active participant - more of a knowledgeable assistant

## Fully Clarified Requirements ✅

### Video Chat
- **Screen sharing**: YES ✅
- **Recording**: NO (keep it simple)
- Group calls or 1-on-1: Assumed 1-on-1 (consultant-client)

### E2B Integration
- **Persistence**: Persistent with timeout (stays alive X hours after session)
- **Control**: Handoff mode
- **Tech Stack**: Next.js/React/TypeScript/Tailwind/Node.js + Claude Code + Claude SDK + bash/curl/git

### File Sharing
- Size limits, types, retention: Will recommend sensible defaults
- Use E2B for security where possible

### Security & Privacy
- Will recommend best practices
- Admin access: Assume full access for consultant

### Additional Complementary Features ✅
- **Whiteboard/canvas** - Collaborative drawing
- **Code playground** - Simple editor alongside E2B
- **Session notes** - Shared notepad
- **Calendar integration** - Google/Outlook sync

### Consultation Flow
- **Scheduled appointments** ✅
- **On-demand/Instant** ✅
- **Async messaging** ✅
- All three modes supported

---

## Architecture Overview

### Core Modules
1. **User Profile Enhancement** - Extended profile with consultation history
2. **Board Room** - Waiting room + social lounge
3. **Consultation Room** - Main meeting interface
4. **Video Chat** - WebRTC with screen sharing
5. **Private Messaging** - Async chat between sessions
6. **E2B Sandbox** - Collaborative coding environment
7. **AI Chatbot** - Context-aware assistant
8. **File Manager** - Secure upload/download
9. **Consultation Summaries** - Session notes and records
10. **Calendar Integration** - Scheduling system
11. **Whiteboard** - Collaborative drawing
12. **Code Playground** - Simple in-browser editor

### Tech Stack Decisions
- **Video**: WebRTC (SimpleWebRTC or Daily.co)
- **Real-time**: Socket.io or Supabase Realtime
- **E2B**: @e2b/sdk for sandbox management
- **AI**: Existing AI infrastructure + context injection
- **Files**: E2B for security + standard upload for quick shares
- **Whiteboard**: tldraw or excalidraw integration
- **Calendar**: Google Calendar API + Outlook Graph API

### Database Schema Additions Needed
- consultation_sessions
- consultation_messages
- consultation_summaries
- sandbox_sessions
- file_uploads
- whiteboard_snapshots
- video_call_logs
- board_room_posts (social lounge)

## Existing Infrastructure

From exploration:
- Has dashboard at `/dashboard` with components for ActivityFeed, ConsultationCenter, etc.
- Has profile page at `/profile`
- Has API chat route at `/api/chat`
- Uses Supabase Auth
- Has assessment system already
- Neon PostgreSQL database

## Technical Considerations

**Real-time Communication Options:**
1. WebSockets (Socket.io) for chat/video signaling
2. WebRTC for P2P video
3. Supabase Realtime for chat sync
4. E2B for sandbox + potentially video

**E2B Integration:**
- Sandbox management API
- File upload/download through sandbox
- Log streaming to viewport

**Database Schema Needs:**
- Consultation sessions table
- Messages table (private chat)
- Sandbox sessions table
- File uploads table
- Consultation summaries table
- Video call logs (if recording)

**UI Components Needed:**
- Video call interface
- Chat interface (shared + private)
- Sandbox viewport
- File manager
- AI chatbot panel
- Consultation notes/summary editor
