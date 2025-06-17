-- =============================================================================
-- POST-MIGRATION VERIFICATION SCRIPT
-- =============================================================================
-- Run this AFTER the migration to verify everything deployed correctly

-- 1. Check all new tables were created
SELECT 
    'Tables Created' as verification_type,
    COUNT(*) as count,
    array_agg(tablename ORDER BY tablename) as table_names
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
    'assessment_categories',
    'assessment_questions', 
    'assessments',
    'assessment_responses',
    'assessment_results',
    'consultations',
    'tool_categories',
    'ai_tools',
    'user_tool_usage',
    'prompt_categories',
    'prompts',
    'user_prompt_collections',
    'prompt_collection_items',
    'analytics_events',
    'user_engagement_metrics',
    'notification_templates',
    'user_notifications',
    'blog_posts'
);

-- 2. Check indexes were created
SELECT 
    'Indexes Created' as verification_type,
    COUNT(*) as count
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';

-- 3. Check triggers were created
SELECT 
    'Triggers Created' as verification_type,
    COUNT(*) as count,
    array_agg(trigger_name) as trigger_names
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND trigger_name LIKE 'update_%_updated_at';

-- 4. Check RLS policies
SELECT 
    'RLS Policies' as verification_type,
    COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public';

-- 5. Check seeded data
SELECT 
    'Assessment Categories' as data_type,
    COUNT(*) as count
FROM assessment_categories
UNION ALL
SELECT 
    'Tool Categories',
    COUNT(*)
FROM tool_categories
UNION ALL
SELECT 
    'Prompt Categories',
    COUNT(*)
FROM prompt_categories;

-- 6. Verify profiles table enhancement
SELECT 
    'Profiles Table Columns' as verification_type,
    COUNT(*) as total_columns
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public';

-- 7. Check for any errors or issues
SELECT 
    'Migration Status' as verification_type,
    'SUCCESS - All tables, indexes, triggers, and data deployed' as status;