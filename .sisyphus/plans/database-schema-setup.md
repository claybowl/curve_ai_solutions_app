# Database Schema Setup: Fix Missing PostgreSQL Tables

## TL;DR

> **Quick Summary**: The dashboard page fails because 13+ PostgreSQL tables don't exist in the Neon database. This plan creates a migration system and all missing tables to fix the "relation does not exist" errors.
> 
> **Deliverables**: 
> - Migration infrastructure (runner + tracking table)
> - 19 SQL migration files creating all missing tables
> - Seed data for testing
> - npm scripts for database management
> - Updated documentation
> 
> **Estimated Effort**: Medium (~4-6 hours)
> **Parallel Execution**: NO - sequential dependency chain
> **Critical Path**: Migration infrastructure → Core tables → Related tables → Seed data → Verification

---

## Context

### Original Request
Fix all "relation does not exist" errors appearing in the dashboard. The errors indicate that multiple PostgreSQL tables referenced by `app/actions/dashboard-actions.ts` are missing from the Neon database.

### Missing Tables Analysis
The following tables are referenced in code but don't exist:

**Critical (Dashboard functionality)**:
1. `profiles` - User profile data
2. `assessments` - User assessment records
3. `assessment_results` - Assessment scoring breakdown
4. `assessment_categories` - Assessment category definitions
5. `ai_tools` - AI tool catalog
6. `tool_categories` - Tool categorization
7. `prompts` - Prompt library
8. `prompt_categories` - Prompt categorization
9. `consultations` - User consultations
10. `user_tool_usage` - Tool usage tracking
11. `user_prompt_collections` - User prompt collections
12. `prompt_collection_items` - Items in prompt collections
13. `user_notifications` - User notifications

**Additional (Other features)**:
14. `blog_posts` - Blog content
15. `user_saved_prompts` - Saved prompts junction
16. `roles`, `permissions`, `role_permissions`, `user_roles`, `user_permission_overrides` - RBAC system

### Technical Decisions

**Why Raw SQL over Prisma**: The codebase uses raw SQL throughout (`lib/db.ts`). Introducing Prisma would require significant refactoring of 8+ server action files. Raw SQL migrations are simpler and match the existing pattern.

**Migration System**: Custom Node.js runner with SQL files in `supabase/migrations/`. Uses `schema_migrations` table to track applied migrations. Follows timestamp naming convention (`YYYYMMDDHHMMSS_description.sql`).

**No Test Infrastructure**: Project has zero test framework. Will use manual verification via dashboard page testing.

---

## Work Objectives

### Core Objective
Create all missing PostgreSQL tables with proper schema, constraints, and indexes to eliminate the "relation does not exist" errors and enable full dashboard functionality.

### Concrete Deliverables
1. Migration runner script (`scripts/migrate.js`)
2. Migration tracking table (`schema_migrations`)
3. 19 SQL migration files for all tables
4. Seed data script for testing
5. npm scripts: `db:migrate`, `db:seed`, `db:reset`
6. Updated documentation

### Definition of Done
- [ ] All migration files created and executable
- [ ] Migration runner tested and working
- [ ] Dashboard page loads without database errors
- [ ] All 13+ tables exist in database (verified via `\dt`)
- [ ] Sample data can be inserted into each table
- [ ] Documentation updated with migration instructions

### Must Have
- All tables from dashboard-actions.ts errors
- Foreign key constraints matching code expectations
- Proper indexes on frequently queried columns
- UUID primary keys (consistent with Supabase Auth)
- `created_at`/`updated_at` timestamps on all tables

### Must NOT Have (Guardrails)
- DO NOT modify existing queries in action files
- DO NOT introduce Prisma ORM (raw SQL pattern maintained)
- DO NOT create tables with different names than expected by code
- DO NOT skip foreign key constraints
- DO NOT include production data migration (clean slate approach)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: NO (manual-only)
- **QA approach**: Manual verification via dashboard testing

