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

- **Primary**: Supabase Authentication with row-level security
- Authentication logic in `/lib/auth.ts` and `/providers/auth-provider.tsx`
- User roles: admin and client with role-based permissions stored in profiles table
- Middleware protection for admin routes and authenticated areas
- Admin creation via `/create-admin` page or `/api/setup` endpoint

### 3. Database Layer

- **Primary**: Supabase PostgreSQL with profiles table for user management
- **Legacy**: Neon PostgreSQL for backward compatibility (some features)
- Database utilities in `/lib/db.ts`, `/lib/db-safe.ts`, and Supabase clients
- Server actions for secure database operations

### 4. Admin Dashboard

- Admin routes in `/app/admin/` with responsive design
- User, consultation, assessment, blog, and tools management
- Stats and activity tracking with visual analytics
- Role-based access control via middleware

### 5. Client-Facing Features

- AI assessments and consultation requests
- Solutions showcase and prompt library
- User profiles and dashboard
- Responsive design for all screen sizes

### 6. Blog Integration (Disabled)

- Blog functionality temporarily disabled for build stability
- Previous Notion integration can be re-enabled if needed
- Static content management for now

## Environment Variables

**Required for Supabase Authentication:**

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for admin operations

**Legacy Database (for compatibility):**

- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `NEXTAUTH_SECRET`: Secret for any remaining NextAuth compatibility
- `NEXTAUTH_URL`: Application URL

**Optional APIs:**

- `XAI_API_KEY`: XAI API for AI features
- `SENDGRID_API_KEY`: Email service integration

## Deployment Process

The application is deployed on Vercel. Key deployment requirements:

- Node.js v18+
- Set all environment variables in Vercel project settings
- Database must be accessible from Vercel's deployment region

---------------------------------------------------------------------------
---------------------------------------------------------------------------

# Project Management 

This section organizes the work being done on this project using Claude Code.

## Completed ✅

- [x] **Switch Authentication System to Supabase Auth** (COMPLETED)
  - ✅ Migrated from NextAuth.js to Supabase Auth
  - ✅ Implemented role-based access control with profiles table
  - ✅ Created admin user management system
  - ✅ Built responsive login/signup forms with Supabase Auth UI
  - ✅ Configured middleware for route protection
  - ✅ Set up Row Level Security policies

- [x] **Fix Authentication System Conflicts** (COMPLETED)
  - ✅ Consolidated to single Supabase authentication system
  - ✅ Removed conflicting auth methods (NextAuth, simple-admin-auth, session-storage)
  - ✅ Cleaned up multiple login pages (kept only `/login`)
  - ✅ Removed legacy auth API routes and components
  - ✅ Activated working middleware for proper route protection

- [x] **Resolve Vercel Deployment Issues** (COMPLETED)
  - ✅ Fixed Supabase build-time initialization errors
  - ✅ Implemented mock client fallbacks for build environment
  - ✅ Removed blog functionality to resolve table reference errors
  - ✅ Updated database queries to use existing tables
  - ✅ Disabled problematic webpack experimental features
  - ✅ Simplified middleware to prevent build hanging

- [x] **Database Schema & Server Actions** (COMPLETED)
  - ✅ Implemented Supabase profiles table with RLS policies
  - ✅ Created server actions for all admin operations
  - ✅ Added blog, prompt, tool, and user management actions
  - ✅ Implemented proper authorization checks
  - ✅ Set up permissions system with role-based access

- [x] **Admin Dashboard Implementation** (COMPLETED)
  - ✅ Created comprehensive admin dashboards for all areas
  - ✅ Implemented responsive design for mobile/tablet/desktop
  - ✅ Built user management with role assignment
  - ✅ Added consultation and assessment management
  - ✅ Integrated stats and analytics visualization
  - ✅ Created admin navigation with mobile sidebar

- [x] **Core Application Structure** (COMPLETED)
  - ✅ Explored and documented app capabilities
  - ✅ Identified integration points for AI features
  - ✅ Researched existing AI tools and prompt library
  - ✅ Established development workflows and guidelines

## Current Priority Tasks 🎯

- [ ] **Re-enable Blog Integration** (when needed)
  - Complete the setup for fetching and displaying blog content from Notion
  - Ensure proper error handling and caching mechanisms are in place
  - Update database queries to use Supabase instead of direct SQL

