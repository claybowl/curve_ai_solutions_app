# Supabase Database Setup Guide

This guide explains how to set up your database in Supabase to work with the Curve AI Solutions app.

## Setting Up Your Database

Follow these steps to set up your database and create an admin user:

### 1. Access the Supabase SQL Editor

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. From the left sidebar, click on "SQL Editor"
4. Click "New Query" to create a new SQL script

### 2. Create Database Tables

1. Copy the contents of `supabase-setup.sql` from this repository
2. Paste it into the SQL Editor
3. Click "Run" to execute the script

This will create all necessary tables with the proper relationships, functions, and triggers.

### 3. Create an Admin User

#### Option A: Using the Supabase Dashboard (Recommended)

1. Go to "Authentication" > "Users" in your Supabase dashboard
2. Click "New User"
3. Enter the email and password for your admin user
4. After creating the user, click on them to edit
5. Under "Metadata", add:
   ```json
   {
     "role": "admin",
     "firstName": "Admin",
     "lastName": "User"
   }
   ```
6. The triggers created by the setup script will automatically:
   - Create a corresponding entry in the `public.users` table
   - Assign the admin role in the `user_roles` table

#### Option B: Using SQL

If you prefer to use SQL or need to update an existing user:

1. Copy the contents of `supabase-create-admin.sql` from this repository
2. Paste it into the SQL Editor
3. Customize the queries with your admin user's email and UUID
4. Run the queries one by one, checking the results after each step

### 4. Verify Setup

After creating your tables and admin user, run these queries to verify everything is set up correctly:

```sql
-- Check if admin user exists in auth.users with correct metadata
SELECT id, email, raw_user_meta_data FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'admin';

-- Check if admin user exists in public.users
SELECT * FROM public.users WHERE role = 'admin';

-- Check if admin user has correct role assignment
SELECT u.email, r.name as role_name
FROM public.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE u.role = 'admin';

-- Check if all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

## Understanding the Database Schema

The database schema includes these main components:

### Core Tables

- `users`: Mirrors auth.users with additional application data
- `ai_assessments`: Stores user assessment results
- `consultation_requests`: Tracks consultation requests
- `blog_posts`: Stores blog content
- `prompts`: Libraries of AI prompts
- `ai_tools`: Catalog of AI tools

### Permission System

- `roles`: Defines user roles (admin, client, etc.)
- `permissions`: Individual permissions
- `role_permissions`: Maps roles to permissions
- `user_roles`: Assigns roles to users
- `user_permissions`: Direct permission assignments to users

### Automated Processes

The setup creates several functions and triggers that:

1. Automatically create public.users records when auth.users are created
2. Update public.users when auth.users metadata changes
3. Assign roles based on user metadata
4. Implement row level security policies

## Row Level Security (RLS)

The setup includes Row Level Security to restrict data access:

- Users can only see their own user data, while admins can see all user data
- RLS policies are set up to protect user-related data

## Next Steps

After setting up your database:

1. Try logging in with your admin account
2. Verify you can access admin features
3. Start adding content to your application

If you encounter any issues, check:
- The Supabase dashboard logs
- Database trigger logs
- Your application logs for auth-related errors

## Database Functions

The setup includes these custom PostgreSQL functions:

- `handle_new_user()`: Creates a public.users record when a new auth.users record is created
- `handle_user_update()`: Updates public.users when auth.users metadata changes
- `handle_role_assignment()`: Assigns roles based on user metadata
- `is_admin()`: Helper function to check if the current user is an admin