### Manual Verification Procedures

**For Database Schema Changes:**
1. **Table Creation Verification**:
   ```bash
   psql $DATABASE_URL -c "\dt"
   ```
   Expected: List includes all 19 tables (profiles, assessments, etc.)

2. **Foreign Key Verification**:
   ```bash
   psql $DATABASE_URL -c "\d user_tool_usage"
   ```
   Expected: Shows foreign key constraints to profiles and ai_tools

3. **Index Verification**:
   ```bash
   psql $DATABASE_URL -c "\di"
   ```
   Expected: Indexes exist on user_id, status, created_at columns

4. **Dashboard Page Verification**:
   - Navigate to: `http://localhost:3000/dashboard`
   - Verify: No "relation does not exist" errors in terminal
   - Verify: Dashboard loads with empty states (no 500 errors)

5. **Sample Data Insertion Test**:
   ```sql
   INSERT INTO profiles (user_id, first_name, subscription_status) 
   VALUES ('test-user-id', 'Test', 'free');
   ```
   Expected: Insert succeeds without constraint errors

---

## Execution Strategy

### Sequential Execution (No Parallelism)

Due to foreign key dependencies, tables must be created in strict order:

```
Phase 1: Migration Infrastructure
├── Task 1: Create migration runner script
└── Task 2: Create schema_migrations tracking table

Phase 2: Independent Tables (No FK dependencies)
├── Task 3: Create profiles table
├── Task 4: Create assessment_categories table
├── Task 5: Create tool_categories table
├── Task 6: Create prompt_categories table
├── Task 7: Create roles table
├── Task 8: Create permissions table
└── Task 9: Create blog_posts table

Phase 3: Tables with Dependencies (Wave 1)
├── Task 10: Create ai_tools table (depends: tool_categories)
├── Task 11: Create prompts table (depends: prompt_categories)
└── Task 12: Create assessments table (depends: profiles)

Phase 4: Tables with Dependencies (Wave 2)
├── Task 13: Create assessment_results table (depends: assessments, assessment_categories)
├── Task 14: Create user_tool_usage table (depends: profiles, ai_tools)
├── Task 15: Create user_prompt_collections table (depends: profiles)
└── Task 16: Create consultations table (depends: profiles)

Phase 5: Tables with Dependencies (Wave 3)
├── Task 17: Create prompt_collection_items table (depends: user_prompt_collections, prompts)
├── Task 18: Create user_notifications table (depends: profiles)
├── Task 19: Create user_saved_prompts table (depends: profiles, prompts)
├── Task 20: Create role_permissions table (depends: roles, permissions)
├── Task 21: Create user_roles table (depends: profiles, roles)
└── Task 22: Create user_permission_overrides table (depends: profiles, permissions)

Phase 6: Seed Data & Verification
├── Task 23: Create seed data script
├── Task 24: Apply all migrations
├── Task 25: Run seed data
└── Task 26: Verify dashboard loads without errors
```

### Dependency Matrix

| Table | Depends On | Blocks |
|-------|------------|--------|
| profiles | None | assessments, user_tool_usage, user_prompt_collections, consultations, user_notifications, user_saved_prompts, user_roles, user_permission_overrides |
| assessment_categories | None | assessment_results |
| tool_categories | None | ai_tools |
| prompt_categories | None | prompts |
| ai_tools | tool_categories | user_tool_usage |
| prompts | prompt_categories | user_saved_prompts, prompt_collection_items |
| assessments | profiles | assessment_results |
| assessment_results | assessments, assessment_categories | None |
| user_tool_usage | profiles, ai_tools | None |
| user_prompt_collections | profiles | prompt_collection_items |
| prompt_collection_items | user_prompt_collections, prompts | None |
| consultations | profiles | None |
| user_notifications | profiles | None |
| user_saved_prompts | profiles, prompts | None |
| roles | None | role_permissions, user_roles |
| permissions | None | role_permissions, user_permission_overrides |
| role_permissions | roles, permissions | None |
| user_roles | profiles, roles | None |
| user_permission_overrides | profiles, permissions | None |
| blog_posts | None | None |

