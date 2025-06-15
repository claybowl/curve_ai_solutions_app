-- =============================================================================
-- MIGRATION FROM CURRENT SCHEMA TO V2
-- =============================================================================

-- This migration preserves existing data while adding new features

BEGIN;

-- =============================================================================
-- 1. BACKUP EXISTING PROFILES DATA
-- =============================================================================

-- Create temporary backup of existing profiles
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- =============================================================================
-- 2. ADD NEW COLUMNS TO PROFILES TABLE
-- =============================================================================

-- Add new columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Chicago';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'basic', 'premium', 'enterprise'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_starts_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Add ID column with default UUID if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') THEN
        ALTER TABLE profiles ADD COLUMN id UUID DEFAULT uuid_generate_v4();
        UPDATE profiles SET id = uuid_generate_v4() WHERE id IS NULL;
        ALTER TABLE profiles ALTER COLUMN id SET NOT NULL;
    END IF;
END $$;

-- Update role constraint to include new roles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'client', 'consultant'));

-- =============================================================================
-- 3. CREATE NEW TABLES FOR ASSESSMENTS
-- =============================================================================

-- Assessment Categories
CREATE TABLE IF NOT EXISTS assessment_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Questions
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES assessment_categories(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'scale', 'boolean', 'text')),
    options JSONB,
    weight DECIMAL(3,2) DEFAULT 1.0,
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Assessment Sessions
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    overall_score DECIMAL(5,2),
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Responses
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE NOT NULL,
    response_value TEXT NOT NULL,
    response_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, question_id)
);

-- Assessment Results & Recommendations
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES assessment_categories(id) ON DELETE CASCADE NOT NULL,
    category_score DECIMAL(5,2) NOT NULL,
    recommendations JSONB,
    strengths TEXT[],
    improvement_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, category_id)
);

-- =============================================================================
-- 4. CREATE CONSULTATION TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    consultation_type TEXT CHECK (consultation_type IN ('strategy', 'implementation', 'assessment', 'training', 'other')),
    urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    company_size TEXT,
    industry TEXT,
    budget_range TEXT,
    timeline TEXT,
    current_ai_usage TEXT,
    specific_challenges TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    assigned_consultant_id UUID REFERENCES auth.users(id),
    priority_score INTEGER DEFAULT 0,
    preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'video', 'in_person')),
    preferred_times JSONB,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    consultation_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. CREATE AI TOOLS TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS tool_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES tool_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    version TEXT DEFAULT '1.0',
    tool_type TEXT CHECK (tool_type IN ('chatbot', 'automation', 'analysis', 'integration', 'custom')),
    complexity_level TEXT CHECK (complexity_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    api_endpoint TEXT,
    configuration JSONB,
    requirements JSONB,
    pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'subscription', 'one_time', 'custom')),
    pricing_details JSONB,
    target_audience TEXT[],
    use_cases TEXT[],
    performance_metrics JSONB,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'beta', 'deprecated', 'maintenance')),
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    tags TEXT[],
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_tool_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE NOT NULL,
    session_duration INTEGER,
    actions_performed INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    use_case TEXT,
    session_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 6. CREATE PROMPTS TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS prompt_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_category_id UUID REFERENCES prompt_categories(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES prompt_categories(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    example_output TEXT,
    ai_model TEXT,
    complexity_level TEXT CHECK (complexity_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_tokens INTEGER,
    use_case TEXT,
    industry TEXT[],
    tags TEXT[],
    effectiveness_score DECIMAL(3,2) DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'under_review')),
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    version TEXT DEFAULT '1.0',
    previous_version_id UUID REFERENCES prompts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 7. ADD SEED DATA
-- =============================================================================

-- Insert assessment categories if they don't exist
INSERT INTO assessment_categories (name, description, icon, sort_order) 
SELECT * FROM (VALUES
    ('AI Readiness', 'Evaluate current AI infrastructure and capabilities', 'brain', 1),
    ('Data Management', 'Assess data quality, accessibility, and governance', 'database', 2),
    ('Process Automation', 'Identify automation opportunities and current state', 'cog', 3),
    ('Team & Skills', 'Evaluate team AI literacy and training needs', 'users', 4),
    ('Technology Stack', 'Review current technology and integration capabilities', 'stack', 5),
    ('Strategic Goals', 'Understand business objectives and AI alignment', 'target', 6)
) AS v(name, description, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM assessment_categories WHERE assessment_categories.name = v.name);

-- Insert tool categories if they don't exist
INSERT INTO tool_categories (name, description, icon, color, sort_order) 
SELECT * FROM (VALUES
    ('Chatbots & Conversational AI', 'Customer service and communication automation', 'message-circle', '#3B82F6', 1),
    ('Data Analysis & Insights', 'Business intelligence and analytics tools', 'chart-line', '#10B981', 2),
    ('Process Automation', 'Workflow and business process automation', 'workflow', '#F59E0B', 3),
    ('Content Generation', 'AI-powered content creation and management', 'edit', '#8B5CF6', 4),
    ('Trading & Finance', 'Financial analysis and trading automation', 'trending-up', '#EF4444', 5),
    ('Integration & APIs', 'System integration and API management', 'link', '#6B7280', 6)
) AS v(name, description, icon, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM tool_categories WHERE tool_categories.name = v.name);

-- Insert prompt categories if they don't exist
INSERT INTO prompt_categories (name, description, icon, sort_order) 
SELECT * FROM (VALUES
    ('Business Strategy', 'Strategic planning and business development prompts', 'briefcase', 1),
    ('Content Creation', 'Marketing, copywriting, and content prompts', 'pen-tool', 2),
    ('Data Analysis', 'Data interpretation and analysis prompts', 'chart-bar', 3),
    ('Customer Service', 'Customer support and communication prompts', 'headphones', 4),
    ('Trading & Finance', 'Financial analysis and trading strategy prompts', 'dollar-sign', 5),
    ('Technical', 'Development and technical implementation prompts', 'code', 6)
) AS v(name, description, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM prompt_categories WHERE prompt_categories.name = v.name);

-- =============================================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Only create indexes if they don't already exist
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category_id ON ai_tools(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);

-- =============================================================================
-- 9. UPDATE EXISTING DATA
-- =============================================================================

-- Set default values for existing users
UPDATE profiles SET 
    subscription_status = 'free',
    onboarding_completed = true,
    timezone = 'America/Chicago',
    notification_preferences = '{"email": true, "sms": false, "push": true}'::jsonb
WHERE subscription_status IS NULL OR notification_preferences IS NULL;

COMMIT;

-- =============================================================================
-- 10. VERIFICATION QUERIES
-- =============================================================================

-- Run these to verify the migration worked:

-- Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Count records in each new table
SELECT 
    'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL SELECT 
    'assessment_categories', COUNT(*) FROM assessment_categories
UNION ALL SELECT 
    'tool_categories', COUNT(*) FROM tool_categories
UNION ALL SELECT 
    'prompt_categories', COUNT(*) FROM prompt_categories;