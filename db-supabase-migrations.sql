-- Database schema updates for Supabase Auth integration
-- This adds UUID columns to all tables that reference users

-- Add UUID columns to all relevant tables

-- consultation_requests
ALTER TABLE consultation_requests 
ADD COLUMN IF NOT EXISTS assigned_to_uuid UUID;

-- ai_assessments
ALTER TABLE ai_assessments 
ADD COLUMN IF NOT EXISTS user_uuid UUID;

-- notes
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS user_uuid UUID;

-- ai_tools
ALTER TABLE ai_tools 
ADD COLUMN IF NOT EXISTS created_by_uuid UUID;

-- blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author_uuid UUID;

-- prompts
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS author_uuid UUID;

-- user_saved_prompts
ALTER TABLE user_saved_prompts 
ADD COLUMN IF NOT EXISTS user_uuid UUID;

-- user_roles
ALTER TABLE user_roles 
ADD COLUMN IF NOT EXISTS user_uuid UUID;

-- user_permissions
ALTER TABLE user_permissions 
ADD COLUMN IF NOT EXISTS user_uuid UUID;

-- Add new indexes
CREATE INDEX IF NOT EXISTS consultation_requests_assigned_to_uuid_idx 
ON consultation_requests(assigned_to_uuid);

CREATE INDEX IF NOT EXISTS ai_assessments_user_uuid_idx 
ON ai_assessments(user_uuid);

CREATE INDEX IF NOT EXISTS notes_user_uuid_idx 
ON notes(user_uuid);

CREATE INDEX IF NOT EXISTS ai_tools_created_by_uuid_idx 
ON ai_tools(created_by_uuid);

CREATE INDEX IF NOT EXISTS blog_posts_author_uuid_idx 
ON blog_posts(author_uuid);

CREATE INDEX IF NOT EXISTS prompts_author_uuid_idx 
ON prompts(author_uuid);

CREATE INDEX IF NOT EXISTS user_saved_prompts_user_uuid_idx 
ON user_saved_prompts(user_uuid);

CREATE INDEX IF NOT EXISTS user_roles_user_uuid_idx 
ON user_roles(user_uuid);

CREATE INDEX IF NOT EXISTS user_permissions_user_uuid_idx 
ON user_permissions(user_uuid);

-- Create a mapping table to link old user IDs to Supabase UUIDs
CREATE TABLE IF NOT EXISTS user_id_mapping (
  db_id INTEGER NOT NULL REFERENCES users(id),
  supabase_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (db_id, supabase_id)
);

CREATE INDEX IF NOT EXISTS user_id_mapping_supabase_id_idx
ON user_id_mapping(supabase_id);

CREATE INDEX IF NOT EXISTS user_id_mapping_email_idx
ON user_id_mapping(email);