---

## TODOs

- [ ] 1. Create migration runner infrastructure

  **What to do**:
  - Create `scripts/migrate.js` - Node.js script to run migrations
  - Create `supabase/migrations/` directory structure
  - Create `schema_migrations` table to track applied migrations
  - Implement migration discovery (read SQL files in order)
  - Implement transaction safety (apply migration or rollback on error)
  
  **Must NOT do**:
  - DO NOT use external migration libraries (Knex, Umzug) - keep it simple
  - DO NOT require additional npm dependencies
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` - Infrastructure setup requires careful design
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: All migration tasks (2-26)
  
  **References**:
  - `lib/db.ts` - Database connection pattern to use
  - `database_migration.md` - Existing documentation on database setup
  
  **Acceptance Criteria**:
  - [ ] `node scripts/migrate.js` runs without errors
  - [ ] Creates `schema_migrations` table if not exists
  - [ ] Reads all `.sql` files from `supabase/migrations/`
  - [ ] Applies unapplied migrations in timestamp order
  - [ ] Records applied migrations in tracking table
  - [ ] Uses transactions (rollback on error)
  
  **Manual Verification**:
  - [ ] Run: `node scripts/migrate.js --dry-run` shows pending migrations
  - [ ] Run: `node scripts/migrate.js` applies migrations
  - [ ] Verify: `psql $DATABASE_URL -c "SELECT * FROM schema_migrations"` shows applied migrations
  
  **Commit**: YES
  - Message: `feat(db): add migration runner infrastructure`
  - Files: `scripts/migrate.js`, `supabase/migrations/README.md`

---

- [ ] 2. Create profiles table migration

  **What to do**:
  - Create `supabase/migrations/001_create_profiles_table.sql`
  - Define columns matching code expectations:
    - `user_id UUID PRIMARY KEY` (links to Supabase Auth)
    - `first_name VARCHAR(100)`
    - `last_name VARCHAR(100)`
    - `email VARCHAR(255)`
    - `subscription_status VARCHAR(50) DEFAULT 'free'`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add index on `user_id` (for lookups)
  - Add index on `subscription_status` (for filtering)
  
  **Must NOT do**:
  - DO NOT use `id SERIAL` - use UUID matching Supabase Auth
  - DO NOT skip the `updated_at` column (needed for future triggers)
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low` - Simple table creation
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with tasks 3-9 - Phase 2)
  - **Parallel Group**: Phase 2 (Independent Tables)
  
  **References**:
  - `app/actions/dashboard-actions.ts:161` - Column names from query
  - `app/actions/video-actions.ts:105` - Additional column usage
  
  **Acceptance Criteria**:
  - [ ] Migration file created with proper schema
  - [ ] `node scripts/migrate.js` applies successfully
  - [ ] `psql $DATABASE_URL -c "\d profiles"` shows correct structure
  
  **Manual Verification**:
  - [ ] Run: `psql $DATABASE_URL -c "INSERT INTO profiles (user_id, first_name, subscription_status) VALUES ('test-uuid', 'Test', 'free');"`
  - [ ] Expected: Insert succeeds
  
  **Commit**: YES
  - Message: `feat(db): add profiles table`
  - Files: `supabase/migrations/001_create_profiles_table.sql`

---