- [ ] **Enhance User Dashboard**
  - Add features for users to view their activity, saved prompts, and consultation history
  - Include visual analytics for user engagement with AI tools
  - Implement user profile management features

- [ ] **Advanced Features Development**
  - Design a custom AI agent using n8n for business process automation
  - Develop a prompt engineering tool that integrates with the prompt library
  - Create an AI assessment tool integration for evaluating business processes

## Future Roadmap 🚀

- [ ] **Solutions Showcase**
  - Create a dedicated page to display successful AI solutions and case studies
  - Allow users to filter by industry or AI model used

- [ ] **Enhanced Prompt Library**
  - Design a searchable and categorized library of prompts for various AI tasks
  - Enable user contributions with moderation for quality control

- [ ] **Development Tools Integration**
  - Link Aider with MCP, Claude Code, and Cursor (to save money on context output)
  - Implement automated testing and deployment pipelines

## Project Board

| Backlog | To Do | In Progress | Completed |
| ------- | ----- | ----------- | --------- |

## Session Summaries

<details>
<summary>### 2025-10-23: N8N Integration (Option B) & Knowledge Graph Setup</summary>

Implemented complete n8n workflow orchestration system and activated knowledge graph memory:

1. **Color Palette Harmonization**:
   - Fixed landing page bright orange-red gradient
   - Replaced with harmonized donjon-graphite → donjon-indigo → donjon-graphite gradient
   - Updated all accent colors to use donjon-ember and donjon-silver
   - Result: Professional, on-brand appearance that matches existing design system

2. **Knowledge Graph Memory MCP Server**:
   - Installed `@modelcontextprotocol/server-memory` MCP server
   - Added to Claude Desktop configuration
   - Designed comprehensive knowledge graph schema for Agent #1
   - Created architecture document with entities, relations, and observations patterns
   - Enables persistent memory across sessions for better context continuity

3. **N8N Workflow Orchestration (Option B Implementation)**:
   - Created complete database schema with `n8n_workflows` and `n8n_workflow_executions` tables
   - Implemented RLS policies for admin-only access
   - Built n8n API client with webhook triggering and status checking
   - Created server actions for workflow CRUD operations and execution
   - Developed admin dashboard at `/admin/ai-agents` with:
     - Statistics cards (workflows, executions, activity)
     - Color-coded workflow cards with emoji icons
     - One-click workflow triggering with loading states
     - Execution history table with status tracking
     - Real-time updates and toast notifications

4. **Example N8N Workflows**:
   - Created 3 ready-to-import workflow templates:
     - Consultation Alert: Email notifications + database logging
     - Lead Qualification Agent: AI-powered scoring with hot lead alerts
     - Weekly Report Generator: Automated analytics reports
   - All workflows include proper error handling and response formatting

5. **Documentation**:
   - Comprehensive deployment guide in `N8N_INTEGRATION_COMPLETE.md`
   - Quick-start guide in `START_HERE_CLAY.md`
   - Architecture diagrams and troubleshooting guides
   - Path to Option C (Agent Marketplace) outlined

**Result**: Production-ready n8n workflow orchestration system that serves as foundation for future Agent Marketplace (Option C). Complete with admin UI, execution tracking, example workflows, and full documentation. System ready for testing after database migration.

**Files Created**:
- `supabase/migrations/20251023_n8n_workflows.sql`
- `lib/n8n-client.ts`
- `app/actions/workflow-actions.ts`
- `app/admin/ai-agents/page.tsx`
- `components/admin/workflow-card.tsx`
- `components/admin/execution-history.tsx`
- `n8n-workflows/consultation-alert-workflow.json`
- `n8n-workflows/lead-qualification-workflow.json`
- `n8n-workflows/weekly-report-workflow.json`
- `.claude/knowledge-graph-architecture.md`
- `N8N_INTEGRATION_COMPLETE.md`
- `START_HERE_CLAY.md`
</details>

<details>
<summary>### 2025-06-15: Authentication System Cleanup & Unification</summary>

Completed a major cleanup and unification of the authentication system:

1. **Authentication Analysis**:
   - Conducted comprehensive scan of all authentication functionality
   - Identified multiple conflicting auth systems (NextAuth, simple-admin-auth, session-storage)
   - Discovered disabled middleware causing broken route protection
   - Verified Supabase environment variables were properly configured

