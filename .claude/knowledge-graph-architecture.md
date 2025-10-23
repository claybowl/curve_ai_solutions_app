# Knowledge Graph Architecture for Agent #1
## First Officer's Persistent Memory System

---

## Mission Brief

This document outlines the proposed knowledge graph schema for Agent #1 (First Officer of Donjon Intelligence Systems) using the `@modelcontextprotocol/server-memory` MCP server. The goal is to create a persistent memory layer that enhances #1's ability to maintain context, track project decisions, and provide continuity across sessions.

---

## Core Knowledge Graph Components

The MCP Memory Server uses three primitives:

1. **Entities**: Primary nodes representing key concepts, people, systems, or artifacts
2. **Relations**: Directed edges defining how entities interact (always in active voice)
3. **Observations**: Discrete facts or metadata about entities

---

## Proposed Entity Types for #1

### 1. **Project Entities**
- **curve_ai_solutions_app**: The main web application project
- **donjon_intelligence_systems**: Parent company and brand identity
- **aigent_system**: Proprietary AI orchestration platform
- **aipex_platform**: AI Platform Exchange product
- **know_defeat_system**: Trading/cross-industry modular system

**Purpose**: Track project scope, architecture decisions, and deployment states.

---

### 2. **Person Entities**
- **clay_the_grey**: Primary user, co-founder, CTO
- **austin_belcheff**: Co-founder, CEO
- **agent_1**: Self-reference for #1 (First Officer)

**Purpose**: Maintain user preferences, roles, and interaction history.

---

### 3. **Technology Stack Entities**
- **nextjs_app_router**: Core framework
- **supabase_auth**: Authentication system
- **neon_postgresql**: Legacy database
- **supabase_postgresql**: Primary database
- **vercel_deployment**: Hosting platform
- **n8n_workflows**: Workflow automation integration

**Purpose**: Track technology choices, migration status, and integration points.

---

### 4. **Feature Entities**
- **admin_dashboard**: Admin UI and management system
- **user_authentication**: Auth implementation and flows
- **blog_integration**: Notion CMS integration (currently disabled)
- **consultation_system**: Client consultation requests
- **assessment_tool**: AI readiness assessment feature
- **prompt_library**: Curated prompt collection

**Purpose**: Document feature state, dependencies, and completion status.

---

### 5. **Decision Entities**
- **auth_migration_2025_05_20**: Switch to Supabase Auth
- **blog_disable_2025_06_14**: Temporarily disabled for build stability
- **responsive_design_2025_05_18**: Mobile-first dashboard redesign
- **color_palette_update_2025_10_23**: Harmonized landing page colors

**Purpose**: Capture architectural decisions with rationale and dates.

---

### 6. **Task/Session Entities**
- **session_2025_10_23_n8n_exploration**: Current session exploring n8n integration
- **priority_task_user_dashboard_enhancement**: Roadmap item
- **priority_task_blog_reintegration**: Future work

**Purpose**: Track active work, context, and session continuity.

---

## Proposed Relations (Active Voice)

### Project Relations
- `curve_ai_solutions_app` **USES** `nextjs_app_router`
- `curve_ai_solutions_app` **INTEGRATES_WITH** `supabase_auth`
- `curve_ai_solutions_app` **DEPLOYS_TO** `vercel_deployment`
- `curve_ai_solutions_app` **INCLUDES** `admin_dashboard`
- `curve_ai_solutions_app` **BELONGS_TO** `donjon_intelligence_systems`

### Person Relations
- `clay_the_grey` **OWNS** `curve_ai_solutions_app`
- `clay_the_grey` **COLLABORATES_WITH** `austin_belcheff`
- `agent_1` **SERVES** `clay_the_grey`
- `agent_1` **WORKS_ON** `curve_ai_solutions_app`

### Feature Relations
- `admin_dashboard` **REQUIRES** `user_authentication`
- `blog_integration` **DISABLED_BY** `decision_blog_disable_2025_06_14`
- `assessment_tool` **DEPENDS_ON** `supabase_postgresql`

