# Curve AI Solutions

A Next.js web application offering AI consultation services, assessments, and tools with a comprehensive admin dashboard.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/claybowls-projects/v0-clean-machine-final)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## Overview

Curve AI Solutions is a platform that helps businesses integrate AI capabilities into their existing workflows. The application includes:

- **AI Assessment Tool**: Evaluate an organization's AI readiness
- **Consultation Services**: Request consultation with AI experts
- **Prompt Library**: Curated collection of effective AI prompts
- **AI Tools Showcase**: Demonstrate available AI tools and solutions
- **Admin Dashboard**: Manage users, content, and platform settings

## Features

- **Authentication System**: Supabase Auth with profile-based role management
- **Database Layer**: PostgreSQL with Neon serverless driver
- **Blog System**: Notion-powered blog with local caching
- **Server Actions**: Secure, server-side operations for all admin features
- **Responsive UI**: Built with Tailwind CSS and Shadcn UI components

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (Neon.tech recommended)
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/curve-ai-solutions.git
cd curve-ai-solutions

# Install dependencies
pnpm install

# Create .env.local file with required variables
# See .env.example for required variables

# Initialize the database
# Run the SQL in db-schema.sql and db-schema-updates.sql

# Start development server
pnpm dev
```

### Environment Variables

Required environment variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Optional for blog functionality:

```
NOTION_TOKEN=your-notion-integration-token
NOTION_BLOG_DATABASE_ID=your-notion-database-id
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase-profiles-schema.sql` in your Supabase SQL Editor
3. Create your first admin user following instructions in `create-admin-user.md`
# Project Management

This section organizes the work being done on this project using Claude Code.

## Project Board

| Backlog | To Do | In Progress | Completed |
| ------- | ----- | ----------- | --------- |
|  | - [ ] Implement Notion Blog Integration:<br>  - Fetch and display blog content from Notion with error handling and caching.<br>- [ ] Enhance User Dashboard:<br>  - Activity, saved prompts, and consultation history views with visual analytics.<br>- [ ] Develop Solutions Showcase:<br>  - Display AI solutions and case studies, filterable by industry or model.<br>- [ ] Build Prompt Library:<br>  - Searchable, categorized prompts with user contributions and moderation.<br>- [ ] Implement Admin Features in Phases:<br>  - [ ] Phase 4: Create comprehensive admin dashboards for each area<br>  - [ ] Phase 5: Add fine-grained permission controls |  | - [x] Fix inconsistent Auth Methods:<br>  - Consolidated multiple authentication mechanisms (NextAuth JWT, simple-admin-auth cookie, admin-token in localStorage)<br>  - Updated auth utilities to use NextAuth session hooks<br>  - Migrated admin-sidebar to use NextAuth session<br>  - Updated middleware to use NextAuth JWT for all route protection<br>  - Updated logout process to use NextAuth signOut<br>  - Added auth checks to admin API routes<br>  - Maintained backwards compatibility for legacy auth methods<br>- [x] Database Schema missing tables:<br>  - Blog posts management<br>  - Prompt library items<br>  - AI tools<br>- [x] Set up 'Role & Permissions Management':<br>  - Implemented granular permissions system<br>  - Added roles with assignable permissions<br>  - Created user-level permission overrides<br>- [x] Implement Server Actions for Admin Operations:<br>  - Added server actions for blog posts, prompts, permissions, and tools<br>  - Implemented proper authorization checks<br>  - Created example UI components for testing<br>- [x] Implement Admin Features in Phases:<br>  - [x] Phase 1: Consolidate authentication to use a single mechanism (NextAuth JWT)<br>  - [x] Phase 2: Add missing database tables for blog posts, prompts, and permissions<br>  - [x] Phase 3: Implement server actions for all admin operations |

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Main project information and guidance for Claude
- [SERVER_ACTIONS.md](./docs/SERVER_ACTIONS.md) - Documentation for server actions implementation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [database_migration.md](./database_migration.md) - Database migration guide

## Repository Structure

```
├── app/                  # Next.js App Router pages and API routes
│   ├── actions/          # Server actions for admin operations
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── examples/         # Example pages for testing server actions
├── components/           # React components
│   ├── admin/            # Admin-specific components
│   ├── ui/               # Reusable UI components (Shadcn)
├── lib/                  # Core utilities and database functions
├── public/               # Static assets
└── styles/               # Global styles
```

## Technologies

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Neon Serverless
- **Authentication**: NextAuth.js with JWT
- **Content Management**: Notion API integration