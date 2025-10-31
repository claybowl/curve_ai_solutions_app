# 🧪 Complete Testing Guide - Supabase Database & Features

This guide walks you through testing all the features we've implemented, with step-by-step instructions and expected results.

---

## 📋 Pre-Testing Checklist

Before you start testing, ensure:

- [ ] Development server is running (`pnpm dev`)
- [ ] Supabase environment variables are set in `.env.local`
- [ ] You have an admin user account
- [ ] Database migrations have been applied

---

## Test 1: Database Connection & Schema ✅

### What We're Testing
Verify that the database is properly configured with all tables, RLS policies, and sample data.

### Steps
1. Open Supabase Dashboard (https://supabase.com/dashboard)
2. Navigate to your project → Database → Tables
3. Verify the following tables exist:
   - `profiles` (8 rows)
   - `n8n_workflows` (6 rows)
   - `n8n_workflow_executions` (0 rows initially)
   - `solutions` (4 rows)
   - `ai_tools` (6 rows)
   - All other tables from the schema

### Expected Result
✅ All 23 tables visible
✅ RLS enabled on all tables (green shield icon)
✅ Sample data present in key tables

### Troubleshooting
- **Tables missing?** Run migrations via MCP server
- **No RLS?** Check migration logs for errors

---

## Test 2: Row Level Security (RLS) Policies 🔒

### What We're Testing
Verify that users can only access data they're authorized to see.

### Steps

#### Test 2A: Regular User Access
1. Login as a regular user (non-admin)
2. Open browser DevTools → Console
3. Run this code:
```javascript
const { data: workflows } = await supabase
  .from('n8n_workflows')
  .select('*')
console.log('Workflows:', workflows)
```

**Expected Result:** `[]` (empty array - regular users can't see workflows)

4. Run this code:
```javascript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
console.log('Profiles:', profile)
```

**Expected Result:** Only YOUR profile returned (1 row)

#### Test 2B: Admin User Access
1. Login as an admin user
2. Run the same workflow query:
```javascript
const { data: workflows } = await supabase
  .from('n8n_workflows')
  .select('*')
console.log('Workflows:', workflows)
```

**Expected Result:** All 6 workflows returned

3. Run the profiles query:
```javascript
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
console.log('Profiles:', profiles)
```

**Expected Result:** All 8 profiles returned

### Expected Results Summary
✅ Regular users see only their own data
✅ Admins see all data
✅ Unauthorized access blocked

### Troubleshooting
- **Getting all data as regular user?** Check RLS policies in Supabase dashboard
- **Can't access anything?** Verify user role in profiles table

---

## Test 3: N8N Workflow Dashboard 🤖

### What We're Testing
The AI Agents admin dashboard displays workflows and allows triggering them.

### Steps
1. Navigate to `http://localhost:3000/admin/ai-agents`
2. Verify you see:
   - 3 stat cards (Total Workflows, Total Executions, Recent Activity)
   - 6 workflow cards with icons and descriptions
   - Execution history table (empty initially)

3. Click on any workflow card's **"Trigger Workflow"** button
4. Observe:
   - Button shows "Executing..." with loading spinner
   - After a few seconds, toast notification appears
   - Stats update automatically
   - Execution appears in history table

### Expected Results
✅ Dashboard displays all workflows
✅ Workflow trigger creates execution record
✅ Stats update after execution
✅ Execution history shows new entry

### Troubleshooting
- **No workflows showing?** Check database: `SELECT * FROM n8n_workflows`
- **Trigger fails?** Workflow might not have webhook URL configured
- **Permission denied?** Ensure you're logged in as admin

---

## Test 4: TypeScript Type Safety 💪

### What We're Testing
Verify that database queries have full TypeScript support.

### Steps
1. Open `app/actions/workflow-actions.ts`
2. Add this code:
```typescript
import { Tables } from '@/types/database.types'

// This should have full IntelliSense
type WorkflowRow = Tables<'n8n_workflows'>

// Try accessing a property - you should see autocomplete
const exampleWorkflow: WorkflowRow = {
  id: 'test',
  name: 'Test Workflow',
  // VS Code should suggest all other fields
}
```

3. Type an incorrect field name and observe the TypeScript error

### Expected Results
✅ Full IntelliSense for all table columns
✅ TypeScript errors for invalid field names
✅ Autocomplete for table names in `.from()`

### Troubleshooting
- **No types showing?** Restart TypeScript server in VS Code
- **Import errors?** Verify `types/database.types.ts` exists
- **Types outdated?** Regenerate with `mcp_supabase_generate_typescript_types()`

---

## Test 5: Real-time Workflow Monitoring 🔴

### What We're Testing
Live updates using Supabase Realtime - no page refresh needed!

### Steps
1. Navigate to `http://localhost:3000/admin/ai-agents/test-realtime`
2. Verify you see:
   - Left column: Workflow cards
   - Right column: Live Execution Monitor
   - Green connection status dot

3. **Multi-tab Test:**
   - Open the same page in 2 browser tabs side by side
   - In Tab 1: Click "Trigger Workflow"
   - In Tab 2: Watch the execution appear automatically (no refresh!)

4. **Status Updates:**
   - Watch the execution status change from "Pending" → "Running" → "Success/Failed"
   - Duration updates automatically when execution completes

### Expected Results
✅ Green "Connected" indicator shows WebSocket is active
✅ New executions appear in real-time without refresh
✅ Updates sync across multiple browser tabs
✅ Status badges update automatically

### Troubleshooting
- **Disconnected status?** Check Supabase Realtime is enabled on `n8n_workflow_executions` table
- **No updates?** Check browser console for subscription errors
- **Connection drops?** Restart dev server

---

## Test 6: Solutions Showcase 📊

### What We're Testing
Sample case studies are properly stored and displayed.

### Steps
1. Run this query in Supabase SQL Editor:
```sql
SELECT 
  title, 
  client_name, 
  client_industry,
  status,
  is_featured 
FROM solutions 
WHERE status = 'published';
```

2. Expected: 3 published solutions:
   - "Automated Customer Support with AI Chatbot" (Retail)
   - "Lead Qualification Automation" (Marketing)
   - "Business Process Analysis" (Manufacturing)

3. Navigate to solutions page (if exists) and verify they display correctly

### Expected Results
✅ 3+ solutions in database
✅ All have complete data (client info, metrics, testimonials)
✅ RLS allows public viewing of published solutions

### Troubleshooting
- **No solutions?** Run the sample data insert from `QUICK_START_GUIDE_CLAY.md`
- **Can't view as regular user?** Check RLS policy `"Anyone can view published solutions"`

---

## Test 7: Database Functions & Triggers ⚙️

### What We're Testing
Auto-update timestamps, execution duration calculation, and other database automation.

### Steps

#### Test 7A: Auto-Update Timestamps
1. Update a workflow:
```sql
UPDATE n8n_workflows 
SET description = 'Updated description' 
WHERE name = 'New Consultation Alert';
```

2. Check the `updated_at` field:
```sql
SELECT name, updated_at FROM n8n_workflows 
WHERE name = 'New Consultation Alert';
```

**Expected:** `updated_at` should be current timestamp

#### Test 7B: Execution Duration Calculation
1. Create a test execution:
```sql
INSERT INTO n8n_workflow_executions (workflow_id, status, started_at)
SELECT id, 'running', NOW() 
FROM n8n_workflows 
LIMIT 1;
```

2. Update with completion time:
```sql
UPDATE n8n_workflow_executions 
SET status = 'success', completed_at = NOW() + INTERVAL '30 seconds'
WHERE status = 'running';
```

3. Check duration:
```sql
SELECT status, duration_seconds 
FROM n8n_workflow_executions 
ORDER BY started_at DESC 
LIMIT 1;
```

**Expected:** `duration_seconds` should be `30`

#### Test 7C: Workflow Stats Auto-Update
1. Note current execution count:
```sql
SELECT name, execution_count FROM n8n_workflows LIMIT 1;
```

2. Mark an execution as successful (from Test 7B)
3. Check execution count again

**Expected:** `execution_count` increased by 1

### Expected Results
✅ Timestamps update automatically
✅ Duration calculated on execution completion
✅ Workflow stats increment on successful execution

### Troubleshooting
- **Timestamps not updating?** Check trigger exists: `update_profiles_updated_at`
- **Duration not calculated?** Check trigger: `calculate_duration_trigger`
- **Stats not updating?** Check trigger: `update_workflow_stats_trigger`

---

## Test 8: Performance & Indexing 🚀

### What We're Testing
Database queries are fast and indexes are being used.

### Steps
1. In Supabase Dashboard → Database → Query Performance
2. Run this query:
```sql
EXPLAIN ANALYZE
SELECT * FROM n8n_workflows 
WHERE is_active = true 
ORDER BY name;
```

3. Look for "Index Scan" in the output (not "Seq Scan")

4. Test a complex query:
```sql
EXPLAIN ANALYZE
SELECT 
  w.name,
  COUNT(e.id) as total_executions,
  AVG(e.duration_seconds) as avg_duration
FROM n8n_workflows w
LEFT JOIN n8n_workflow_executions e ON w.id = e.workflow_id
WHERE w.is_active = true
GROUP BY w.id, w.name;
```

### Expected Results
✅ Queries use indexes (Index Scan, not Seq Scan)
✅ Query time < 10ms for most queries
✅ Complex joins perform well

### Troubleshooting
- **Slow queries?** Check if indexes exist: `SELECT * FROM pg_indexes WHERE tablename = 'n8n_workflows'`
- **Sequential scans?** Index might not be optimal for query pattern

---

## Test 9: Error Handling & Edge Cases 🛡️

### What We're Testing
Application handles errors gracefully.

### Steps

#### Test 9A: Invalid Workflow Trigger
1. Try to execute a workflow without webhook URL:
```typescript
await executeWorkflow('workflow-id-with-no-webhook', {})
```

**Expected:** Error message: "Workflow does not have a webhook URL configured"

#### Test 9B: Unauthorized Access
1. Logout (or use regular user)
2. Try to access admin dashboard: `/admin/ai-agents`

**Expected:** Redirect to login or "Access Denied" message

#### Test 9C: Database Connection Loss
1. Temporarily disconnect from internet
2. Try to trigger a workflow

**Expected:** User-friendly error message, not a crash

### Expected Results
✅ Errors are caught and displayed to user
✅ No uncaught exceptions or crashes
✅ Graceful degradation when services unavailable

---

## Test 10: Migration History & Rollback 🔄

### What We're Testing
All migrations applied successfully and can be tracked.

### Steps
1. Check applied migrations:
```sql
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY version DESC;
```

**Expected:** 9 migrations listed

2. Verify specific migrations:
```sql
SELECT version, name 
FROM supabase_migrations.schema_migrations 
WHERE name LIKE '%n8n%';
```

**Expected:** At least 2 n8n-related migrations

### Expected Results
✅ All migrations have timestamps
✅ No failed migrations
✅ Migrations applied in correct order

---

## 📊 Complete Testing Checklist

Mark each test as you complete it:

- [ ] Test 1: Database Connection & Schema
- [ ] Test 2: Row Level Security Policies
- [ ] Test 3: N8N Workflow Dashboard
- [ ] Test 4: TypeScript Type Safety
- [ ] Test 5: Real-time Workflow Monitoring
- [ ] Test 6: Solutions Showcase
- [ ] Test 7: Database Functions & Triggers
- [ ] Test 8: Performance & Indexing
- [ ] Test 9: Error Handling & Edge Cases
- [ ] Test 10: Migration History & Rollback

---

## 🐛 Common Issues & Solutions

### Issue: "Missing environment variables"
**Solution:** Ensure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Issue: "Row Level Security policy violated"
**Solution:** Check if user has correct role in profiles table:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email';
```

### Issue: "Cannot read properties of null"
**Solution:** Database might not be initialized. Run migrations via MCP server.

### Issue: "Real-time not working"
**Solution:** Verify table is in publication:
```sql
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'n8n_workflow_executions';
```

---

## 🎯 Success Criteria

You've successfully tested everything if:

✅ All 10 tests pass
✅ No console errors during testing
✅ Real-time updates work smoothly
✅ RLS policies protect data correctly
✅ TypeScript provides full type safety
✅ Database queries are fast (<50ms)
✅ Error handling is graceful

---

## 📝 Reporting Issues

If you encounter issues during testing:

1. Check the troubleshooting section for that test
2. Review Supabase logs in dashboard
3. Check browser console for errors
4. Verify database state with SQL queries
5. Document the issue with steps to reproduce

---

**Testing Guide Version:** 1.0  
**Created:** October 31, 2025  
**Last Updated:** October 31, 2025

Happy Testing! 🚀