### Decision Relations
- `auth_migration_2025_05_20` **REPLACED** `nextauth_system`
- `auth_migration_2025_05_20` **INTRODUCED** `supabase_auth`
- `responsive_design_2025_05_18` **IMPROVED** `admin_dashboard`

### Task Relations
- `session_2025_10_23_n8n_exploration` **EXPLORES** `n8n_workflows`
- `session_2025_10_23_n8n_exploration` **LED_BY** `agent_1`
- `priority_task_user_dashboard_enhancement` **TARGETS** `user_dashboard`

---

## Proposed Observations

### Project Observations
**Entity**: `curve_ai_solutions_app`
- `status`: "Production"
- `deployment_url`: "https://curveai.solutions"
- `primary_language`: "TypeScript"
- `package_manager`: "pnpm"
- `last_major_update`: "2025-06-15"
- `git_branch`: "main"

### Person Observations
**Entity**: `clay_the_grey`
- `role`: "CTO, Co-Founder"
- `preferred_tone`: "Ryker-mode (decisive, competent, charming)"
- `development_focus`: "Agentic systems, context engineering, ML infrastructure"
- `location`: "Tulsa, Oklahoma"
- `time_zone`: "America/Chicago"

**Entity**: `agent_1`
- `call_sign`: "#1 (First Officer)"
- `division`: "Donjon Intelligence Systems"
- `personality_traits`: "hilarious, cunning, courageous, enthusiastic, thoughtful, witty, compassionate, determined, skeptical"
- `operating_mode_default`: "Away Team (Hands-On Build)"
- `decision_framework": "OODA loop"

### Technology Observations
**Entity**: `supabase_auth`
- `integration_date`: "2025-05-20"
- `status`: "Active"
- `supports_roles`: "admin, client"
- `uses_rls`: "true"

**Entity**: `blog_integration`
- `status`: "Disabled"
- `reason`: "Build stability issues"
- `disabled_date`: "2025-06-14"
- `cms_backend`: "Notion"

### Decision Observations
**Entity**: `auth_migration_2025_05_20`
- `decision_type`: "Architecture"
- `rationale`: "Better security, social logins, email verification, role-based access"
- `effort_days": "3-5"
- `impact": "High"

**Entity**: `color_palette_update_2025_10_23`
- `decision_type`: "Design"
- `rationale`: "Bright orange clashed with brand palette"
- `new_palette`: "donjon-graphite, donjon-indigo, donjon-ember, donjon-silver"
- `impact": "Low"

---

## Knowledge Graph Usage Patterns for #1

### 1. **Session Initialization**
When starting a new session, #1 should:
- Query for recent sessions related to `clay_the_grey`
- Retrieve active tasks and their current status
- Load project state and recent decisions
- Check for unresolved blockers or pending questions

### 2. **During Development**
As #1 works, continuously:
- Create observations for new code locations (file paths, line numbers)
- Document new dependencies or integrations
- Record architectural decisions with rationale
- Link completed tasks to their outcomes

### 3. **Context Continuity**
Between sessions:
- Store partial work as observations on task entities
- Capture assumptions and open questions
- Link related entities (e.g., feature → dependencies → risks)
- Maintain a "working context" entity for in-progress work

### 4. **Decision Tracking**
For every significant decision:
- Create a decision entity with timestamp
- Document alternatives considered (as observations)
- Link to affected entities
- Record success metrics or validation criteria

### 5. **Learning & Preferences**
Over time, build up observations about:
- Clay's coding preferences (naming conventions, patterns)
- Common debugging approaches
- Frequently used tools and workflows
- Successful strategies for specific problem types

---

## Example Knowledge Graph Workflow

### Scenario: Clay asks #1 to enhance the user dashboard

**Step 1: Create Task Entity**
```
Entity: task_enhance_user_dashboard_2025_10_23
Observations:
  - status: "in_progress"
  - priority: "high"
  - requested_by: "clay_the_grey"
  - date_created: "2025-10-23"
```

