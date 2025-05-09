-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'client', -- 'admin', 'client', etc.
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Consultation requests table
CREATE TABLE IF NOT EXISTS consultation_requests (
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
  assigned_to INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessment questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  weight DECIMAL(3,2) DEFAULT 1.0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI assessments table
CREATE TABLE IF NOT EXISTS ai_assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  score INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'reviewed'
  report_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessment responses table
CREATE TABLE IF NOT EXISTS assessment_responses (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER REFERENCES ai_assessments(id) NOT NULL,
  question_id INTEGER REFERENCES assessment_questions(id) NOT NULL,
  response TEXT NOT NULL,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notes table for consultations and assessments
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  related_type VARCHAR(50) NOT NULL, -- 'consultation', 'assessment'
  related_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin user
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  company_name, 
  role
) VALUES (
  'admin@curveai.com', 
  '$2a$10$X7VYVy.mOBgE9bh2x0Q1h.KRGBgM.YH1Ik9tCqIXpqQu/YJwJxKJy', -- This is 'admin123' hashed
  'Admin', 
  'User', 
  'Curve AI Solutions', 
  'admin'
) ON CONFLICT (email) DO NOTHING;
