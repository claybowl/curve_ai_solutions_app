# Stack Auth Troubleshooting Guide

## Common Errors

### Error: "Cannot use 'in' operator to search for 'accessToken' in undefined"

This error occurs when Stack Auth's internal code tries to access properties on an undefined object. This typically indicates:

1. **Missing Environment Variables**
   - Ensure `.env.local` has:
     ```
     NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
     NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
     STACK_SECRET_SERVER_KEY=your-secret-key
     ```

2. **Stack Auth Client Not Properly Initialized**
   - The StackClientApp might need additional configuration
   - Check if `url` and `redirectUrl` are needed for your Stack Auth version

3. **API Method Mismatch**
   - Stack Auth SDK version 2.8.48 might have different method names
   - Check Stack Auth documentation for your specific version

## Solutions

### 1. Verify Environment Variables

Make sure all required Stack Auth environment variables are set:

```bash
# Check if variables are loaded
echo $NEXT_PUBLIC_STACK_PROJECT_ID
echo $NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
```

### 2. Check Stack Auth Dashboard

1. Go to https://app.stack-auth.com/
2. Verify your project is set up correctly
3. Check that OAuth providers are configured (if using OAuth)
4. Verify redirect URLs are set correctly

### 3. Update Stack Auth Configuration

If the error persists, try updating `stack/client.ts`:

```typescript
export const stackClientApp = new StackClientApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
});
```

### 4. Check Stack Auth SDK Version

The API might have changed. Check the actual methods available:

```typescript
// In browser console
import { stackClientApp } from '@/stack/client'
console.log(Object.getOwnPropertyNames(stackClientApp))
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(stackClientApp)))
```

### 5. Alternative: Use Stack Auth React Components

If the SDK methods aren't working, consider using Stack Auth's pre-built React components instead of custom implementations.

## Next Steps

1. **Verify Configuration**: Double-check all environment variables
2. **Check Documentation**: Review Stack Auth docs for version 2.8.48
3. **Test Basic Auth**: Try the simplest possible sign-in first
4. **Contact Support**: If issues persist, contact Stack Auth support with:
   - Your SDK version: `@stackframe/js@2.8.48`
   - The error message
   - Your configuration (without sensitive keys)