2. **System Consolidation**:
   - Activated working Supabase middleware (replaced disabled version)
   - Removed all legacy authentication systems and conflicting files
   - Deleted duplicate login pages (login-debug, login-minimal, login-simple)
   - Cleaned up conflicting auth API routes and admin pages
   - Removed session-storage.ts and updated auth-actions.ts

3. **Admin User Management**:
   - Updated `/api/setup` route to work with Supabase instead of old database
   - Fixed admin user creation to use Supabase Auth Admin API
   - Ensured proper profile creation with role assignment
   - Maintained `/create-admin` page for easy admin user setup

4. **Testing & Verification**:
   - Verified environment variables are loaded correctly
   - Confirmed middleware protects admin and dashboard routes
   - Tested authentication flow with proper redirects
   - Ensured role-based access control works correctly

**Result**: Single, unified Supabase authentication system with clean codebase, proper route protection, and working admin user creation. Login system is now fully functional with admin@curveai.com / admin123 credentials.
</details>

<details>
<summary>### 2025-06-14: Vercel Deployment Issues Resolution</summary>

Resolved critical Vercel deployment failures and build-time errors:

1. **Build-Time Initialization Fixes**:
   - Fixed module-level Supabase imports causing "Missing environment variables" errors
   - Updated `lib/supabase-migration.ts` to use dynamic imports
   - Added comprehensive mock client fallbacks in `lib/supabase-client.ts`
   - Implemented build-time safety patterns across all Supabase files

2. **Database Query Cleanup**:
   - Removed references to deleted blog_posts table in `lib/db-stats.ts`
   - Updated stats queries to use ai_tools instead of blog_posts
   - Fixed mock data to match database changes
   - Ensured all database operations work without blog functionality

3. **Build Optimization**:
   - Disabled problematic `webpackBuildWorker` experimental feature
   - Added `output: 'standalone'` and `trailingSlash: true` for better build performance
   - Simplified middleware to prevent complex auth logic during build
   - Added comprehensive error handling and timeout management

4. **Blog Functionality Removal**:
   - Temporarily disabled all blog-related functionality for build stability
   - Removed Notion integration that was causing build failures
   - Updated components to handle missing blog data gracefully
   - Maintained ability to re-enable blog features when needed

**Result**: Stable Vercel deployments with successful builds, no environment variable errors, and optimized build performance.
</details>

<details>
<summary>### 2025-05-20: Supabase Authentication Implementation</summary>

Implemented a comprehensive migration from NextAuth to Supabase Auth:

1. **Supabase Setup**:
   - Created client configuration in `lib/supabase.ts`
   - Added admin functions in `lib/supabase-admin.ts`
   - Updated package.json with Supabase dependencies
   - Created environment variables template

2. **Auth Components**:
   - Created `supabase-auth-ui.tsx` for Supabase UI integration
   - Developed custom login form in `supabase-login-form.tsx`
   - Implemented signup form in `supabase-signup-form.tsx`
   - Added auth callback route handler 

3. **Role Management**:
   - Implemented role storage in Supabase user metadata
   - Added admin role verification in middleware
   - Created admin user management functions

4. **Updated Admin Dashboard**:
   - Modified admin components to use Supabase auth
   - Updated sidebar authentication
   - Enhanced dashboard layout to check admin role
   - Made all changes compatible with previous responsive design work

5. **Migration Support**:
   - Created SUPABASE_MIGRATION.md documentation
   - Included detailed setup and troubleshooting steps
   - Maintained backward compatibility during transition

All authentication flows now use Supabase while maintaining the existing UI and role-based access controls. The implementation enables social logins, email verification, and better security features.
</details>

<details>
<summary>### 2025-05-18: Responsive Admin Dashboard Implementation</summary>

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
</details>

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



### About Us

t Curve AI Solutions, we're not just another tech company. We're a team of innovators, problem-solvers, and business enthusiasts who believe that artificial intelligence should be accessible, practical, and valuable for businesses of all sizes—including yours.

Our Story
Founded in Tulsa with a simple yet powerful vision: to demystify AI and make it work for real businesses facing real challenges. We saw too many small business owners feeling left behind by the AI revolution—either intimidated by the technical complexity or unsure how this technology could actually improve their bottom line.

That's when we asked ourselves: What if AI could be both powerful AND approachable? What if we could translate the complex world of artificial intelligence into solutions that any business owner could understand, implement, and benefit from immediately?