- [ ] 3. Create assessment_categories table migration

  **What to do**:
  - Create `supabase/migrations/002_create_assessment_categories_table.sql`
  - Define columns:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `name VARCHAR(100) NOT NULL`
    - `description TEXT`
    - `sort_order INTEGER DEFAULT 0`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add index on `sort_order` (for ordering)
  
  **Must NOT do**:
  - DO NOT add foreign keys - this is a reference table
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 2 with tasks 2, 4-9)
  
  **References**:
  - `app/actions/dashboard-actions.ts:257` - Join with assessment_categories
  
  **Acceptance Criteria**:
  - [ ] Migration file created
  - [ ] Applied successfully via migration runner
  
  **Manual Verification**:
  - [ ] Insert test category: `INSERT INTO assessment_categories (name, sort_order) VALUES ('Technical Readiness', 1);`
  
  **Commit**: YES
  - Message: `feat(db): add assessment_categories table`

---

- [ ] 4. Create tool_categories table migration

  **What to do**:
  - Create `supabase/migrations/003_create_tool_categories_table.sql`
  - Define columns:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `name VARCHAR(100) NOT NULL`
    - `description TEXT`
    - `icon VARCHAR(50)`
    - `sort_order INTEGER DEFAULT 0`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  
  **Must NOT do**:
  - DO NOT add soft deletes - not used in code
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 2 with tasks 2-3, 5-9)
  
  **References**:
  - `app/actions/dashboard-actions.ts:334` - Join with tool_categories
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add tool_categories table`

---

- [ ] 5. Create prompt_categories table migration

  **What to do**:
  - Create `supabase/migrations/004_create_prompt_categories_table.sql`
  - Define columns:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `name VARCHAR(100) NOT NULL`
    - `description TEXT`
    - `sort_order INTEGER DEFAULT 0`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 2 with tasks 2-4, 6-9)
  
  **References**:
  - `app/actions/dashboard-actions.ts:434` - Join with prompt_categories
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add prompt_categories table`

---

- [ ] 6. Create roles table migration

  **What to do**:
  - Create `supabase/migrations/005_create_roles_table.sql`
  - Define columns:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `name VARCHAR(100) NOT NULL UNIQUE`
    - `description TEXT`
    - `is_system BOOLEAN DEFAULT false`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Insert default roles: 'admin', 'user', 'consultant'
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 2 with tasks 2-5, 7-9)
  
  **References**:
  - `database_migration.md` - Mentions RBAC tables
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  - [ ] Default roles inserted
  
  **Commit**: YES
  - Message: `feat(db): add roles table with default roles`

---

- [ ] 7. Create permissions table migration

  **What to do**:
  - Create `supabase/migrations/006_create_permissions_table.sql`
  - Define columns:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `name VARCHAR(100) NOT NULL UNIQUE`
    - `resource VARCHAR(50) NOT NULL` (e.g., 'users', 'assessments')
    - `action VARCHAR(50) NOT NULL` (e.g., 'read', 'write', 'delete')
    - `description TEXT`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 2 with tasks 2-6, 8-9)
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add permissions table`

---

- [ ] 8. Create blog_posts table migration

  **What to do**:
  - Create `supabase/migrations/007_create_blog_posts_table.sql`
  - Define columns:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `title VARCHAR(255) NOT NULL`
    - `slug VARCHAR(255) UNIQUE`
    - `content TEXT`
    - `excerpt TEXT`
    - `featured_image VARCHAR(500)`
    - `status VARCHAR(20) DEFAULT 'draft'`
    - `published_at TIMESTAMP WITH TIME ZONE`
    - `author_id UUID`
    - `view_count INTEGER DEFAULT 0`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add index on `status`, `published_at`
  - Add index on `slug` (for lookups)
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 2 with tasks 2-7, 9)
  
  **References**:
  - `database_migration.md` - Mentions blog_posts table
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add blog_posts table`

---

