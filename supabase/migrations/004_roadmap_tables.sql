-- =============================================================================
-- ROADMAP TABLES
-- =============================================================================
-- Tables for storing roadmap milestones and file attachments
-- Can be populated from Notion or manually

-- Roadmap Milestones Table
CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    quarter VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('completed', 'in_progress', 'planned')),
    category VARCHAR(50) DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    notion_page_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roadmap Files Table (for PDF attachments, documents, etc.)
CREATE TABLE IF NOT EXISTS roadmap_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone_id UUID REFERENCES roadmap_milestones(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    file_url TEXT NOT NULL,
    storage_path TEXT,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roadmap Categories Table
CREATE TABLE IF NOT EXISTS roadmap_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) DEFAULT 'sky',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_quarter ON roadmap_milestones(quarter);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_status ON roadmap_milestones(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_category ON roadmap_milestones(category);
CREATE INDEX IF NOT EXISTS idx_roadmap_files_milestone_id ON roadmap_files(milestone_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_roadmap_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_roadmap_milestones ON roadmap_milestones;
CREATE TRIGGER update_roadmap_milestones
    BEFORE UPDATE ON roadmap_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_roadmap_updated_at();

-- Seed Initial Milestones
INSERT INTO roadmap_milestones (title, description, quarter, status, category, sort_order) VALUES
    ('Core Infrastructure', 'Deploy Basalt-X kernel with sub-ms latency for regional enterprise clusters.', 'Q1 2024', 'completed', 'Infrastructure', 1),
    ('Neural Canopy UI', 'Adaptive visual feedback systems that react to real-time data flow.', 'Q3 2024', 'completed', 'Product', 2),
    ('Autonomous Dispatch', 'Decentralized task management with automated service routing.', 'Q4 2024', 'in_progress', 'Automation', 3),
    ('Bioluminescent Analytics', 'Real-time data visualization with adaptive UI components.', 'Q1 2025', 'in_progress', 'Analytics', 4),
    ('Singularity Peak', 'Full AI autonomy with predictive decision-making capabilities.', 'Q2 2025', 'planned', 'AI/ML', 5)
ON CONFLICT DO NOTHING;

-- Seed Categories
INSERT INTO roadmap_categories (name, description, color, sort_order) VALUES
    ('Infrastructure', 'Core system architecture and deployment', 'sky', 1),
    ('Product', 'User-facing features and experiences', 'emerald', 2),
    ('Automation', 'Autonomous systems and workflows', 'violet', 3),
    ('Analytics', 'Data visualization and insights', 'amber', 4),
    ('AI/ML', 'Machine learning and AI capabilities', 'pink', 5)
ON CONFLICT DO NOTHING;