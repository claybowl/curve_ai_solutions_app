# Setting Up Social Login Providers in Supabase

This guide explains how to set up Google and GitHub as social login providers for your Curve AI Solutions app using Supabase Authentication.

## Prerequisites

- A Supabase project
- Access to the Supabase dashboard
- Google Developer account (for Google auth)
- GitHub account (for GitHub auth)

## Setting Up Google Authentication

1. **Create OAuth credentials in Google Cloud Console**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" and select "OAuth client ID"
   - Set Application Type to "Web application"
   - Add a name for your OAuth client
   - Add authorized JavaScript origins:
     - `https://your-supabase-project.supabase.co` (for production)
     - `http://localhost:3000` (for development)
   - Add authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback` (for production)
     - `http://localhost:3000/auth/callback` (for development)
   - Click "Create" and note the Client ID and Client Secret

2. **Configure Google Auth in Supabase**:

   - Go to your Supabase dashboard
   - Navigate to "Authentication" > "Providers"
   - Find Google in the list and click "Edit"
   - Enable the provider
   - Enter the Client ID and Client Secret from Google Cloud Console
   - Save changes

## Setting Up GitHub Authentication

1. **Create OAuth App in GitHub**:

   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the details:
     - Application name: "Curve AI Solutions"
     - Homepage URL: `https://your-domain.com` (or `http://localhost:3000` for development)
     - Authorization callback URL: `https://your-supabase-project.supabase.co/auth/v1/callback` (or `http://localhost:3000/auth/callback` for development)
   - Click "Register Application"
   - Note the Client ID
   - Generate a new Client Secret and note it down

2. **Configure GitHub Auth in Supabase**:

   - Go to your Supabase dashboard
   - Navigate to "Authentication" > "Providers"
   - Find GitHub in the list and click "Edit"
   - Enable the provider
   - Enter the Client ID and Client Secret from GitHub
   - Save changes

## Setting User Roles

After a user signs up via a social provider, you'll need to assign them roles (especially for admin access).

### Option 1: Update User Metadata via Supabase Dashboard

1. Go to Supabase Dashboard > Authentication > Users
2. Find the user you want to make an admin
3. Click on the user and edit their metadata
4. Add the following JSON: `{ "role": "admin" }`
5. Save changes

### Option 2: Create a SQL Function to Assign Roles Based on Email Domain

```sql
-- Create a function to update user roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email is from a specific domain that gets admin access
  IF NEW.email LIKE '%@youradmindomain.com' THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        coalesce(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      )
    WHERE id = NEW.id;
  ELSE
    -- Set as regular client by default
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        coalesce(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"client"'
      )
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that runs the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Troubleshooting

If you encounter issues with social login:

1. **Check Redirect URIs**: Ensure all redirect URIs are correctly configured in both the provider and Supabase
2. **Verify Credentials**: Double-check that Client IDs and Secrets are correctly entered
3. **CORS Issues**: Make sure your domains are allowed in both the provider settings and Supabase
4. **Network Requests**: Use browser developer tools to inspect network requests during the login process
5. **Supabase Logs**: Check the Supabase authentication logs for detailed error information

## Advanced Configuration

For more advanced authentication scenarios, you can:

1. Configure sign-up restrictions based on email domains
2. Customize email templates for verification
3. Set up multi-factor authentication
4. Create custom claim functions for JWT tokens

Refer to the [Supabase Authentication documentation](https://supabase.com/docs/guides/auth) for detailed information.