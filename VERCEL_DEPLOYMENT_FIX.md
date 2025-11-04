# Vercel Deployment Fix - Multiple Build Issues Resolved

## Issues Fixed

### 1. Stack Auth Build Error (PRIMARY ISSUE FROM VERCEL)
**Error:**
```
Error: Missing NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable
    at stack/server.ts
```

**Root Cause:** The `stack/server.ts` file was checking for environment variables at **module initialization time**, which happens during the build phase. When these environment variables weren't available during the build, the build would fail.

### 2. Missing Root Not-Found Page
**Error:** `Cannot find module for page: /_not-found`

**Fix:** Added `app/not-found.tsx` for proper 404 handling.

### 3. Consultation Page Prerendering
**Error:** `TypeError: Cannot read properties of undefined (reading 'call')` during prerendering of `/consultation`

**Fix:** Added `export const dynamic = 'force-dynamic'` to force runtime rendering.

### 4. Webpack Configuration Issues
**Errors:** Various build-time errors with complex webpack config and deprecated options.

**Fix:** Simplified `next.config.mjs` by removing complex webpack customizations and deprecated `onDemandEntries`.

### 5. Windows Standalone Build Permission Issue (Local Only)
**Error:** `EPERM: operation not permitted, symlink` when creating standalone build.

**Fix:** Made `output: 'standalone'` conditional - only enabled on Vercel, not on local Windows builds.

## Solution
We implemented **lazy initialization** with build-time safety for the Stack Auth server:

1. **Removed module-level checks**: Instead of throwing errors immediately when the module loads, we now initialize Stack Auth only when it's actually used.

2. **Added mock fallback**: During build time, if credentials are missing, we return a mock server that won't break the build.

3. **Runtime validation**: At runtime (when the app is actually running), we still validate that credentials are present and throw helpful errors if they're missing.

4. **Proxy pattern**: We use a JavaScript Proxy to intercept access to the `stackServerApp` and initialize it lazily only when needed.

## Files Changed
- `stack/server.ts` - Implemented lazy initialization with build-time safety (PRIMARY FIX)
- `app/not-found.tsx` - Added root 404 page
- `app/consultation/page.tsx` - Added dynamic rendering export
- `next.config.mjs` - Simplified configuration, removed webpack customizations, made standalone conditional

## Similar Previous Fixes
This follows the same pattern we used to fix Supabase build errors:
- `lib/supabase-client.ts` - Build-safe client initialization
- `lib/supabase-migration.ts` - Dynamic imports for build safety

## Testing the Fix

### Local Build Test
```bash
pnpm run build
```

### Deploy to Vercel
1. Commit and push the changes
2. Vercel will automatically deploy
3. The build should now succeed even without Stack Auth credentials
4. Add the required environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`

## Environment Variables Setup

### For Stack Auth (when ready to use)
Add these to your Vercel project settings:

```bash
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
STACK_SECRET_SERVER_KEY=your-secret-key
```

Get these values from: https://app.stack-auth.com/

### Current Auth System
The app currently uses **Supabase Auth** as the primary authentication system. Stack Auth integration is prepared but not required for the app to function.

Required Supabase environment variables (should already be set):
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## What This Means

✅ **Build will succeed** even without Stack Auth credentials
✅ **App will function** using Supabase Auth
✅ **Stack Auth can be added later** by simply adding the environment variables
✅ **No code changes needed** to enable Stack Auth once credentials are added

## Next Steps

1. **Test the build locally** to ensure it works
2. **Deploy to Vercel** and verify successful deployment
3. **Add Stack Auth credentials** when ready to use Stack Auth features
4. **Consider consolidating auth systems** - currently the app has both Supabase Auth and Stack Auth integration

## Related Documentation
- `STACK_AUTH_SETUP.md` - Stack Auth setup guide
- `SUPABASE_MIGRATION.md` - Supabase migration guide
- `CLAUDE.md` - Project overview and architecture

