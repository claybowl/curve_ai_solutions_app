# Supabase Authentication Cookie Fix

This document explains the changes made to fix the Supabase authentication cookie issues in the application.

## Problem Identified

The application was successfully authenticating users with Supabase, but cookies were not being properly set in the browser. This caused issues with session persistence between page loads and redirects.

Key symptoms:
- Authentication succeeded but sessions weren't persisting
- Redirect loops between login and dashboard pages
- Debug showed "No Supabase cookies found" even after successful login

## Solution Implemented

The fix involved several changes to improve cookie handling in the Supabase client:

### 1. Enhanced Supabase Client Configuration

Updated the main Supabase client in `lib/supabase.ts` with explicit cookie settings:

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for added security
    cookies: {
      name: 'sb-auth', // Custom cookie name
      lifetime: 60 * 60 * 24 * 7, // 1 week
      domain: window?.location?.hostname || undefined, // Current domain only
      sameSite: 'lax', // Helps with CSRF
      path: '/',
      secure: process.env.NODE_ENV === 'production' // Secure in production
    }
  }
})
```

### 2. Browser-Specific Supabase Client

Created a new browser-specific Supabase client in `lib/supabase-browser.ts` to ensure cookies are properly set during client-side authentication operations:

```javascript
// Create a browser-specific client that ensures cookies are properly set
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'supabase.auth.token',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      cookies: {
        name: 'sb-auth',
        lifetime: 60 * 60 * 24 * 7, // 1 week
        domain: window.location.hostname,
        sameSite: 'lax',
        path: '/',
        secure: window.location.protocol === 'https:'
      }
    }
  })
}
```

### 3. Updated Login Flow

Modified the login form to use the browser-specific client and implement a more reliable redirect approach:

```javascript
// Get a browser-specific client for login
const supabaseBrowser = getBrowserClient()

// Login with the browser client to ensure cookies are set correctly
const { data, error } = await supabaseBrowser.auth.signInWithPassword({
  email, 
  password
})

// After successful login
if (data?.session) {
  // Force session refresh before redirect
  await supabaseBrowser.auth.refreshSession()
  
  // Short delay to ensure cookies are properly set
  setTimeout(() => {
    // Use window.location for a hard redirect that will include cookies
    window.location.href = redirectTo
  }, 500)
}
```

## Key Changes

1. **Explicit Cookie Configuration**: Specified detailed cookie settings including domain, path, and security attributes.

2. **PKCE Flow**: Enabled PKCE (Proof Key for Code Exchange) flow for added security.

3. **Browser-Specific Client**: Created a dedicated client for browser operations to prevent SSR/hydration issues.

4. **Hard Redirects**: Switched from Next.js router to `window.location` for redirects after login to ensure cookies are properly included.

5. **Session Refresh**: Added explicit session refresh before redirects to ensure the session is properly established.

6. **Timeout Before Redirect**: Added a short delay between authentication and redirect to allow cookies to be properly set.

## Additional Debugging Tools

Several debugging tools were created to help diagnose and fix authentication issues:

1. **Debug Login Page** (`/login-debug`): A specialized login page with detailed logging.

2. **Supabase Session Debugger** (`/debug-supabase`): A tool to view session information and cookies.

3. **Diagnostic Supabase Client** (`lib/supabase-debug.ts`): Enhanced logging for authentication operations.

4. **Troubleshooting Guide** (`SUPABASE_TROUBLESHOOTING.md`): Comprehensive guide to diagnose and fix common Supabase authentication issues.

## Future Considerations

1. **Cookie Domains**: If deploying to multiple environments, ensure cookie domains are correctly configured for each.

2. **Performance**: The added delay before redirect (500ms) could be optimized based on actual cookie setting time.

3. **SSR Compatibility**: The browser-specific client should only be used in client-side code, not during server-side rendering.

4. **Monitoring**: Consider adding more permanent logging to track authentication success rates and identify potential issues.

5. **Local Storage Fallback**: The implementation still uses local storage as a fallback, which could be further secured or disabled if not needed.