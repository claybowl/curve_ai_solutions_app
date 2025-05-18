# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Curve AI Solutions is a Next.js web application that offers AI consultation services, assessments, and tools. The platform includes user authentication, an admin dashboard, client-facing interfaces, and a blog section using Notion as a CMS.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Database Setup

The application uses PostgreSQL hosted on Neon.tech. To set up the database:

1. Create a `.env.local` file with your database credentials:

```
# Database connection 
DATABASE_URL=postgres://username:password@hostname/database?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://username:password@hostname/database?sslmode=require

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

2. Initialize the database schema using the SQL in `db-schema.sql`

## Core Architecture

### 1. Next.js App Router Structure

- Routes and pages are defined in the `/app` directory
- API endpoints are in `/app/api/`

### 2. Authentication System

- Uses NextAuth.js with JWT and a credentials provider
- Authentication logic in `/lib/auth.ts` and `/lib/auth-utils.ts`
- User roles: admin and client with role-based permissions

### 3. Database Layer

- PostgreSQL with Neon serverless driver
- Database utilities in `/lib/db.ts` and `/lib/db-safe.ts`
- Direct SQL queries with proper parameterization and error handling

### 4. Admin Dashboard

- Admin routes in `/app/admin/`
- User, consultation, and assessment management
- Stats and activity tracking

### 5. Client-Facing Features

- AI assessments and consultation requests
- Solutions showcase and prompt library
- User profiles and dashboard

### 6. Notion Blog Integration

- Blog content managed through Notion API
- Integration configured in `/lib/notion.ts`
- Requires Notion token and database ID in environment variables

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for JWT encryption
- `NEXTAUTH_URL`: Application URL

Optional for blog functionality:

- `NOTION_TOKEN`: Notion API integration token
- `NOTION_BLOG_DATABASE_ID`: ID of the Notion database for blog posts

## Deployment Process

The application is deployed on Vercel. Key deployment requirements:

- Node.js v18+
- Set all environment variables in Vercel project settings
- Database must be accessible from Vercel's deployment region

---------------------------------------------------------------------------
---------------------------------------------------------------------------

# Project Management

This section organizes the work being done on this project using Claude Code.

## To Do

- [x] Fix inconsistent Auth Methods:
  - You have multiple authentication mechanisms (NextAuth JWT, simple-admin-auth cookie, admin-token in localStorage) causing potential conflicts.
- [x] Database Schema missing tables:
  - Blog posts management
  - Prompt library items
  - AI tools
- [X] Set up 'Role & Permissions Management':
  - Your system has basic role definition but lacks granular permissions.
- [ ] Implement Notion Blog Integration:
  - Complete the setup for fetching and displaying blog content from Notion.
  - Ensure proper error handling and caching mechanisms are in place.
- [ ] Enhance User Dashboard:
  - Add features for users to view their activity, saved prompts, and consultation history.
  - Include visual analytics for user engagement with AI tools.
- [ ] Develop Solutions Showcase:
  - Create a dedicated page to display successful AI solutions and case studies.
  - Allow users to filter by industry or AI model used.
- [ ] Build Prompt Library:
  - Design a searchable and categorized library of prompts for various AI tasks.
  - Enable user contributions with moderation for quality control.
- [ ] Implement Server Actions for Admin Operations:
  - Create server actions for managing blog posts, prompts, permissions, and other admin-related data.
  - Ensure proper authorization checks are included in each action.
- [ ] Implement Admin Features in Phases:
  - [x] Phase 1: Consolidate authentication to use a single mechanism (NextAuth JWT)
  - [x] Phase 2: Add missing database tables for blog posts, prompts, and permissions
  - [x] Phase 3: Implement server actions for all admin operations
  - [x] Phase 4: Create comprehensive admin dashboards for each area
  - [X] Phase 5: Add fine-grained permission controls
- [ ] Link Aider with MCP, Claude Code, and Cursor (to save money on context output)

## Project Board

| Backlog | To Do | In Progress | Completed |
| ------- | ----- | ----------- | --------- |

## Session Summaries

### 2025-05-18: Responsive Admin Dashboard Implementation

Implemented comprehensive responsive design improvements across the admin dashboard:

1. **User Management Dashboard**:
   - Improved form dialogs for mobile devices
   - Enhanced table layouts with proper truncation
   - Made filters and search responsive

2. **Prompt Library Dashboard**:
   - Created responsive category sidebar
   - Optimized table for small screens
   - Improved prompt tag display

3. **Blog Management Dashboard**:
   - Enhanced table responsiveness
   - Optimized tag display
   - Improved dialog layouts

4. **AI Tools Dashboard**:
   - Made tools listing mobile-friendly
   - Improved category cards
   - Enhanced filter controls

5. **Admin Navigation**:
   - Created mobile slide-out sidebar with Sheet component
   - Maintained desktop sidebar for larger screens
   - Added hamburger menu toggle for mobile

6. **Admin Layout**:
   - Improved padding for mobile devices
   - Enhanced breadcrumb display
   - Better responsive spacing

All improvements follow mobile-first design principles and ensure a consistent user experience across desktop, tablet, and mobile devices.

## Ideas/Backlog

## Workflows/Guidelines

### How to Mark a Task as Complete

To mark a task as complete, change the checkbox from `[ ]` to `[x]`. For example:

```markdown
- [x] Completed task
```

### Moving Tasks Between Sections

When moving a task, cut the entire task item (including sub-bullets) from its current section and paste it under the appropriate new heading (e.g., from "To Do" to "In Progress").

### Adding New Tasks

Add new tasks under the "To Do" section using the `-[ ] ` format.
