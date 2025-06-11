# Creating the First Admin User

After setting up the Supabase profiles table, you'll need to create your first admin user. Here are two ways to do this:

## Method 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" 
4. Fill in the email and password
5. In the "User Metadata" section, add:
   ```json
   {
     "firstName": "Your First Name",
     "lastName": "Your Last Name", 
     "role": "admin"
   }
   ```
6. Click "Create user"
7. The trigger will automatically create a profile with admin role

## Method 2: Via SQL (Direct Database)

Run this SQL in your Supabase SQL Editor (replace with your details):

```sql
-- First, insert the user into auth.users (this is normally done by Supabase Auth)
-- Only do this if you need to create a user manually
-- Usually better to use Method 1 above

-- After a user signs up normally, update their profile to admin:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Method 3: Environment Variable (For Development)

You can also create an environment variable for a default admin email:

```bash
ADMIN_EMAIL=your-email@example.com
```

Then add this to your auth callback to automatically make that email an admin:

```typescript
// In your auth callback or signup process
if (user.email === process.env.ADMIN_EMAIL) {
  await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('user_id', user.id)
}
```

## Verify Admin Access

After creating the admin user:

1. Sign in with the admin account
2. You should be redirected to `/admin` instead of `/dashboard`
3. The user nav should show an "Admin Panel" option
4. The middleware should grant access to all `/admin/*` routes