- [ ] 9. Create ai_tools table migration

  **What to do**:
  - Create `supabase/migrations/008_create_ai_tools_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:324-337`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `name VARCHAR(200) NOT NULL`
    - `description TEXT`
    - `category_id UUID REFERENCES tool_categories(id) ON DELETE SET NULL`
    - `complexity_level VARCHAR(20)`
    - `average_rating DECIMAL(3,2) DEFAULT 0`
    - `usage_count INTEGER DEFAULT 0`
    - `is_featured BOOLEAN DEFAULT false`
    - `status VARCHAR(20) DEFAULT 'active'`
    - `is_public BOOLEAN DEFAULT true`
    - `api_endpoint VARCHAR(500)`
    - `documentation_url VARCHAR(500)`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add index on `category_id`, `status`, `is_featured`, `is_public`
  
  **Must NOT do**:
  - DO NOT use ON DELETE CASCADE - SET NULL is safer for catalog data
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 3 with tasks 10-12)
  - **Blocked By**: Task 4 (tool_categories)
  
  **References**:
  - `app/actions/dashboard-actions.ts:324-337` - Column names and query structure
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  - [ ] Foreign key constraint exists
  
  **Commit**: YES
  - Message: `feat(db): add ai_tools table`

---

- [ ] 10. Create prompts table migration

  **What to do**:
  - Create `supabase/migrations/009_create_prompts_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:424-437`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `title VARCHAR(255) NOT NULL`
    - `description TEXT`
    - `content TEXT NOT NULL`
    - `category_id UUID REFERENCES prompt_categories(id) ON DELETE SET NULL`
    - `complexity_level VARCHAR(20)`
    - `usage_count INTEGER DEFAULT 0`
    - `average_rating DECIMAL(3,2) DEFAULT 0`
    - `is_featured BOOLEAN DEFAULT false`
    - `status VARCHAR(20) DEFAULT 'active'`
    - `is_public BOOLEAN DEFAULT true`
    - `created_by UUID`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 3 with tasks 9, 11-12)
  - **Blocked By**: Task 5 (prompt_categories)
  
  **References**:
  - `app/actions/dashboard-actions.ts:424-437` - Column names and query structure
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add prompts table`

---

- [ ] 11. Create assessments table migration

  **What to do**:
  - Create `supabase/migrations/010_create_assessments_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:228-241`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `title VARCHAR(255)`
    - `overall_score DECIMAL(5,2)`
    - `status VARCHAR(20) DEFAULT 'in_progress'`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `completed_at TIMESTAMP WITH TIME ZONE`
    - `started_at TIMESTAMP WITH TIME ZONE`
  - Add index on `user_id`, `status`, `created_at`, `completed_at`
  
  **Must NOT do**:
  - DO NOT use ON DELETE SET NULL - assessments should be deleted when user is deleted
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 3 with tasks 9-10, 12)
  - **Blocked By**: Task 2 (profiles)
  
  **References**:
  - `app/actions/dashboard-actions.ts:228-241` - Query structure
  - `app/actions/dashboard-actions.ts:271-283` - History query
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  - [ ] Foreign key to profiles exists
  
  **Commit**: YES
  - Message: `feat(db): add assessments table`

---

- [ ] 12. Create assessment_results table migration

  **What to do**:
  - Create `supabase/migrations/011_create_assessment_results_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:252-262`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE`
    - `category_id UUID NOT NULL REFERENCES assessment_categories(id) ON DELETE CASCADE`
    - `category_score DECIMAL(5,2) NOT NULL`
    - `max_possible_score DECIMAL(5,2)`
    - `feedback TEXT`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add composite unique index on `(assessment_id, category_id)`
  - Add individual indexes on `assessment_id` and `category_id`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 4 with tasks 13-16)
  - **Blocked By**: Tasks 3 (assessment_categories), 11 (assessments)
  
  **References**:
  - `app/actions/dashboard-actions.ts:252-262` - Join and column structure
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  - [ ] Foreign keys exist
  - [ ] Composite unique constraint exists
  
  **Commit**: YES
  - Message: `feat(db): add assessment_results table`

---

