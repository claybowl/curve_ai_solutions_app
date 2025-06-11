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

  ☒ Explore the Curve AI Solutions app structure to understand its capabilities
  ☒ Identify potential integration points between your web app and Curve AI Solutions
  ☒ Research existing AI features in the app that could be leveraged
  ☐ Design a custom AI agent using n8n for business process automation
  ☐ Develop a prompt engineering tool that integrates with the prompt library
  ☐ Create an AI assessment tool integration for evaluating business processes
          

- [x] Switch Authentication System to Supabase Auth:
  - Current System Overview:
    - Uses NextAuth.js with credential provider
    - Stores users in a PostgreSQL database (Neon)
    - Has role-based access (admin/client)
    - Uses JWT for sessions
    - Has middleware for route protection
  - Benefits of Switching:
    - Built-in social logins (Google, GitHub, etc.)
    - Email verification and password reset flows
    - Row-level security in database
    - Built-in rate limiting and security features
    - Managed JWT authentication with configurable expiry
    - User management dashboard
  - Create Admin User:
    - You can create an admin user in two ways:
      - Option A: Using Supabase UI
        - Go to Authentication > Users in Supabase dashboard
        - Create a new user

Click on the user and add custom metadata: { "role": "admin" }
  - Key Implementation Changes:
    - Replace `auth.ts` with Supabase client config.
    - Update `middleware.ts` for Supabase session validation.
    - Replace login/register components (Supabase Auth UI or custom).
    - Update user profile management using Supabase APIs.
  - Role Management:
    - Store roles in Supabase user metadata or separate table.
    - Use Supabase Row Level Security policies.
    - Update middleware to check roles from Supabase JWT claims.

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