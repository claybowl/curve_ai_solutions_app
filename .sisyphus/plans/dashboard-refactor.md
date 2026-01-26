# Dashboard Refactor - Complete Redesign Plan

**Goal:** Create a beautiful, functional dashboard that matches the Donjon design system and showcases actual webapp features with real data integration.

---

## Design Philosophy

### Visual Identity
- **Theme:** Donjon Intelligence Systems - fortified, cyberpunk aesthetic
- **Primary Colors:** Sky-400/500 (sky blue), Emerald-400 (success), Indigo/Violet (accents)
- **Background:** Dark `bg-[#030712]` with ambient grid patterns
- **Components:** Glass panels, neon lines, tech tags, floating glow orbs

### User Experience
- **Progressive Disclosure:** Show overview first, deep dive on demand
- **Personalization:** Adapt content based on user activity and role
- **Quick Actions:** Fast access to common tasks
- **Visual Hierarchy:** Clear sections with proper spacing and dividers

---

## Dashboard Sections (7 Main Areas)

### 1. Hero Welcome Section
**Purpose:** Personalized greeting with user context

**Components:**
- [ ] User avatar (initial letter in circle with gradient)
- [ ] Personalized greeting with name from profile
- [ ] Quick stats overview (3-4 key metrics in glass-panel badges)
  - Days since signup
  - Assessments completed
  - Tools explored
  - Subscription status badge
- [ ] Quick action buttons (CTA style)
  - "Start New Assessment" (primary)
  - "Browse Tools" (secondary)
  - "Book Consultation" (ghost)

**Data Sources:**
- `profiles` table (name, created_at, subscription_status)
- `assessments` table (count completed)
- `user_tool_usage` table (count distinct tools)

**Design:**
- Full-width glass-panel with subtle gradient
- Ambient background glow orb (sky-500)
- Neon line separator at bottom

---

### 2. Assessment Dashboard
**Purpose:** Track AI readiness progress and view results

**Components:**
- [ ] Overall Readiness Score (large circular gauge)
  - Animated progress ring
  - Percentage in center
  - Color-coded: <50% amber, 50-75% sky, >75% emerald
- [ ] Category Breakdown (mini cards grid)
  - AI Readiness
  - Data Management
  - Process Automation
  - Team & Skills
  - Technology Stack
  - Strategic Goals
- [ ] Recent Assessments List (last 3)
  - Date, status, score
  - "View Details" link
- [ ] CTA: "Start New Assessment" button

**Data Sources:**
- `assessments` table (user assessments)
- `assessment_results` table (category scores)
- `assessment_categories` table (category names)

**Design:**
- 2-column layout: Large gauge left, category grid right
- Use tech-tag classes for category badges
- Glass-panel cards with hover effects

---

### 3. Tools & Solutions Hub
**Purpose:** Showcase available AI tools and track usage

**Components:**
- [ ] Featured Tools Carousel (3-4 tools)
  - Tool icon, name, description
  - Complexity badge
  - "Try Now" button
- [ ] Recently Used Tools (list)
  - Last 5 tools with usage time
  - Quick relaunch buttons
- [ ] Tool Categories Filter
  - Chatbots, Data Analysis, Automation, Content Gen, Trading, Integration
- [ ] Usage Stats Mini Card
  - Total tools explored
  - Hours saved (calculated)
  - Favorite tool

