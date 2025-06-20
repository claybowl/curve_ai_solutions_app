-- =============================================================================
-- ADD MISSING TOOL CATEGORIES AND AI TOOLS TABLES
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TOOL CATEGORIES TABLE
-- =============================================================================

-- Tool Categories
CREATE TABLE IF NOT EXISTS tool_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT, -- Hex color for UI theming
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AI TOOLS TABLE
-- =============================================================================

-- AI Tools Registry
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
    configuration JSONB, -- Tool-specific settings
    requirements JSONB, -- System requirements, dependencies
    
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

-- =============================================================================
-- USER TOOL USAGE TRACKING TABLE
-- =============================================================================

-- User Tool Usage Tracking
CREATE TABLE IF NOT EXISTS user_tool_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE NOT NULL,
    
    -- Usage Metrics
    session_duration INTEGER, -- Minutes
    actions_performed INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    
    -- Context
    use_case TEXT,
    session_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Tools indexes
CREATE INDEX IF NOT EXISTS idx_ai_tools_category_id ON ai_tools(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON ai_tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_ai_tools_public ON ai_tools(is_public);
CREATE INDEX IF NOT EXISTS idx_user_tool_usage_user_id ON user_tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_usage_tool_id ON user_tool_usage(tool_id);

-- =============================================================================
-- TRIGGER FOR AUTOMATIC TIMESTAMPS
-- =============================================================================

-- Function to update timestamps (create if doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to ai_tools
CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SEED DATA FOR TOOL CATEGORIES
-- =============================================================================

-- Insert default tool categories
INSERT INTO tool_categories (name, description, icon, color, sort_order) VALUES
('Chatbots & Conversational AI', 'Customer service and communication automation', 'Bot', 'bg-blue-600', 1),
('Data Analysis & Insights', 'Business intelligence and analytics tools', 'BarChart', 'bg-green-600', 2),
('Process Automation', 'Workflow and business process automation', 'Workflow', 'bg-amber-600', 3),
('Content Generation', 'AI-powered content creation and management', 'Code', 'bg-purple-600', 4),
('Trading & Finance', 'Financial analysis and trading automation', 'LineChart', 'bg-red-600', 5),
('Integration & APIs', 'System integration and API management', 'Zap', 'bg-gray-600', 6),
('Security & Compliance', 'AI security and compliance tools', 'Shield', 'bg-indigo-600', 7),
('Enterprise Solutions', 'Large-scale enterprise AI implementations', 'Building', 'bg-slate-600', 8)
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- SEED DATA FOR AI TOOLS (SAMPLE DATA)
-- =============================================================================

-- Insert some sample AI tools for each category
INSERT INTO ai_tools (
    category_id, 
    name, 
    description, 
    detailed_description, 
    tool_type, 
    complexity_level, 
    pricing_model, 
    target_audience, 
    use_cases, 
    status, 
    is_featured, 
    is_public, 
    tags
) 
SELECT 
    tc.id,
    'Advanced Customer Support Bot',
    'AI-powered chatbot for 24/7 customer service automation',
    'Our Advanced Customer Support Bot leverages state-of-the-art natural language processing to provide intelligent, context-aware customer service. It can handle complex queries, integrate with existing CRM systems, and learn from interactions to continuously improve response quality.',
    'chatbot',
    'intermediate',
    'subscription',
    ARRAY['small business', 'enterprise', 'e-commerce'],
    ARRAY['customer support', 'sales assistance', 'order tracking'],
    'active',
    true,
    true,
    ARRAY['chatbot', 'customer service', 'automation', 'nlp']
FROM tool_categories tc 
WHERE tc.name = 'Chatbots & Conversational AI'

UNION ALL

SELECT 
    tc.id,
    'Business Intelligence Dashboard',
    'Comprehensive data analysis and visualization platform',
    'Transform your raw data into actionable insights with our Business Intelligence Dashboard. Features advanced analytics, real-time reporting, and customizable visualizations to help you make data-driven decisions.',
    'analysis',
    'advanced',
    'freemium',
    ARRAY['analysts', 'managers', 'executives'],
    ARRAY['business reporting', 'performance tracking', 'data visualization'],
    'active',
    true,
    true,
    ARRAY['analytics', 'dashboard', 'reporting', 'visualization']
FROM tool_categories tc 
WHERE tc.name = 'Data Analysis & Insights'

UNION ALL

SELECT 
    tc.id,
    'Workflow Automation Engine',
    'Streamline business processes with intelligent automation',
    'Our Workflow Automation Engine helps businesses automate repetitive tasks, optimize processes, and improve efficiency. Features drag-and-drop workflow builder, integration capabilities, and AI-powered process optimization.',
    'automation',
    'intermediate',
    'subscription',
    ARRAY['operations teams', 'managers', 'small business'],
    ARRAY['process automation', 'task management', 'workflow optimization'],
    'active',
    false,
    true,
    ARRAY['automation', 'workflow', 'process', 'efficiency']
FROM tool_categories tc 
WHERE tc.name = 'Process Automation'

UNION ALL

SELECT 
    tc.id,
    'AI Content Creator',
    'Generate high-quality content with artificial intelligence',
    'Create engaging content at scale with our AI Content Creator. From blog posts and social media content to marketing copy and technical documentation, our AI helps you produce high-quality content efficiently.',
    'automation',
    'beginner',
    'freemium',
    ARRAY['content creators', 'marketers', 'small business'],
    ARRAY['content creation', 'copywriting', 'social media', 'marketing'],
    'active',
    true,
    true,
    ARRAY['content', 'writing', 'marketing', 'automation']
FROM tool_categories tc 
WHERE tc.name = 'Content Generation'

UNION ALL

SELECT 
    tc.id,
    'Algorithmic Trading Platform',
    'Advanced AI-driven trading and portfolio management',
    'Leverage machine learning algorithms for smart trading decisions. Our platform provides real-time market analysis, risk assessment, and automated trading strategies tailored to your investment goals.',
    'analysis',
    'expert',
    'subscription',
    ARRAY['traders', 'fund managers', 'financial advisors'],
    ARRAY['algorithmic trading', 'portfolio management', 'risk analysis'],
    'active',
    true,
    true,
    ARRAY['trading', 'finance', 'algorithms', 'investment']
FROM tool_categories tc 
WHERE tc.name = 'Trading & Finance'

ON CONFLICT DO NOTHING;

-- =============================================================================
-- RLS POLICIES (Row Level Security)
-- =============================================================================

-- Enable RLS on tables
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tool_usage ENABLE ROW LEVEL SECURITY;

-- Public read access for tool categories
CREATE POLICY "Public read access for tool categories" ON tool_categories
    FOR SELECT USING (true);

-- Public read access for public AI tools
CREATE POLICY "Public read access for ai tools" ON ai_tools
    FOR SELECT USING (is_public = true AND status = 'active');

-- Admin full access for tool categories
CREATE POLICY "Admin full access for tool categories" ON tool_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Admin full access for AI tools
CREATE POLICY "Admin full access for ai tools" ON ai_tools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- User access for their own tool usage
CREATE POLICY "Users can view own tool usage" ON user_tool_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tool usage" ON user_tool_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Function to increment tool usage count
CREATE OR REPLACE FUNCTION increment_tool_usage(tool_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE ai_tools 
    SET usage_count = usage_count + 1 
    WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle tool ratings
CREATE OR REPLACE FUNCTION rate_tool(
    tool_id UUID, 
    user_id UUID, 
    rating_value INTEGER
)
RETURNS void AS $$
DECLARE
    current_total INTEGER;
    current_count INTEGER;
    new_average DECIMAL(3,2);
BEGIN
    -- Get current ratings
    SELECT total_ratings, average_rating INTO current_count, current_total
    FROM ai_tools WHERE id = tool_id;
    
    -- Calculate new average
    new_average := ((current_total * current_count) + rating_value) / (current_count + 1);
    
    -- Update tool ratings
    UPDATE ai_tools 
    SET 
        average_rating = new_average,
        total_ratings = current_count + 1
    WHERE id = tool_id;
    
    -- Insert/update user rating
    INSERT INTO user_tool_usage (user_id, tool_id, satisfaction_rating, created_at)
    VALUES (user_id, tool_id, rating_value, NOW())
    ON CONFLICT (user_id, tool_id) 
    DO UPDATE SET satisfaction_rating = rating_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
