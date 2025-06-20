-- Fix profiles table RLS policies to prevent infinite recursion
-- Run this in your Supabase SQL Editor

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create a security definer function to check admin status
-- This function runs with elevated privileges to avoid RLS recursion
CREATE OR REPLACE FUNCTION is_admin_user(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the user has admin role using a simple query
  -- This function runs as SECURITY DEFINER so it bypasses RLS
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create the admin policies using the function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin_user());

-- Also create an admin insert policy for completeness
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (is_admin_user());

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_user TO anon;