**Data Sources:**
- `ai_tools` table (tools list, is_featured)
- `tool_categories` table (categories)
- `user_tool_usage` table (user's tool history)

**Design:**
- Horizontal scroll carousel for featured tools
- Grid layout for categories (3 columns)
- Data-card hover effects

---

### 4. Prompt Library Quick Access
**Purpose:** Easy access to saved and featured prompts

**Components:**
- [ ] Featured Prompts (3 cards)
  - Title, description, tags
  - "Copy Prompt" button
  - Rating stars
- [ ] My Collections (dropdown/tabs)
  - User's saved prompt collections
  - Collection count badges
- [ ] Quick Search Bar
  - Search prompts by keyword
  - Filter by category
- [ ] Browse Categories Link

**Data Sources:**
- `prompts` table (is_featured, is_public)
- `user_prompt_collections` table (user collections)
- `prompt_collection_items` table (collection contents)

**Design:**
- 3-column card grid for featured prompts
- Glass-panel-solid for search bar
- Tech-tag badges for categories

---

### 5. Consultation & Support Center
**Purpose:** Track consultation requests and support interactions

**Components:**
- [ ] Active Consultations Card
  - Current status (pending/scheduled/in progress)
  - Next scheduled meeting (if any)
  - Consultation timeline
- [ ] Consultation Request Form (collapsed by default)
  - Quick request button that expands form
  - Subject, description, urgency
  - "Submit Request" CTA
- [ ] Support Resources Links
  - Documentation
  - Video tutorials
  - FAQ
  - Contact support

**Data Sources:**
- `consultations` table (user's requests)

**Design:**
- Timeline component for consultation progress
- Expandable accordion for form
- Glass-panel with border-sky-500/30 for active items

---

### 6. Learning & Insights Section
**Purpose:** Educational content and progress tracking

**Components:**
- [ ] Recommended Resources
  - Based on assessment results
  - Articles, videos, tools
  - "Weak areas" highlighted
- [ ] Progress Metrics
  - Engagement score
  - Time spent learning
  - Milestones achieved
- [ ] Recent Blog Posts (if available)
  - Title, excerpt, read time
  - "Read More" links

**Data Sources:**
- `assessment_results` table (recommendations, improvement_areas)
- `user_engagement_metrics` table (engagement scores)
- `blog_posts` table (latest published)
- `analytics_events` table (user activity)

**Design:**
- Card grid for resources (2 columns)
- Progress bars with gradient fills
- Neon-line separators between sections

---

### 7. Activity Feed & Notifications
**Purpose:** Keep users informed of updates and actions

**Components:**
- [ ] Recent Activity Timeline
  - Assessments completed
  - Tools used
  - Consultations updated
  - Prompts saved
- [ ] Unread Notifications Badge
  - Count indicator
  - Dropdown panel for notifications
  - Mark as read functionality
- [ ] Quick Actions Sidebar
  - Frequently used links
  - Bookmarked tools
  - Saved searches

**Data Sources:**
- `user_notifications` table (unread notifications)
- `analytics_events` table (recent user events)
- `assessments`, `user_tool_usage`, `consultations` (activity data)

**Design:**
- Vertical timeline with icons
- Notification bell with pulse animation for unread
- Glass-panel dropdown

---

## Technical Implementation Plan

### Phase 1: Data Layer (Server Actions)
**Estimated Effort:** 4-6 hours

- [ ] Create `app/actions/dashboard-actions.ts`
  - `getDashboardOverview()` - aggregate stats
  - `getUserAssessmentData()` - assessment scores & history
  - `getFeaturedTools()` - featured AI tools
  - `getRecentToolUsage()` - user tool history
  - `getFeaturedPrompts()` - prompt library highlights
  - `getUserCollections()` - saved prompts
  - `getActiveConsultations()` - consultation status
  - `getRecentActivity()` - activity timeline
  - `getNotifications()` - unread notifications
  - `markNotificationRead()` - mark notification as read

**Patterns:**
- Use Zod schemas for validation
- Error handling with try/catch
- Return `{ success, data, error }` format
- Add proper TypeScript types

### Phase 2: Component Architecture
**Estimated Effort:** 6-8 hours

**Layout Structure:**
```
app/dashboard/page.tsx (Server Component)
├── components/dashboard/
│   ├── DashboardHero.tsx (client)
│   ├── AssessmentOverview.tsx (client)
│   ├── ToolsHub.tsx (client)
│   ├── PromptLibraryAccess.tsx (client)
│   ├── ConsultationCenter.tsx (client)
│   ├── LearningInsights.tsx (client)
│   └── ActivityFeed.tsx (client)
```

**Component Tasks:**
- [ ] Create `components/dashboard/` directory
- [ ] Build `DashboardHero.tsx`
- [ ] Build `AssessmentOverview.tsx`
- [ ] Build `ToolsHub.tsx`
- [ ] Build `PromptLibraryAccess.tsx`
- [ ] Build `ConsultationCenter.tsx`
- [ ] Build `LearningInsights.tsx`
- [ ] Build `ActivityFeed.tsx`

**Shared Components:**
- [ ] `StatCard.tsx` - reusable metric display
- [ ] `ProgressRing.tsx` - circular progress indicator
- [ ] `ActivityTimeline.tsx` - timeline component
- [ ] `ToolCard.tsx` - tool display card
- [ ] `PromptCard.tsx` - prompt display card

### Phase 3: Main Dashboard Page
**Estimated Effort:** 3-4 hours

- [ ] Refactor `app/dashboard/page.tsx`
  - Fetch all data server-side
  - Pass props to client components
  - Handle loading states
  - Handle empty states (new users)
  - Add error boundaries

**Layout:**
- Grid system with proper breakpoints
- Responsive design (mobile, tablet, desktop)
- Proper spacing and padding
- Ambient background effects

### Phase 4: Interactivity & Polish
**Estimated Effort:** 4-5 hours

- [ ] Add loading skeletons for each section
- [ ] Implement smooth animations
  - Fade-in effects
  - Slide-up animations
  - Hover transitions
  - Progress ring animations
- [ ] Add empty states with helpful CTAs
- [ ] Toast notifications for actions
- [ ] Optimistic UI updates
- [ ] Add keyboard shortcuts (optional)

### Phase 5: Testing & Optimization
**Estimated Effort:** 2-3 hours

- [ ] Test with real user data
- [ ] Test with empty data (new users)
- [ ] Test responsive layouts
- [ ] Optimize query performance
- [ ] Add caching where appropriate
- [ ] Test authentication edge cases
- [ ] Verify all links work
- [ ] Check accessibility (ARIA labels)

---

## Design Specifications

### Color Palette
```css
/* Primary */
--sky-primary: #38bdf8 (sky-400)
--sky-hover: #0ea5e9 (sky-500)

/* Success */
--emerald: #34d399 (emerald-400)

/* Warning */
--amber: #fbbf24 (amber-400)

/* Accents */
--indigo: #818cf8 (indigo-400)
--violet: #a78bfa (violet-400)
--pink: #f472b6 (pink-400)

/* Backgrounds */
--bg-primary: #030712
--bg-secondary: #0f172a (slate-900)
--glass: rgba(255, 255, 255, 0.05)
--glass-solid: rgba(15, 23, 42, 0.8)

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.1)
--border-accent: rgba(56, 189, 248, 0.3)
```

### Typography
```css
/* Headings */
h1: text-4xl font-bold text-slate-50
h2: text-2xl font-semibold text-slate-50
h3: text-xl font-medium text-sky-400

/* Body */
p: text-slate-400 leading-relaxed

/* Labels */
.fira-label: font-mono text-xs text-slate-500 tracking-wider uppercase
```

### Spacing
```
Section padding: py-8 px-6
Card padding: p-6
Grid gaps: gap-6
```

### Component Classes
```css
/* Containers */
.glass-panel
.glass-panel-solid
.data-card (with hover effect)

/* Decorative */
.neon-line
.ambient-bg
.synapse-glow

/* Tags */
.tech-tag-{sky|emerald|indigo|violet|pink|amber}
.status-badge-{operational|pending}
```

---

## Sample Data Scenarios

### New User (Empty State)
- No assessments completed → Show "Get Started" CTA
- No tools used → Show featured tools
- No collections → Show featured prompts
- No consultations → Show "Book Your First Consultation"

### Active User
- 2-3 completed assessments → Show latest scores
- 5+ tools explored → Show favorites and recent
- Saved prompts → Show collections
- Active consultation → Show status and timeline

### Power User
- Multiple assessments with trends
- Extensive tool usage with analytics
- Large prompt collections
- Multiple consultations with history

---

## Success Metrics

**User Engagement:**
- Time spent on dashboard increases
- Click-through rate to tools/assessments improves
- Consultation requests increase

**Usability:**
- Users find key actions faster
- Reduced support requests about navigation
- Positive user feedback

**Technical:**
- Page load time < 2 seconds
- No console errors
- 100% responsive on all devices
- Lighthouse score > 90

---

## Maintenance Considerations

**Future Enhancements:**
- Add dashboard customization (drag & drop widgets)
- User preferences for default view
- Export dashboard data
- Email digest of activity
- Mobile app version

**Technical Debt:**
- Monitor query performance as data grows
- Consider pagination for long lists
- Add caching layer for heavy queries
- Optimize image loading

---

## Estimated Total Time: 20-25 hours

**Priority Order:**
1. Phase 1 (Data Layer) - Foundation
2. Phase 3 (Main Page Structure) - Core functionality
3. Phase 2 (Components) - Visual elements
4. Phase 4 (Polish) - User experience
5. Phase 5 (Testing) - Quality assurance

**Parallelization Opportunities:**
- Sections 2-7 can be built independently after Phase 1
- Component development can happen in parallel
- Testing can overlap with Phase 4

---

## Notes for Implementation

**Important Patterns to Follow:**
- Use server components for data fetching
- Client components only where needed (interactivity)
- Follow AGENTS.md conventions strictly
- Use existing Donjon CSS classes
- Import from `@/` aliases
- Type safety with TypeScript
- Error boundaries for each major section
- Loading states for async operations

**Database Considerations:**
- Some tables may not have data yet (handle gracefully)
- Check if assessment system is fully implemented
- Verify tools and prompts tables are populated
- Test with your actual Supabase data

**Design System Adherence:**
- Reference `app/page.tsx` for style patterns
- Use icons from `lucide-react`
- Match spacing and layout of front-end pages
- Consistent hover effects and transitions
- Ambient backgrounds and glow effects

---

**End of Plan**
