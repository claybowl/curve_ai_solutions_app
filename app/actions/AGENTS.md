# SERVER ACTIONS

Server actions for all business operations. Pattern: `"use server"` + Zod validation + auth check + DB query + `revalidatePath()`.

## WHERE TO LOOK

| Domain | File | Notes |
|--------|------|-------|
| AI Assessments | `assessment-actions.ts` | **1143 lines** - readiness questionnaires, scoring |
| AI Tools | `tool-actions.ts` | **801 lines** - CRUD, categories, usage tracking |
| Prompt Library | `prompt-actions.ts` | **690 lines** - prompts, collections, tags |
| Consultations | `consultation-actions.ts` | **648 lines** - requests, scheduling, status |
| User Management | `user-actions.ts` | **547 lines** - profiles, roles |
| N8N Workflows | `workflow-actions.ts` | Workflow orchestration, executions |
| Authentication | `auth-actions.ts` | Sign out, auth checks (simple) |
| Dashboard Stats | `stats-actions.ts` | Admin metrics, charts data |
| Permissions | `permission-actions.ts` | RBAC roles, permission checks |
| Contact Forms | `contact-actions.ts` | Contact messages, email notifications |
| Admin Dashboard | `admin-dashboard-actions.ts` | Aggregate admin queries |
| Tool Management | `tool-management-actions.ts` | Alternate tool CRUD (uses db-tools lib) |
| Seed Data | `seed-user.ts` | Demo user creation |

## CONVENTIONS

**Auth Patterns**:
- Supabase Auth: `getCurrentUserServer()`, `requireAdmin()`, `isUserAdmin()` from `@/lib/supabase-server`
- Legacy: `getCurrentSupabaseUser()` from `@/lib/db-v2` - **avoid in new code**

**Zod Validation**: Define schema at top, validate in action body before DB ops.

**Return Types**: Always `{ success, data?, error? }` or typed response. Never throw to client.

**Revalidation**: Call `revalidatePath()` after mutations. Common paths: `/admin/*`, `/dashboard`.

## COMPLEXITY HOTSPOTS

Files needing refactoring (>500 lines):

| File | Lines | Suggested Split |
|------|-------|-----------------|
| `assessment-actions.ts` | 1143 | Extract: question-actions, response-actions, scoring-actions |
| `tool-actions.ts` | 801 | Extract: tool-category-actions, tool-usage-actions |
| `prompt-actions.ts` | 690 | Extract: prompt-category-actions, prompt-collection-actions |
| `consultation-actions.ts` | 648 | Extract: scheduling-actions, consultant-assignment-actions |
| `user-actions.ts` | 547 | Extract: user-profile-actions, user-admin-actions |

## ANTI-PATTERNS

- **NEVER import** from `*-old.ts` files (deprecated)
- **AVOID** `redirect()` in try/catch - it throws and gets caught as error
