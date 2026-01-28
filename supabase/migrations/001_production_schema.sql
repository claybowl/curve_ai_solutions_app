-- =============================================================================
-- CURVE AI SOLUTIONS - PRODUCTION DATABASE MIGRATION
-- =============================================================================
-- This migration deploys the comprehensive V2 schema while preserving existing data
-- Run this against your Supabase database to upgrade from basic profiles to full schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. BACKUP AND PRESERVE EXISTING DATA
-- =============================================================================

-- Create temporary backup of existing profiles data
CREATE TABLE IF NOT EXISTS profiles_backup AS 
SELECT * FROM profiles WHERE EXISTS (SELECT 1 FROM profiles LIMIT 1);

-- =============================================================================
-- 2. CORE BUSINESS TABLES - ASSESSMENT SYSTEM
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
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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
-- 3. CONSULTATION SYSTEM
-- =============================================================================

-- Consultation Requests
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Request Details
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    consultation_type TEXT CHECK (consultation_type IN ('strategy', 'implementation', 'assessment', 'training', 'other')),
    urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    
    -- Business Context
    company_size TEXT,
    industry TEXT,
    budget_range TEXT,
    timeline TEXT,
    current_ai_usage TEXT,
    specific_challenges TEXT,
    
    -- Status & Assignment
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    assigned_consultant_id UUID REFERENCES users(id),
    priority_score INTEGER DEFAULT 0,
    
    -- Scheduling
    preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'video', 'in_person')),
    preferred_times JSONB,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    
    -- Follow-up
    consultation_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 4. AI TOOLS SYSTEM
-- =============================================================================

-- Tool Categories
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

-- AI Tools Registry (Enhanced)
CREATE TABLE IF NOT EXISTS ai_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES tool_categories(id) ON DELETE SET NULL,
    
    -- Basic Information
    name TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    version TEXT DEFAULT '1.0',
    
    -- Classification
    tool_type TEXT CHECK (tool_type IN ('chatbot', 'automation', 'analysis', 'integration', 'custom')),
    complexity_level TEXT CHECK (complexity_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    -- Technical Details
    api_endpoint TEXT,
    configuration JSONB,
    requirements JSONB,
    
    -- Business Information
    pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'subscription', 'one_time', 'custom')),
    pricing_details JSONB,
    target_audience TEXT[],
    use_cases TEXT[],
    
    -- Performance & Analytics
    performance_metrics JSONB,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    
    -- Status & Availability
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'beta', 'deprecated', 'maintenance')),
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- SEO & Discovery
    tags TEXT[],
    keywords TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Tool Usage Tracking
CREATE TABLE IF NOT EXISTS user_tool_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE NOT NULL,
    
    -- Usage Metrics
    session_duration INTEGER,
    actions_performed INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    
    -- Context
    use_case TEXT,
    session_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. PROMPT LIBRARY SYSTEM
-- =============================================================================

-- Prompt Categories
CREATE TABLE IF NOT EXISTS prompt_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_category_id UUID REFERENCES prompt_categories(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Prompts Library
CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES prompt_categories(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    example_output TEXT,
    
    -- Metadata
    ai_model TEXT,
    complexity_level TEXT CHECK (complexity_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_tokens INTEGER,
    
    -- Classification
    use_case TEXT,
    industry TEXT[],
    tags TEXT[],
    
    -- Performance
    effectiveness_score DECIMAL(3,2) DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'under_review')),
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- Versioning
    version TEXT DEFAULT '1.0',
    previous_version_id UUID REFERENCES prompts(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Prompt Collections
CREATE TABLE IF NOT EXISTS user_prompt_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompt Collection Items
CREATE TABLE IF NOT EXISTS prompt_collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES user_prompt_collections(id) ON DELETE CASCADE NOT NULL,
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, prompt_id)
);

-- =============================================================================
-- 6. ANALYTICS & REPORTING
-- =============================================================================

-- System Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Event Details
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_action TEXT NOT NULL,
    event_label TEXT,
    
    -- Context
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    session_id TEXT,
    
    -- Custom Data
    event_data JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Engagement Metrics
CREATE TABLE IF NOT EXISTS user_engagement_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Engagement Scores
    overall_engagement_score DECIMAL(5,2) DEFAULT 0,
    assessment_engagement DECIMAL(5,2) DEFAULT 0,
    tool_usage_engagement DECIMAL(5,2) DEFAULT 0,
    consultation_engagement DECIMAL(5,2) DEFAULT 0,
    
    -- Activity Metrics
    total_sessions INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    
    -- Period
    metric_date DATE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, metric_date)
);