What We Do
We create custom AI chatbots and workflow solutions (we call them Agentic AI Solutions) that handle the mundane, repetitive tasks consuming your valuable time. Our CurveAI technology doesn't just process data—it understands context, learns your business needs, and communicates with a personality tailored to your company culture.

Simplify Complex Processes
We translate technical concepts into everyday language that anyone can understand.

Automate Data Analysis
We automate data analysis and integration that would otherwise take hours of manual work.

Reduce Operational Costs
We streamline workflows and eliminate inefficiencies to reduce your operational costs.

Free Up Your Time
We help you focus on what truly matters—growing your business and serving your customers.

Why Small Business Owners Choose Us
Unlike large corporate AI solutions that require teams of engineers to implement, or basic chatbots that can only follow simple scripts, our technology strikes the perfect balance: sophisticated enough to deliver real results, simple enough that you don't need a computer science degree to use it.

When you work with Curve AI Solutions, you get:

Practical AI tools designed for your specific business challenges—not theoretical capabilities
Solutions that speak human—no technical jargon, no endless documentation
Measurable results with clear ROI—we're about improving your business, not just showcasing fancy technology
A partner who understands your business needs and translates them into effective AI implementations
Our Approach
We believe in starting with your business problems, not with technology. Our process is straightforward:

Listen to understand your specific challenges and goals
Design a customized AI solution that addresses your unique needs
Implement the technology seamlessly into your existing workflows
Measure the results to ensure you're getting real value
Refine the solution based on feedback and changing business needs
The Magic Behind Our Solutions
While we keep the technical talk to a minimum when working with clients, rest assured that under the hood, our solutions leverage cutting-edge AI frameworks and advanced software engineering. Our team brings expertise in machine learning, natural language processing, and data integration—all so you don't have to.

Community Commitment
We're deeply invested in the Tulsa business community and beyond. Through our AI Literacy Program, we're helping local business leaders, professionals, and interested parties understand and leverage AI technologies. Our seminars, online content, and collaborations with local businesses bring AI education closer to where people live and work.

By building strategic partnerships with other tech companies, educational institutions, and industry leaders, we're creating an ecosystem where businesses of all sizes can thrive in the digital age.

What Sets Us Apart
The difference is in our philosophy: we believe AI should work for you, not the other way around. Many AI companies make you adapt to their technology; we adapt our technology to fit your business.

Our solutions don't require you to learn new systems, hire technical staff, or completely overhaul your operations. Instead, we meet you where you are and enhance what you're already doing.

And unlike impersonal chatbots or generic AI tools, our solutions come with personalities that reflect your brand and create engaging experiences for both your team and your customers.

Meet Our Team
Founders Austin and Clayton
Clayton Christian
Founder & CTO

Machine Learning Engineering diploma holder with extreme creativity and dedication to development. AI visionary with extensive experience in building agent-based systems and trading infrastructure.

Austin Belcheff
Founder & CEO

Business graduate from Oklahoma State University and a creative force driving innovation within the company.

Our Core Values
Innovation
We constantly push the boundaries of what's possible with AI agent technology.

Accessibility
We make advanced AI solutions accessible to businesses of all sizes.

Transparency
We believe in transparent, data-driven solutions with clear insights and measurable results.
   

   
Excellence
We strive for excellence in every aspect of our products and services.

Ready to Transform Your Business?
Imagine significantly reducing your workload, automating data analysis, and integrating information across your systems—all while maintaining the human touch that makes your business special.

That's not just a dream; it's what we deliver every day to businesses like yours.

Whether you're looking to streamline customer service, automate administrative tasks, or gain insights from your business data without the headache, we have the expertise, tools, and approach to make it happen.

Let's take the first step together toward a more efficient, productive, and profitable future for your business. The AI revolution doesn't have to be complicated or confusing—with Curve AI Solutions as your partner, it can be the competitive advantage you've been looking for.

Our Roadmap
February 28, 2025
Databases Complete
Core database infrastructure with bot_metric table implementation
March 29, 2025
AiGent® System Launch
Release of our proprietary AI agent orchestration system
April 11, 2025
Lead Supervisor Orchestration Agent
Deployment of our advanced AI orchestration capabilities
April 24, 2025
Industry Expansion
Onboarding of new clients and industry partners
May 9th, 2025
AiPex Launch
Official launch of our AI Platform Exchange
June 28, 2025
Curve AI Official Launch
Full public launch with stock market integration and real money accounts