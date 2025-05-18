-- Database schema updates for Curve AI Solutions
-- Adding missing tables for blog posts, prompts, and permissions

-- AI Tools table - formalizing the existing references in code
CREATE TABLE IF NOT EXISTS ai_tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  api_endpoint VARCHAR(255),
  icon_name VARCHAR(100),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts table - for storing local blog posts or caching Notion content
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  featured_image VARCHAR(255),
  published BOOLEAN DEFAULT false,
  author_id INTEGER REFERENCES users(id),
  notion_page_id VARCHAR(255) UNIQUE,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create index for blog post lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published, published_at);

-- Prompts library table - for storing AI prompts
CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  author_id INTEGER REFERENCES users(id),
  version INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for prompt lookups
CREATE INDEX IF NOT EXISTS prompts_category_idx ON prompts(category);
CREATE INDEX IF NOT EXISTS prompts_is_public_idx ON prompts(is_public);

-- User saved prompts (for bookmarking functionality)
CREATE TABLE IF NOT EXISTS user_saved_prompts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  prompt_id INTEGER REFERENCES prompts(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, prompt_id)
);

-- Permissions table - for granular access control
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles table - more flexible than the current role field in users
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER REFERENCES roles(id) NOT NULL,
  permission_id INTEGER REFERENCES permissions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id)
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id INTEGER REFERENCES users(id) NOT NULL,
  role_id INTEGER REFERENCES roles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

-- Direct user permissions (overrides role permissions)
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id INTEGER REFERENCES users(id) NOT NULL,
  permission_id INTEGER REFERENCES permissions(id) NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, permission_id)
);

-- Insert default roles
INSERT INTO roles (name, description, is_default, is_system) VALUES
('admin', 'Administrator with full system access', false, true),
('client', 'Standard client user', true, true),
('editor', 'Content editor with blog and prompt management permissions', false, false),
('consultant', 'AI consultant with access to user assessments', false, false)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, category) VALUES
-- User management permissions
('manage_users', 'Create, update, and delete users', 'user_management'),
('view_users', 'View user information', 'user_management'),
('manage_roles', 'Create, update, and delete roles', 'user_management'),
('assign_roles', 'Assign roles to users', 'user_management'),

-- Blog permissions
('manage_blog', 'Create, update, and delete blog posts', 'content'),
('publish_blog', 'Publish or unpublish blog posts', 'content'),
('view_blog_analytics', 'View blog performance analytics', 'analytics'),

-- Prompt permissions
('manage_prompts', 'Create, update, and delete prompts', 'content'),
('publish_prompts', 'Make prompts public or private', 'content'),
('use_prompts', 'Use prompts in the system', 'usage'),

-- Assessment permissions
('view_all_assessments', 'View all user assessments', 'assessments'),
('create_assessments', 'Create new assessments', 'assessments'),
('analyze_assessments', 'Analyze and add notes to assessments', 'assessments'),

-- Consultation permissions
('manage_consultations', 'Create, update, and delete consultations', 'consultations'),
('assign_consultations', 'Assign consultations to consultants', 'consultations'),
('view_all_consultations', 'View all consultation details', 'consultations'),

-- Tool permissions
('manage_tools', 'Create, update, and delete AI tools', 'tools'),
('use_tools', 'Use AI tools in the system', 'tools')
ON CONFLICT (name) DO NOTHING;

-- Assign default permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Assign client permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'client' AND p.name IN ('use_prompts', 'create_assessments', 'use_tools')
ON CONFLICT DO NOTHING;

-- Assign editor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'editor' AND p.name IN ('manage_blog', 'publish_blog', 'manage_prompts', 'publish_prompts', 'view_blog_analytics')
ON CONFLICT DO NOTHING;

-- Assign consultant permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'consultant' AND p.name IN ('view_all_assessments', 'analyze_assessments', 'view_all_consultations')
ON CONFLICT DO NOTHING;

-- Map existing admin users to the admin role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.role = 'admin' AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Map existing client users to the client role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.role = 'client' AND r.name = 'client'
ON CONFLICT DO NOTHING;