**Step 2: Link Relations**
```
task_enhance_user_dashboard_2025_10_23 TARGETS user_dashboard
task_enhance_user_dashboard_2025_10_23 ASSIGNED_TO agent_1
agent_1 WORKS_ON task_enhance_user_dashboard_2025_10_23
```

**Step 3: Document Requirements**
```
Observations on task_enhance_user_dashboard_2025_10_23:
  - requirements: "activity tracking, saved prompts, consultation history, visual analytics"
  - dependencies: "supabase_postgresql, admin_dashboard patterns"
  - estimated_effort: "2-3 days"
```

**Step 4: Track Progress**
```
Observations (updated):
  - files_created: "['/app/dashboard/page.tsx', '/components/user-activity-chart.tsx']"
  - files_modified: "['/lib/db-queries.ts']"
  - tests_added: "true"
  - blockers: "None"
```

**Step 5: Completion**
```
Observations (final):
  - status: "completed"
  - completion_date: "2025-10-25"
  - outcome: "User dashboard now shows activity, prompts, and consultation history with analytics"
  - lessons_learned: "Reused admin dashboard chart components successfully"
```

---

## Benefits for #1's Operations

### 1. **Contextual Awareness**
- Instantly recall project history across months
- Understand why decisions were made
- Avoid repeating past mistakes

### 2. **Efficient Onboarding**
- When Clay returns after a break, #1 can summarize recent changes
- Provide "Last time we..." briefings
- Highlight what's changed since last session

### 3. **Intelligent Recommendations**
- Suggest related work based on past patterns
- Identify potential conflicts with previous decisions
- Propose solutions that align with established architecture

### 4. **Accountability & Documentation**
- Automatic decision logging
- Traceability for every change
- Clear audit trail for debugging

### 5. **Improved Collaboration**
- Share context with other agents (if multi-agent system evolves)
- Maintain consistent knowledge across different Claude instances
- Enable handoffs between development sessions

---

## Initial Setup Recommendations

### Phase 1: Core Entities (Week 1)
1. Create project entity for `curve_ai_solutions_app`
2. Create person entities for Clay and Austin
3. Create self-entity for `agent_1`
4. Document current tech stack entities

### Phase 2: Historical Context (Week 2)
1. Backfill major decisions from CLAUDE.md session summaries
2. Create feature entities for completed work
3. Document current roadmap tasks

### Phase 3: Active Usage (Ongoing)
1. Create session entity at start of each conversation
2. Link all work to session and tasks
3. Update observations in real-time
4. Review and prune graph monthly

---

## Maintenance & Evolution

### Weekly Review
- Prune stale task entities
- Archive completed sessions
- Update project observations (status, deployment info)

### Monthly Retrospective
- Analyze decision patterns
- Identify knowledge gaps
- Refine entity types based on usage

### Quarterly Optimization
- Consolidate redundant entities
- Restructure relations for better queries
- Export knowledge graph backup

---

## Success Metrics

#1's knowledge graph will be considered successful when:

1. **Context Recall**: #1 can answer "What happened with X?" for any past project work
2. **Zero Repeat Questions**: Clay never has to explain the same context twice
3. **Proactive Insights**: #1 flags conflicts or suggests optimizations without prompting
4. **Seamless Continuity**: Sessions pick up exactly where previous ones left off
5. **Decision Transparency**: Every major choice has documented rationale

---

## Conclusion

This knowledge graph architecture transforms #1 from a stateless assistant into a **persistent First Officer** with institutional memory. By systematically capturing entities, relations, and observations, #1 can maintain continuity, make informed recommendations, and serve as a reliable partner in Donjon Intelligence Systems' development journey.

**Make it so.**

---

**Document Version**: 1.0
**Author**: Agent #1 (First Officer)
**Date**: 2025-10-23
**Status**: Proposed - Awaiting Clay's Approval
