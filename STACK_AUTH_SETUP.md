# Stack Auth Setup Guide

## Package Installation

The Stack Auth SDK package `@stackframe/js` has been added to `package.json`. Install it with:

```bash
npm install @stackframe/js
# or
pnpm install @stackframe/js
```

## Environment Variables

Add these to your `.env.local` file (get values from https://app.stack-auth.com/):

```env
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-client-key
STACK_SECRET_SERVER_KEY=your-secret-server-key
```

## Stack Auth Configuration Files

Two configuration files have been created:

1. **`stack/server.ts`** - Server-side Stack Auth initialization
2. **`stack/client.ts`** - Client-side Stack Auth initialization

These files use environment variables and will throw errors if the variables are missing.

## Permission System Setup

Stack Auth uses a **permission-based system** instead of simple roles. To set up admin access:

1. Go to Stack Auth Dashboard → Permissions
2. Create an `admin` permission
3. Assign the `admin` permission to admin users

The code checks for `user.permissions.includes('admin')` to determine admin access.

## Business Data Database Decision

**Important**: Stack Auth handles authentication and user management, but **business data tables** (consultations, assessments, prompts, tools, workflows) need a separate database solution.

### Option A: Stack Auth Database (if supported)
If Stack Auth's database supports custom tables, migrate business tables there.

### Option B: Separate Database (Recommended)
Use a separate PostgreSQL/MySQL database for business data:
- Create tables: `consultations`, `assessments`, `prompts`, `ai_tools`, `n8n_workflows`, etc.
- Use Stack Auth user IDs as foreign keys (instead of `profiles.user_id`)
- Implement `lib/db-business.ts` with database client

### Current Status
- Business data queries are prepared but return empty arrays/errors
- Database client needs to be implemented in `lib/db-business.ts`
- All business data action files have TODOs for database integration

## Next Steps

1. **Install Package**: Run `npm install @stackframe/js`
2. **Get API Keys**: Sign up at https://app.stack-auth.com/ and create a project
3. **Configure Environment**: Add Stack Auth keys to `.env.local`
4. **Set Up Permissions**: Create `admin` permission in Stack Auth dashboard
5. **Create Admin User**: Use Stack Auth dashboard or assign `admin` permission to your user
6. **Configure Business Database**: Decide on database solution and implement `lib/db-business.ts`
7. **Test Authentication**: Try logging in at `/login`

## Testing Checklist

- [ ] Install `@stackframe/js` package
- [ ] Configure environment variables
- [ ] Test login at `/login`
- [ ] Test signup at `/signup`
- [ ] Test admin route protection at `/admin`
- [ ] Test user profile access
- [ ] Verify admin permission checks work
- [ ] Test OAuth providers (if configured)

## API Reference

### Client-Side (use in components)
```typescript
import { stackClientApp } from '@/stack/client'
import { useAuth } from '@/providers/stack-auth-provider'

// In components
const { user, loading, signOut } = useAuth()
await stackClientApp.signInWithCredential({ email, password })
await stackClientApp.signUp({ email, password, displayName })
await stackClientApp.signInWithOAuth('google')
```

### Server-Side (use in server actions/API routes)
```typescript
import { stackServerApp } from '@/stack/server'
import { getCurrentUserServer, requireAdmin, isUserAdmin } from '@/lib/stack-auth-server'

// Get current user
const user = await getCurrentUserServer()

// Require authentication
const user = await requireAuth()

// Check admin
const isAdmin = await isUserAdmin()

// Require admin
const adminUser = await requireAdmin()
```

### Admin Operations
```typescript
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, assignPermissionToUser } from '@/lib/stack-auth-admin'

// List users
const users = await getAllUsers({ limit: 100, offset: 0 })

// Get user
const user = await getUserById(userId)

// Create user
const newUser = await createUser({ email, password, displayName, customData })

// Update user
await updateUser(userId, { displayName, customData })

// Assign permission
await assignPermissionToUser(userId, 'admin')
```

## Troubleshooting

### "Missing environment variables" error
- Ensure `.env.local` has all three Stack Auth variables
- Restart dev server after adding environment variables

### User permissions not working
- Verify `admin` permission exists in Stack Auth dashboard
- Assign `admin` permission to your user in Stack Auth dashboard
- Check that `user.permissions` includes 'admin'

### OAuth not working
- Configure OAuth providers in Stack Auth dashboard
- Add redirect URLs to OAuth provider settings
- Verify callback URL is set correctly

### Business data queries failing
- Implement `lib/db-business.ts` with your chosen database
- Update business data action files to use the database client
- Migrate existing business data tables to new database

