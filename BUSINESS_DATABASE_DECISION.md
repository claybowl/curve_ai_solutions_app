# Business Database Decision Guide

## Current Situation

Stack Auth handles **authentication and user management** with its built-in database. However, your application also has **business data tables** that need storage:

- `consultations` - Consultation requests
- `assessments` - AI assessment responses  
- `assessment_questions` - Assessment questions
- `assessment_categories` - Assessment categories
- `prompts` - Prompt library entries
- `ai_tools` - AI tools catalog
- `n8n_workflows` - N8N workflow definitions
- `n8n_workflow_executions` - Workflow execution logs

## Decision Required

You need to decide how to store this business data:

### Option A: Stack Auth's Database (if supported)

**Pros:**
- Single database solution
- Integrated with Stack Auth
- No separate database to manage

**Cons:**
- Unknown if Stack Auth supports custom tables
- May have limitations on schema design
- Vendor lock-in

**Action Required:**
1. Check Stack Auth documentation for custom table support
2. If supported, migrate business tables to Stack Auth database
3. Update foreign keys to use Stack Auth user IDs

### Option B: Separate PostgreSQL Database (Recommended)

**Pros:**
- Full control over schema
- Can use existing PostgreSQL knowledge
- Independent of Stack Auth
- Better for complex queries and relationships

**Cons:**
- Two databases to manage
- Need to sync user IDs between systems

**Action Required:**
1. Set up PostgreSQL database (Neon, Supabase, Vercel Postgres, etc.)
2. Create business data tables
3. Use Stack Auth user IDs as foreign keys
4. Implement `lib/db-business.ts` with PostgreSQL client
5. Update all business data action files

### Option C: Stack Auth Custom Data Storage

**Pros:**
- Uses Stack Auth's built-in storage
- Integrated solution

**Cons:**
- May not be suitable for relational data
- Query capabilities may be limited
- Not ideal for complex business logic

**Action Required:**
1. Check if Stack Auth's customData can store complex relationships
2. Restructure data model if needed
3. Update queries to use Stack Auth storage API

## Recommended Approach: Option B (Separate PostgreSQL)

Based on your existing architecture and data complexity, **Option B is recommended**:

1. **Set up PostgreSQL database** (Neon, Supabase PostgreSQL-only, or Vercel Postgres)
2. **Create business tables** with Stack Auth user IDs as foreign keys
3. **Implement database client** in `lib/db-business.ts`
4. **Update server actions** to use business database

## Implementation Steps for Option B

### 1. Database Setup

Choose a PostgreSQL provider and create a new database.

### 2. Create Database Schema

Create tables for business data:

```sql
-- Consultations table
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Stack Auth user ID
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  consultation_type TEXT,
  urgency TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  priority_score INTEGER DEFAULT 0,
  -- ... other fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Similar tables for assessments, prompts, tools, workflows
```

### 3. Implement Database Client

Update `lib/db-business.ts`:

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function getBusinessDatabaseClient() {
  return pool
}
```

### 4. Update Server Actions

Update files like `app/actions/consultation-actions.ts` to use the business database instead of Stack Auth.

## Current Status

- ✅ Authentication migrated to Stack Auth
- ✅ User management migrated to Stack Auth  
- ⚠️ Business data queries return empty arrays/errors
- ⚠️ Database client needs implementation
- ⚠️ Business tables need migration

## Next Steps

1. **Decide on database solution** (Option A, B, or C)
2. **Set up chosen database**
3. **Create/verify business data tables**
4. **Implement `lib/db-business.ts`**
5. **Update business data server actions**
6. **Test all business data operations**

