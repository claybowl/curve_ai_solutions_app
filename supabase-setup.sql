-- Supabase User Database Setup
-- Run these commands in the SQL Editor of your Supabase Dashboard

-- 1. Create users table with UUID reference to auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'client', -- 'admin', 'client', etc.
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Create consultation_requests table
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  employee_count VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create assessment_questions table
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  weight DECIMAL(3,2) DEFAULT 1.0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create ai_assessments table
CREATE TABLE IF NOT EXISTS public.ai_assessments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  score INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'reviewed'
  report_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create assessment_responses table
CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER REFERENCES public.ai_assessments(id) NOT NULL,
  question_id INTEGER REFERENCES public.assessment_questions(id) NOT NULL,
  response TEXT NOT NULL,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  related_type VARCHAR(50) NOT NULL, -- 'consultation', 'assessment'
  related_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create AI Tools table
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  api_endpoint VARCHAR(255),
  icon_name VARCHAR(100),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Blog Posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  featured_image VARCHAR(255),
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES public.users(id),
  notion_page_id VARCHAR(255) UNIQUE,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for blog post lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON public.blog_posts(published, published_at);

-- 9. Create Prompts library table
CREATE TABLE IF NOT EXISTS public.prompts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  author_id UUID REFERENCES public.users(id),
  version INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for prompt lookups
CREATE INDEX IF NOT EXISTS prompts_category_idx ON public.prompts(category);
CREATE INDEX IF NOT EXISTS prompts_is_public_idx ON public.prompts(is_public);

-- 10. Create User saved prompts
CREATE TABLE IF NOT EXISTS public.user_saved_prompts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  prompt_id INTEGER REFERENCES public.prompts(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, prompt_id)
);

-- 11. Create Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Create Roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Create Role permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id INTEGER REFERENCES public.roles(id) NOT NULL,
  permission_id INTEGER REFERENCES public.permissions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id)
);

-- 14. Create User roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES public.users(id) NOT NULL,
  role_id INTEGER REFERENCES public.roles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

-- 15. Create User permissions table
CREATE TABLE IF NOT EXISTS public.user_permissions (
  user_id UUID REFERENCES public.users(id) NOT NULL,
  permission_id INTEGER REFERENCES public.permissions(id) NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, permission_id)
);

-- 16. Insert default roles
INSERT INTO public.roles (name, description, is_default, is_system) VALUES
('admin', 'Administrator with full system access', false, true),
('client', 'Standard client user', true, true),
('editor', 'Content editor with blog and prompt management permissions', false, false),
('consultant', 'AI consultant with access to user assessments', false, false)
ON CONFLICT (name) DO NOTHING;

-- 17. Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
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

-- 18. Create a function to synchronize users
-- This function will create a public.users record whenever a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 19. Create a trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 20. Create a function to update users
-- This function will update public.users when auth.users metadata is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users SET
    email = NEW.email,
    first_name = NEW.raw_user_meta_data->>'firstName',
    last_name = NEW.raw_user_meta_data->>'lastName',
    role = COALESCE(NEW.raw_user_meta_data->>'role', role),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21. Create a trigger to call the update function
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- 22. Create Row Level Security (RLS) policies
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for users table - Admin can see all users, users can only see themselves
CREATE POLICY users_policy ON public.users
  USING (
    (auth.uid() = id) OR 
    ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
  );

-- 23. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 24. Migrate existing Supabase auth users to our public.users table
-- This will create public.users entries for any auth.users that don't have them
INSERT INTO public.users (id, email, first_name, last_name, role)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'firstName', 
  raw_user_meta_data->>'lastName', 
  COALESCE(raw_user_meta_data->>'role', 'client')
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE users.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

-- 25. Setup the automatic handling of role assignments
-- When a user's role is set in metadata, add them to the corresponding role in the role_permissions table
CREATE OR REPLACE FUNCTION public.handle_role_assignment()
RETURNS TRIGGER AS $$
DECLARE
  role_id INTEGER;
BEGIN
  -- Get the role ID based on the role name from user_metadata
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    SELECT id INTO role_id FROM public.roles WHERE name = NEW.raw_user_meta_data->>'role';
    
    IF role_id IS NOT NULL THEN
      -- Delete any existing role assignments for this user
      DELETE FROM public.user_roles WHERE user_id = NEW.id;
      
      -- Insert the new role assignment
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES (NEW.id, role_id)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the role assignment function
DROP TRIGGER IF EXISTS on_auth_user_role_updated ON auth.users;
CREATE TRIGGER on_auth_user_role_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_role_assignment();

-- Also trigger it after insert to handle initial role assignment
DROP TRIGGER IF EXISTS on_auth_user_role_created ON auth.users;
CREATE TRIGGER on_auth_user_role_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_role_assignment();