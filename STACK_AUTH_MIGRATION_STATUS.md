# Stack Auth Migration Status

## Overview
This document tracks the progress of migrating from Supabase Auth to Stack Auth.

## ✅ Completed Phases

### Phase 1: Stack Auth Setup & Configuration
- ✅ Removed Supabase packages from `package.json`
- ✅ Added Stack Auth package placeholder (`@stack-auth/stack`)
- ✅ Created environment variable template (`.env.local.example`)
- ✅ Created Stack Auth client utilities (`lib/stack-auth-client.ts`)
- ✅ Created Stack Auth server utilities (`lib/stack-auth-server.ts`)
- ✅ Created Stack Auth admin utilities (`lib/stack-auth-admin.ts`)

### Phase 2: Delete Supabase Auth Infrastructure
- ✅ Deleted all Supabase library files (7 files)
- ✅ Deleted Supabase auth components (4 files)
- ✅ Deleted Supabase auth pages (login, signup, debug pages - 10+ files)
- ✅ Deleted Supabase auth API routes (15+ files)
- ✅ Deleted Supabase middleware
- ✅ Deleted admin test pages

### Phase 3: Build Stack Auth Integration
- ✅ Created Stack Auth provider (`providers/stack-auth-provider.tsx`)
- ✅ Created Stack Auth middleware (`middleware.ts`)
- ✅ Created login page with Stack Auth components (`app/login/page.tsx`)
- ✅ Created signup page with Stack Auth components (`app/signup/page.tsx`)
- ✅ Created auth callback route (`app/auth/callback/route.ts`)
- ✅ Updated root layout to use Stack Auth provider

## ⚠️ Critical Next Steps

### 1. Install Stack Auth SDK
**ACTION REQUIRED**: The exact Stack Auth npm package name needs to be verified and installed.

```bash
# TODO: Verify the correct package name from Stack Auth documentation
pnpm install @stack-auth/stack  # or whatever the actual package name is
```

### 2. Configure Environment Variables
Add these to your `.env.local` file (get values from https://app.stack-auth.com/):
```
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-client-key
STACK_SECRET_SERVER_KEY=your-secret-server-key
```

### 3. Update Stack Auth Client Files
All placeholder implementations in these files need to be replaced with actual Stack Auth SDK calls:
- `lib/stack-auth-client.ts` - Replace TODOs with actual Stack Auth client SDK
- `lib/stack-auth-server.ts` - Replace TODOs with actual Stack Auth server SDK
- `lib/stack-auth-admin.ts` - Replace TODOs with actual Stack Auth admin API

### 4. Update Stack Auth Provider
`providers/stack-auth-provider.tsx` needs to use actual Stack Auth hooks:
- Replace placeholder state management with `useUser()` and `useStackApp()` hooks
- Integrate with Stack Auth's session management

### 5. Update Auth Pages
- `app/login/page.tsx` - Replace placeholder with `<SignIn>` component from Stack Auth
- `app/signup/page.tsx` - Replace placeholder with `<SignUp>` component from Stack Auth
- `app/auth/callback/route.ts` - Implement actual OAuth/magic link callback handling

### 6. Update Middleware
`middleware.ts` needs actual Stack Auth session validation:
- Implement session checking using Stack Auth SDK
- Implement admin permission checking using Stack Auth permissions system

## 📋 Remaining Phases

### Phase 4: Rebuild Server Actions
**Status**: Not Started
**Files to Update**:
- `app/actions/auth-actions.ts`
- `app/actions/user-actions.ts`
- `app/actions/admin-dashboard-actions.ts`
- `app/actions/consultation-actions.ts`
- `app/actions/assessment-actions.ts`
- `app/actions/prompt-actions.ts`
- `app/actions/tool-actions.ts`
- `app/actions/tool-management-actions.ts`
- `app/actions/workflow-actions.ts`
- `app/actions/stats-actions.ts`
- `app/actions/permission-actions.ts`
- `app/actions/contact-actions.ts`

**Action**: Replace all Supabase queries/user lookups with Stack Auth API calls.

### Phase 5: Rebuild Admin Dashboards
**Status**: Not Started
**Files to Update**:
- `app/admin/layout.tsx` - Replace Supabase auth checks with Stack Auth
- All admin dashboard pages (`app/admin/*/page.tsx`)
- Update user references to use Stack Auth user IDs
- Replace permission checks with Stack Auth permission system

### Phase 6: Update Client Components
**Status**: Not Started
**Files to Update**:
- `components/navbar.tsx`
- `components/main-nav.tsx`
- `components/user-profile-dropdown.tsx`
- `components/user-profile.tsx`
- `app/dashboard/page.tsx`

**Action**: Replace Supabase auth hooks with Stack Auth hooks.

### Phase 7: Database Migration
**Status**: Not Started
**Note**: Stack Auth uses its own built-in database. Business data tables (consultations, assessments, etc.) may need to:
- Use Stack Auth's database if it supports custom tables, OR
- Use a separate database with foreign keys to Stack Auth user IDs

**Files to Consider**:
- `lib/db-v2.ts` - May need updates if still using Supabase
- `lib/db-tools-v2.ts` - May need updates if still using Supabase

### Phase 8: API Routes Cleanup
**Status**: Not Started
**Files to Update**:
- `app/api/admin/users/route.ts`
- `app/api/admin/users/update/route.ts`
- `app/api/admin/users/role/route.ts`
- Other admin API routes

**Action**: Replace Supabase API calls with Stack Auth Admin API.

### Phase 9: Testing & Validation
**Status**: Not Started
- Test authentication flows
- Test authorization checks
- Test admin dashboards
- Test API routes

### Phase 10: Documentation & Cleanup
**Status**: Not Started
- Update `CLAUDE.md`
- Remove Supabase references
- Document Stack Auth setup

## 🔍 Key Integration Points

### Stack Auth SDK Usage Pattern
Based on Stack Auth documentation, the typical usage pattern is:

**Client-side:**
```typescript
import { useUser, useStackApp } from '@stack-auth/stack'

const user = useUser({ or: 'redirect' })
const app = useStackApp()
```

**Server-side:**
```typescript
import { getServerSession } from '@stack-auth/stack'

const session = await getServerSession()
const user = session?.user
```

**Admin operations:**
```typescript
import { StackAdmin } from '@stack-auth/stack'

const admin = new StackAdmin({ projectId, secretKey })
const users = await admin.users.list()
```

### Permission System
Stack Auth uses a permissions/roles system. Replace the current `profiles.role` approach with:
- Stack Auth's permission system
- Team/organization roles
- User-level permissions

## ⚠️ Important Notes

1. **Package Name**: The exact Stack Auth npm package name needs to be verified from their documentation.

2. **Database**: Stack Auth's built-in database may not support custom business tables. Verify this and plan accordingly.

3. **User IDs**: All references to Supabase user IDs need to be updated to Stack Auth user IDs.

4. **Breaking Changes**: This migration breaks the application until Stack Auth SDK is properly integrated. Do not deploy until testing is complete.

5. **Free Tier**: Stack Auth free tier supports up to 1,000 MAU. Verify this meets your needs.

## 📚 Resources

- Stack Auth Documentation: https://docs.stack-auth.com
- Stack Auth Dashboard: https://app.stack-auth.com/
- Stack Auth GitHub: (verify URL)

## Next Actions

1. **IMMEDIATE**: Install and configure Stack Auth SDK
2. **IMMEDIATE**: Update all placeholder implementations with actual Stack Auth SDK calls
3. **THEN**: Update server actions
4. **THEN**: Update admin dashboards
5. **THEN**: Update client components
6. **FINALLY**: Test everything thoroughly

