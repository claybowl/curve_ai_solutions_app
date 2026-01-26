# Dashboard Refactor Notepad - Initialized

## Phase 1: Dashboard Actions Data Layer

### Patterns Discovered

1. **Database Query Pattern**: Use `sql.query(queryString, [params])` from `@/lib/db`. Returns array directly, not `{ rows }` object.

2. **Auth Pattern**: `getCurrentUserServer()` from `@/lib/supabase-server` returns user object with `id` property. Returns null if not authenticated.

3. **Response Format**: All server actions return `{ success: boolean, data?: T, error?: string }`. Never throw to client.

4. **Empty Data Handling**: Return empty arrays `[]` for list queries when no data exists. Don't treat as error.

### Database Schema Notes

- `profiles` uses `user_id` (UUID) as foreign key to auth.users, not `id`
- `assessments` uses `user_id` directly referencing auth.users
- `assessment_results` links to both `assessments` and `assessment_categories`
- `user_tool_usage` tracks tool interactions with session metrics
- `user_notifications` has `is_read` boolean and `related_entity_type` for linking

### Functions Created

1. `getDashboardOverview()` - Profile stats, days since signup, counts
2. `getUserAssessmentData()` - Latest assessment, category scores, history
3. `getFeaturedTools()` - Featured AI tools with ratings
4. `getRecentToolUsage()` - User's last 5 tool interactions
5. `getFeaturedPrompts()` - 3 featured prompts from library
6. `getUserCollections()` - User's prompt collections with counts
7. `getActiveConsultations()` - Non-completed consultations
8. `getRecentActivity()` - UNION ALL from assessments, tools, consultations
9. `getNotifications()` - User notifications, unread first
