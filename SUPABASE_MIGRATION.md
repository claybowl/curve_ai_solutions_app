# Migrating from NextAuth to Supabase Auth

This document outlines the steps necessary to migrate the authentication system from NextAuth to Supabase Auth.

## Steps Completed

1. ✅ Added Supabase client packages to `package.json`:
   - `@supabase/supabase-js`
   - `@supabase/auth-helpers-nextjs`
   - `@supabase/auth-ui-react`
   - `@supabase/auth-ui-shared`
   - `@supabase/ssr`

2. ✅ Created Supabase client configuration in `lib/supabase.ts`

3. ✅ Updated middleware.ts to use Supabase for session validation

4. ✅ Created new login and signup components:
   - `components/auth/supabase-auth-ui.tsx` - Using Supabase Auth UI
   - `components/auth/supabase-login-form.tsx` - Custom login form
   - `components/auth/supabase-signup-form.tsx` - Custom signup form

5. ✅ Updated login and signup pages to use new components

6. ✅ Implemented role management in Supabase user metadata

7. ✅ Created admin functions in `lib/supabase-admin.ts`

8. ✅ Updated user profile management to use Supabase APIs

9. ✅ Created auth callback route handler at `app/auth/callback/route.ts`

10. ✅ Created logout functionality

11. ✅ Created `.env.local.supabase.example` with required environment variables

## Required Steps for Users

1. Set up a Supabase project:
   - Go to [supabase.com](https://supabase.com/) and create a new project
   - Get your project URL and API keys from the project settings

2. Update your `.env.local` file with Supabase credentials:
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
     ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Create an admin user in Supabase:
   - Go to Authentication > Users in the Supabase dashboard
   - Create a new user
   - Add custom metadata: `{ "role": "admin", "firstName": "Admin", "lastName": "User" }`

5. (Optional) Set up Social Login Providers:
   - See `SUPABASE_SOCIAL_LOGIN.md` for detailed instructions
   - Configure Google and/or GitHub authentication in your Supabase project
   - Update provider settings with correct redirect URLs
   - Enable the providers in your Supabase dashboard

6. Start the development server:
   ```bash
   pnpm dev
   ```

## Benefits of Using Supabase Auth

- Built-in social logins (Google, GitHub, etc.)
- Email verification and password reset flows
- Row-level security in the database
- Built-in rate limiting and security features
- Managed JWT authentication with configurable expiry
- User management dashboard in Supabase

## Additional Notes

- The migration allows for a phased approach, where NextAuth can still be used during the transition.
- User metadata (including roles) is stored in Supabase user metadata.
- Row-level security policies can be implemented in Supabase for fine-grained access control.
- The Supabase Auth UI provides a customizable sign-in/sign-up experience that can be themed to match your application.

## Common Issues and Troubleshooting

- **Session not persisting**: Make sure the auth callback route is correctly set up and the `createMiddlewareClient` is configured properly.
- **CORS errors**: Ensure the localhost URL is added to the allowed URLs in your Supabase dashboard.
- **401 Unauthorized errors**: Check if your Supabase keys are correctly added to `.env.local`.
- **Role-based access not working**: Verify that user metadata is correctly set and the middleware is checking the role properly.
- **Conflicts with NextAuth**: The application has been updated to disable NextAuth routes, but you may see NextAuth logs in the console. These can be safely ignored as the application transitions to Supabase Auth. If you're experiencing persistent issues, you may need to clear cookies and local storage in your browser.

For more information on Supabase Auth, refer to the [official documentation](https://supabase.com/docs/guides/auth).