# Supabase Auth Troubleshooting Guide

This guide helps diagnose and fix common issues with Supabase Authentication in your Next.js application.

## Common Issues

### 1. Login loop / Redirect issues

If you're experiencing login loops where you authenticate but keep getting redirected back to the login page:

#### Check these potential causes:

- **Session cookies not being set correctly**
  - Ensure cookies are being properly set after authentication
  - Check for cookie blocking in browser settings
  - Verify domain settings for cookies

- **Middleware issues**
  - The middleware might not be properly detecting the session
  - Check for timing issues in the middleware authentication check

- **CORS issues**
  - If your Supabase domain isn't properly configured with allowed origins

- **Incorrect environment variables**
  - Verify you're using the correct Supabase URL and API keys

### 2. Session not persisting

If sessions aren't persisting between page refreshes:

- **Check localStorage access**
  - Ensure localStorage is accessible and not blocked
  - Verify Supabase is correctly storing session data

- **Cookie settings**
  - Check for secure/httpOnly settings that might be preventing access

### 3. Role-based issues

If role-based access isn't working as expected:

- **Verify user metadata**
  - Check if roles are correctly set in user metadata
  - Ensure role update is persisting to Supabase

- **Check middleware role verification**
  - Confirm middleware is checking for roles correctly

## Diagnostic Tools

We've created several diagnostic tools to help troubleshoot authentication issues:

1. **Debug Login Page**
   - Path: `/login-debug`
   - A specialized login page with enhanced logging
   - Shows detailed authentication process steps
   - Manually navigate after login to see if session persists

2. **Supabase Session Debugger**
   - Path: `/debug-supabase`
   - Shows current session status
   - Displays all cookies
   - Provides session refresh and sign-out testing

3. **Diagnostic Supabase Client**
   - File: `/lib/supabase-debug.ts`
   - Enhanced logging for auth operations
   - Used by the debug tools

## Step-by-Step Troubleshooting

1. **Confirm environment variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Check cookies**
   - Use the Session Debugger to view cookies
   - Look for cookies starting with `sb-`
   - Ensure cookies aren't being blocked by browser settings

3. **Test login flow**
   - Use the Debug Login Page
   - Check console logs for detailed authentication process
   - Verify session is created after login

4. **Test middleware**
   - Temporarily disable middleware by commenting out protection in `middleware.ts`
   - Test if direct navigation to protected routes works

5. **Check role assignments**
   - Verify roles in Supabase Dashboard
   - Look at user metadata in Session Debugger
   - Test setting roles through the Dashboard

## Advanced Fixes

### Clearing browser state
Sometimes browser state can become corrupted. Try:
```
1. Clear browser cookies
2. Clear localStorage
3. Try in an incognito/private window
```

### Session refresh
If session detection is inconsistent, add explicit refreshes:
```typescript
// Add to page load
const refreshSession = async () => {
  await supabase.auth.refreshSession()
}
```

### Cookie domain issues
For URL mismatch issues, ensure all redirects use the same domain format:
```
// Be consistent with either:
http://localhost:3000
// OR
localhost:3000
```

### Enable debug mode in Supabase client
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      debug: true,
      persistSession: true
    }
  }
)
```

## Contact Support

If you're still experiencing issues after trying these troubleshooting steps, you can:

1. Check the [Supabase documentation](https://supabase.com/docs/guides/auth)
2. Look for similar issues in the [Supabase GitHub issues](https://github.com/supabase/supabase/issues)
3. Ask questions in the [Supabase Discord](https://discord.supabase.com/)