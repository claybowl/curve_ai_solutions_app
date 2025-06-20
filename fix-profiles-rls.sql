-- Fix RLS issue on profiles_backup table
-- This script enables Row Level Security on the profiles_backup table

-- Enable RLS on profiles_backup table
ALTER TABLE public.profiles_backup ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles_backup table (restrictive - only authenticated users can access their own data)
CREATE POLICY "Users can view own backup profile" ON public.profiles_backup
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own backup profile" ON public.profiles_backup
    FOR UPDATE USING (auth.uid() = id);

-- If you want to allow admins to access all backup profiles, uncomment the following:
-- CREATE POLICY "Admins can view all backup profiles" ON public.profiles_backup
--     FOR ALL USING (
--         EXISTS (
--             SELECT 1 FROM public.profiles 
--             WHERE profiles.id = auth.uid() 
--             AND profiles.role = 'admin'
--         )
--     );