- [ ] 13. Create user_tool_usage table migration

  **What to do**:
  - Create `supabase/migrations/012_create_user_tool_usage_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:375-387`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `tool_id UUID NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE`
    - `session_duration INTEGER` (in seconds)
    - `satisfaction_rating INTEGER` (1-5 scale)
    - `usage_data JSONB` (for flexible metadata)
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add composite index on `(user_id, created_at DESC)`
  - Add index on `tool_id`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 4 with tasks 12, 14-16)
  - **Blocked By**: Tasks 2 (profiles), 9 (ai_tools)
  
  **References**:
  - `app/actions/dashboard-actions.ts:375-387` - Query structure
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  - [ ] Foreign keys exist
  
  **Commit**: YES
  - Message: `feat(db): add user_tool_usage table`

---

- [ ] 14. Create user_prompt_collections table migration

  **What to do**:
  - Create `supabase/migrations/013_create_user_prompt_collections_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:475-487`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `name VARCHAR(200) NOT NULL`
    - `description TEXT`
    - `is_default BOOLEAN DEFAULT false`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add index on `user_id`, `is_default`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 4 with tasks 12-13, 15-16)
  - **Blocked By**: Task 2 (profiles)
  
  **References**:
  - `app/actions/dashboard-actions.ts:475-487` - Query with LEFT JOIN and GROUP BY
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add user_prompt_collections table`

---

- [ ] 15. Create prompt_collection_items table migration

  **What to do**:
  - Create `supabase/migrations/014_create_prompt_collection_items_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:482`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `collection_id UUID NOT NULL REFERENCES user_prompt_collections(id) ON DELETE CASCADE`
    - `prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE`
    - `sort_order INTEGER DEFAULT 0`
    - `added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add composite unique index on `(collection_id, prompt_id)`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 5 with tasks 17-22)
  - **Blocked By**: Tasks 10 (prompts), 14 (user_prompt_collections)
  
  **References**:
  - `app/actions/dashboard-actions.ts:482` - LEFT JOIN with prompt_collection_items
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  - [ ] Composite unique constraint exists
  
  **Commit**: YES
  - Message: `feat(db): add prompt_collection_items table`

---

