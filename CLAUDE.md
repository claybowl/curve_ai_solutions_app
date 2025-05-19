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


### Software Solution

Curve AI Solutions delivers AI agent development and automation tools specifically designed for small and medium-sized businesses (SMBs). Our platform empowers organizations that lack in-house machine learning expertise or massive IT budgets to finally benefit from advanced AI. We do this through a flexible, affordable approach that blends custom solutions with user-friendly integration and ongoing support.

Value Proposition:

Demystifying AI for SMBs: We turn AI from a confusing, intimidating technology into a clear, practical advantage for everyday business owners.

Tangible ROI: Each solution is engineered to save time, reduce manual workload, boost operational efficiency, and directly impact the bottom line. We document ROI and business outcomes for every project, ensuring our clients see measurable value.

Human-Centric, Personalized Service: Unlike impersonal SaaS or overseas vendors, Curve AI works hands-on with clients—listening, customizing, and iterating solutions that truly fit their workflows.

Flexible Engagement: We offer both project-based and subscription support models, meeting local businesses where they are, with no lock-in or hidden fees.

Target Market:

Primary: Small to mid-sized businesses (typically 5–100 employees), especially in non-technical industries like retail, professional services, healthcare, supply chain, and local commerce—companies underserved by major AI vendors.

Geography: Tulsa, Oklahoma and the broader Midwest/South, with plans to expand as our model proves scalable.

Customer Profile: Business owners and operators seeking operational efficiency, better customer experience, or the ability to scale without hiring large teams.

Product Differentiation:

Custom AI Agent Solutions: Our core product is a library of ready-to-integrate AI agents (chatbots, data automation, customer support bots, analytics assistants) tailored to each client’s real-world needs—going beyond generic “one-size-fits-all” AI.

Consultation + Development: We guide clients from assessment and ideation through prototyping, integration, and ongoing optimization. This end-to-end approach ensures the right solution, not just the right technology.

Affordable, Transparent Pricing: By using a mix of open-source tools, cloud APIs, and efficient workflows, we keep costs accessible. Our pricing is clear and designed for small business budgets, offering project, retainer, or hybrid models.

Local Presence and Community Impact: As a Tulsa-founded company, we build long-term relationships and support local economic growth—something big SaaS and global consultancies can’t replicate.

Education and Enablement: We offer hands-on AI literacy workshops, documentation, and local events to help demystify AI for SMBs and empower teams long after launch.

Summary:
Curve AI Solutions exists to bridge the AI adoption gap for small businesses, offering practical, high-ROI AI tools with the personalized care of a local partner. Our focus on client outcomes, transparency, and Tulsa roots makes us uniquely positioned to deliver both immediate and lasting value to businesses—and to the Microsoft for Startups network.

I’m eager to share detailed case studies, financials, and technical documentation with your team, and to discuss how Microsoft’s ecosystem can accelerate our next phase of growth.

Thank you again for your time and consideration.

Best regards,
Clayton ChristianFounder & CTO, Curve AI Solutions(539) 424-0777https://curveaisolutions.vercel.app/

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