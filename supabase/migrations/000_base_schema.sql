-- =============================================================================
-- BASE SCHEMA MIGRATION - Creates foundational tables for Neon PostgreSQL
-- =============================================================================
-- This migration creates the users and profiles tables without Supabase Auth
-- For use with Neon PostgreSQL direct connection

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. USERS TABLE (Authentication)
-- =============================================================================
-- Local users table for Neon PostgreSQL (replaces auth.users from Supabase)

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- 2. PROFILES TABLE (User Profile Information)
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    
    job_title TEXT,
    industry TEXT,
    company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
    
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'consultant', 'user')),
    
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'basic', 'premium', 'enterprise')),
    subscription_starts_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    
    timezone TEXT DEFAULT 'America/Chicago',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    onboarding_completed BOOLEAN DEFAULT false,
    
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_status);

-- =============================================================================
-- 3. TRIGGER FOR UPDATED_AT
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. INSERT DEFAULT ADMIN USER
-- =============================================================================
-- Password is 'admin123' hashed with bcrypt

INSERT INTO users (email, password_hash, email_verified)
VALUES (
    'admin@curveai.com',
    '$2a$10$X7VYVy.mOBgE9bh2x0Q1h.KRGBgM.YH1Ik9tCqIXpqQu/YJwJxKJy',
    true
) ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, email, first_name, last_name, role, subscription_status)
SELECT 
    id,
    'admin@curveai.com',
    'Admin',
    'User',
    'admin',
    'premium'
FROM users 
WHERE email = 'admin@curveai.com'
ON CONFLICT (user_id) DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
SELECT 'Base schema migration completed successfully. Created users and profiles tables.' as migration_status;