- [ ] 16. Create consultations table migration

  **What to do**:
  - Create `supabase/migrations/015_create_consultations_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:522-532`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `subject VARCHAR(500) NOT NULL`
    - `consultation_type VARCHAR(50)`
    - `status VARCHAR(20) DEFAULT 'pending'`
    - `urgency VARCHAR(20) DEFAULT 'medium'`
    - `description TEXT`
    - `scheduled_at TIMESTAMP WITH TIME ZONE`
    - `completed_at TIMESTAMP WITH TIME ZONE`
    - `assigned_to UUID` (consultant user_id)
    - `meeting_url VARCHAR(500)`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
  - Add index on `user_id`, `status`, `urgency`, `created_at`
  - Add index on `assigned_to`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 4 with tasks 12-15)
  - **Blocked By**: Task 2 (profiles)
  
  **References**:
  - `app/actions/dashboard-actions.ts:522-532` - Query structure
  - `app/actions/consultation-room-actions.ts` - Additional usage
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add consultations table`

---

- [ ] 17. Create user_notifications table migration

  **What to do**:
  - Create `supabase/migrations/016_create_user_notifications_table.sql`
  - Define columns matching `app/actions/dashboard-actions.ts:667-681`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `title VARCHAR(255) NOT NULL`
    - `message TEXT NOT NULL`
    - `notification_type VARCHAR(50)`
    - `is_read BOOLEAN DEFAULT false`
    - `is_archived BOOLEAN DEFAULT false`
    - `related_entity_type VARCHAR(50)`
    - `related_entity_id UUID`
    - `action_url VARCHAR(500)`
    - `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `read_at TIMESTAMP WITH TIME ZONE`
  - Add index on `(user_id, is_read, created_at DESC)`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 5 with tasks 15, 18-22)
  - **Blocked By**: Task 2 (profiles)
  
  **References**:
  - `app/actions/dashboard-actions.ts:667-681` - Query structure
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add user_notifications table`

---

- [ ] 18. Create user_saved_prompts table migration

  **What to do**:
  - Create `supabase/migrations/017_create_user_saved_prompts_table.sql`
  - Define columns:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE`
    - `saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `notes TEXT`
  - Add composite unique index on `(user_id, prompt_id)`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 5 with tasks 15-17, 19-22)
  - **Blocked By**: Tasks 2 (profiles), 10 (prompts)
  
  **References**:
  - `database_migration.md` - Mentions user_saved_prompts table
  
  **Acceptance Criteria**:
  - [ ] Migration file created and applied
  
  **Commit**: YES
  - Message: `feat(db): add user_saved_prompts table`

---

- [ ] 19. Create RBAC junction tables migrations

  **What to do**:
  - Create `supabase/migrations/018_create_role_permissions_table.sql`
    - `role_id UUID REFERENCES roles(id) ON DELETE CASCADE`
    - `permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE`
    - `granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `granted_by UUID`
    - Primary key: `(role_id, permission_id)`
  
  - Create `supabase/migrations/019_create_user_roles_table.sql`
    - `user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `role_id UUID REFERENCES roles(id) ON DELETE CASCADE`
    - `assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `assigned_by UUID`
    - Primary key: `(user_id, role_id)`
  
  - Create `supabase/migrations/020_create_user_permission_overrides_table.sql`
    - `user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE`
    - `permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE`
    - `is_granted BOOLEAN DEFAULT true`
    - `set_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
    - `set_by UUID`
    - `reason TEXT`
    - Primary key: `(user_id, permission_id)`
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (Phase 5 with tasks 15-18)
  - **Blocked By**: Tasks 2 (profiles), 6 (roles), 7 (permissions)
  
  **References**:
  - `database_migration.md` - Mentions RBAC tables
  
  **Acceptance Criteria**:
  - [ ] All 3 migration files created and applied
  - [ ] Composite primary keys exist
  
  **Commit**: YES
  - Message: `feat(db): add RBAC junction tables`

---

- [ ] 20. Create seed data script

  **What to do**:
  - Create `scripts/seed.js` - Node.js script to insert test data
  - Seed data should include:
    - 3 tool categories (e.g., 'Data Analysis', 'Content Creation', 'Automation')
    - 5-10 AI tools (various categories, some featured)
    - 3 prompt categories (e.g., 'Marketing', 'Development', 'Research')
    - 5-10 prompts (various categories, some featured)
    - 5 assessment categories (e.g., 'Technical Readiness', 'Data Infrastructure', etc.)
    - Default roles and permissions
  - Use `lib/db.ts` for database connection
  - Make idempotent (check if data exists before inserting)
  
  **Must NOT do**:
  - DO NOT seed user-specific data (profiles, assessments, etc.) - requires real users
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: All table creation tasks (2-19)
  
  **References**:
  - `scripts/sync-stripe-products.js` - Existing script pattern
  - `lib/db.ts` - Database connection
  
  **Acceptance Criteria**:
  - [ ] Seed script created
  - [ ] `node scripts/seed.js` runs without errors
  - [ ] Data visible in database via queries
  
  **Manual Verification**:
  - [ ] Run: `psql $DATABASE_URL -c "SELECT COUNT(*) FROM ai_tools;"` returns > 0
  - [ ] Run: `psql $DATABASE_URL -c "SELECT COUNT(*) FROM prompts;"` returns > 0
  
  **Commit**: YES
  - Message: `feat(db): add seed data script`
  - Files: `scripts/seed.js`

---

- [ ] 21. Add npm scripts for database management

  **What to do**:
  - Add to `package.json` scripts section:
    ```json
    "db:migrate": "node scripts/migrate.js",
    "db:migrate:status": "node scripts/migrate.js --status",
    "db:seed": "node scripts/seed.js",
    "db:reset": "node scripts/migrate.js --reset && node scripts/seed.js"
    ```
  - Update `database_migration.md` with new instructions
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with task 22)
  - **Blocked By**: Tasks 1, 20
  
  **Acceptance Criteria**:
  - [ ] npm scripts added to package.json
  - [ ] `npm run db:migrate` works
  - [ ] `npm run db:seed` works
  
  **Manual Verification**:
  - [ ] Run: `npm run db:migrate -- --dry-run` shows pending migrations
  
  **Commit**: YES
  - Message: `chore: add database management npm scripts`

---

- [ ] 22. Verify dashboard loads without errors

  **What to do**:
  - Apply all migrations: `npm run db:migrate`
  - Seed data: `npm run db:seed`
  - Start dev server: `npm run dev`
  - Navigate to `http://localhost:3000/dashboard`
  - Verify terminal shows NO "relation does not exist" errors
  - Verify dashboard renders with empty states or seeded data
  - Create a test user and verify profile creation works
  
  **Must NOT do**:
  - DO NOT skip this verification - it's the primary success criterion
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `git-master`
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with task 21)
  - **Blocked By**: All previous tasks (1-21)
  
  **References**:
  - Original error log - verify each error is resolved:
    - consultations ✓
    - assessments ✓
    - prompts ✓
    - user_prompt_collections ✓
    - user_notifications ✓
    - tool_categories ✓
    - profiles ✓
    - user_tool_usage ✓
  
  **Acceptance Criteria**:
  - [ ] All migrations applied successfully
  - [ ] Seed data inserted
  - [ ] Dashboard page loads without database errors
  - [ ] No "relation does not exist" errors in terminal
  
  **Manual Verification**:
  - [ ] Browser: Navigate to `http://localhost:3000/dashboard`
  - [ ] Terminal: Verify no database errors
  - [ ] Browser: Verify dashboard UI renders
  
  **Commit**: YES
  - Message: `docs: update database migration documentation`

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 1 | `feat(db): add migration runner infrastructure` | `scripts/migrate.js`, `supabase/migrations/README.md` |
| 2-19 (each) | `feat(db): add [table_name] table` | `supabase/migrations/XXX_create_*.sql` |
| 20 | `feat(db): add seed data script` | `scripts/seed.js` |
| 21 | `chore: add database management npm scripts` | `package.json` |
| 22 | `docs: update database migration documentation` | `database_migration.md` |