-- =============================================================================
-- 7. NOTIFICATIONS & COMMUNICATIONS
-- =============================================================================

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    subject_template TEXT,
    body_template TEXT NOT NULL,
    notification_type TEXT CHECK (notification_type IN ('email', 'sms', 'push', 'in_app')),
    variables JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT CHECK (notification_type IN ('info', 'success', 'warning', 'error')),
    
    -- Delivery
    delivery_method TEXT CHECK (delivery_method IN ('email', 'sms', 'push', 'in_app')),
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Context
    related_entity_type TEXT,
    related_entity_id UUID,
    action_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 8. CONTENT MANAGEMENT (Blog System)
-- =============================================================================

-- Blog Posts / Articles
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Content
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    
    -- Classification
    category TEXT,
    tags TEXT[],
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 9. ENHANCED PROFILES TABLE
-- =============================================================================

-- Enhance existing profiles table with new columns
DO $$ 
BEGIN
    -- Add new columns to profiles if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'industry') THEN
        ALTER TABLE profiles ADD COLUMN industry TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'company_size') THEN
        ALTER TABLE profiles ADD COLUMN company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'job_title') THEN
        ALTER TABLE profiles ADD COLUMN job_title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_preferences') THEN
        ALTER TABLE profiles ADD COLUMN notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'timezone') THEN
        ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'America/Chicago';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
        ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'basic', 'premium', 'enterprise'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_starts_at') THEN
        ALTER TABLE profiles ADD COLUMN subscription_starts_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_ends_at') THEN
        ALTER TABLE profiles ADD COLUMN subscription_ends_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_completed') THEN
        ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login_at') THEN
        ALTER TABLE profiles ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- =============================================================================
-- 10. PERFORMANCE INDEXES
-- =============================================================================

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);

-- Consultation indexes
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_assigned_consultant ON consultations(assigned_consultant_id);

-- Tool indexes
CREATE INDEX IF NOT EXISTS idx_ai_tools_category_id ON ai_tools(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON ai_tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_tool_usage_user_id ON user_tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_usage_tool_id ON user_tool_usage(tool_id);

-- Prompt indexes
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_featured ON prompts(is_featured);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- =============================================================================
-- 11. TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
DO $$
BEGIN
    -- Profiles trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Consultations trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_consultations_updated_at') THEN
        CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- AI Tools trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_tools_updated_at') THEN
        CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Prompts trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_prompts_updated_at') THEN
        CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Blog Posts trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_posts_updated_at') THEN
        CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =============================================================================
-- 13. DATA SEEDING
-- =============================================================================

-- Insert default assessment categories
INSERT INTO assessment_categories (name, description, icon, sort_order) VALUES
('AI Readiness', 'Evaluate current AI infrastructure and capabilities', 'brain', 1),
('Data Management', 'Assess data quality, accessibility, and governance', 'database', 2),
('Process Automation', 'Identify automation opportunities and current state', 'cog', 3),
('Team & Skills', 'Evaluate team AI literacy and training needs', 'users', 4),
('Technology Stack', 'Review current technology and integration capabilities', 'stack', 5),
('Strategic Goals', 'Understand business objectives and AI alignment', 'target', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert default tool categories
INSERT INTO tool_categories (name, description, icon, color, sort_order) VALUES
('Chatbots & Conversational AI', 'Customer service and communication automation', 'message-circle', '#3B82F6', 1),
('Data Analysis & Insights', 'Business intelligence and analytics tools', 'chart-line', '#10B981', 2),
('Process Automation', 'Workflow and business process automation', 'workflow', '#F59E0B', 3),
('Content Generation', 'AI-powered content creation and management', 'edit', '#8B5CF6', 4),
('Trading & Finance', 'Financial analysis and trading automation', 'trending-up', '#EF4444', 5),
('Integration & APIs', 'System integration and API management', 'link', '#6B7280', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert default prompt categories
INSERT INTO prompt_categories (name, description, icon, sort_order) VALUES
('Business Strategy', 'Strategic planning and business development prompts', 'briefcase', 1),
('Content Creation', 'Marketing, copywriting, and content prompts', 'pen-tool', 2),
('Data Analysis', 'Data interpretation and analysis prompts', 'chart-bar', 3),
('Customer Service', 'Customer support and communication prompts', 'headphones', 4),
('Trading & Finance', 'Financial analysis and trading strategy prompts', 'dollar-sign', 5),
('Technical', 'Development and technical implementation prompts', 'code', 6)
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- 14. MIGRATION COMPLETE
-- =============================================================================

-- Clean up backup table if migration successful
-- DROP TABLE IF EXISTS profiles_backup;

-- Migration complete message
SELECT 'Database migration completed successfully. V2 schema deployed with all tables, indexes, triggers, and RLS policies.' as migration_status;