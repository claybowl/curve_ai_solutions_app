-- =============================================================================
-- CURRENT SCHEMA VERIFICATION SCRIPT
-- =============================================================================
-- Run this BEFORE the migration to see current database state

-- Check current tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Count existing data
SELECT 
    'profiles' as table_name,
    COUNT(*) as row_count
FROM profiles
UNION ALL
SELECT 
    'Current tables total',
    COUNT(*)::bigint
FROM pg_tables 
WHERE schemaname = 'public';

-- Check for existing business tables (should be empty/missing)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessments') 
        THEN 'assessments table EXISTS' 
        ELSE 'assessments table MISSING (expected)' 
    END as assessment_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consultations') 
        THEN 'consultations table EXISTS' 
        ELSE 'consultations table MISSING (expected)' 
    END as consultation_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_tools') 
        THEN 'ai_tools table EXISTS' 
        ELSE 'ai_tools table MISSING (expected)' 
    END as tools_status;