---

## Success Criteria

### Verification Commands
```bash
# Verify all tables exist
psql $DATABASE_URL -c "\dt"

# Verify specific tables (should return 0 errors)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM profiles;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM assessments;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM ai_tools;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM prompts;"

# Verify dashboard loads
curl -s http://localhost:3000/dashboard | head -20
```

### Final Checklist
- [ ] All 19 tables created in database
- [ ] Migration runner working (`npm run db:migrate`)
- [ ] Seed data script working (`npm run db:seed`)
- [ ] Dashboard page loads without "relation does not exist" errors
- [ ] Foreign key constraints in place
- [ ] Indexes created for performance
- [ ] Documentation updated

---

## Notes on Schema Design

### UUID Usage
All primary keys use UUID (matching Supabase Auth). This allows seamless integration with Supabase user IDs without type conversion issues.

### Foreign Key Constraints
- **ON DELETE CASCADE**: Used for user-specific data (assessments, tool usage) that has no value without the user
- **ON DELETE SET NULL**: Used for catalog references (tool categories) to preserve data integrity

### Timestamps
All tables include:
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()` (for tables that may be updated)

### Indexes
Created on:
- Foreign key columns (for JOIN performance)
- Status columns (for filtering)
- Created_at columns (for sorting)
- User_id columns (for user-scoped queries)

### References
- [Neon Database Documentation](https://neon.tech/docs)
- [Prisma Postgres Guide](https://www.prisma.io/docs/guides/nextjs) - For comparison (project uses raw SQL instead)
