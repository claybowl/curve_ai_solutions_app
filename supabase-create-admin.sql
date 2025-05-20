-- Create Admin User in Supabase

-- 1. First, check if the user already exists in auth.users
-- Replace 'your-admin-email@example.com' with your desired admin email
SELECT * FROM auth.users WHERE email = 'your-admin-email@example.com';

-- 2. If the user doesn't exist, you'll need to create them through the Supabase dashboard
-- Go to Authentication > Users > New User
-- Fill in the email, password, and set metadata with "role": "admin"

-- 3. After creating the user through the dashboard, you can verify with this query
SELECT 
  id, 
  email, 
  raw_user_meta_data 
FROM auth.users 
WHERE email = 'your-admin-email@example.com';

-- 4. If the user exists but doesn't have admin role in metadata, update it
-- Replace 'user-uuid-here' with the actual UUID from the query above
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = 'user-uuid-here';

-- 5. Verify public.users entries were created by the trigger
SELECT * FROM public.users WHERE email = 'your-admin-email@example.com';

-- 6. If needed, manually create the public.users entry
-- Replace 'user-uuid-here' with the actual UUID from auth.users
INSERT INTO public.users (
  id, 
  email, 
  first_name, 
  last_name, 
  role
)
VALUES (
  'user-uuid-here',
  'your-admin-email@example.com',
  'Admin',
  'User',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = CURRENT_TIMESTAMP;

-- 7. Ensure admin user has admin role in user_roles table
-- First get the role_id for admin
SELECT id FROM public.roles WHERE name = 'admin';

-- Then insert the user role mapping (replace values as needed)
INSERT INTO public.user_roles (user_id, role_id)
VALUES (
  'user-uuid-here',  -- Replace with actual UUID
  1                  -- Replace with actual role_id from previous query
)
ON CONFLICT (user_id, role_id) DO NOTHING;