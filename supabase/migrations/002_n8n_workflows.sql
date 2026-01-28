-- N8N Workflow Management Tables
-- Created: 2025-10-23 by Agent #1
-- Purpose: Store n8n workflow configurations and execution history for Option B implementation

-- Table: n8n_workflows
-- Stores workflow definitions that can be triggered from admin dashboard
CREATE TABLE IF NOT EXISTS public.n8n_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- e.g., 'lead_management', 'consultation', 'reporting'
  n8n_workflow_id VARCHAR(255), -- The workflow ID in n8n (if using workflow-based triggers)
  n8n_webhook_url TEXT, -- The webhook URL to trigger this workflow
  config JSONB DEFAULT '{}', -- Workflow-specific configuration (API keys, parameters)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  -- Metadata
  icon VARCHAR(50) DEFAULT 'workflow', -- Icon name for UI display
  color VARCHAR(50) DEFAULT 'blue', -- Card color in UI
  estimated_duration_seconds INTEGER, -- Expected execution time

  -- Usage tracking
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE
);

-- Table: n8n_workflow_executions
-- Stores execution history and results
CREATE TABLE IF NOT EXISTS public.n8n_workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.n8n_workflows(id) ON DELETE CASCADE,

  -- Execution details
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, running, success, failed
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,

  -- Input/Output
  input_data JSONB, -- Parameters sent to the workflow
  output_data JSONB, -- Results returned from workflow
  error_message TEXT, -- Error details if failed

  -- Context
  triggered_by UUID REFERENCES users(id),
  trigger_source VARCHAR(100), -- e.g., 'admin_dashboard', 'api', 'scheduled'

  -- n8n details
  n8n_execution_id VARCHAR(255), -- n8n's internal execution ID (if available)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_n8n_workflows_active ON public.n8n_workflows(is_active);
CREATE INDEX idx_n8n_workflows_category ON public.n8n_workflows(category);
CREATE INDEX idx_n8n_executions_workflow ON public.n8n_workflow_executions(workflow_id);
CREATE INDEX idx_n8n_executions_status ON public.n8n_workflow_executions(status);
CREATE INDEX idx_n8n_executions_started ON public.n8n_workflow_executions(started_at DESC);

-- Insert sample workflows for testing
INSERT INTO public.n8n_workflows (name, description, category, icon, color, estimated_duration_seconds) VALUES
  ('New Consultation Alert', 'Sends email and logs to database when a new consultation is requested', 'consultation', 'mail', 'blue', 5),
  ('Lead Qualification Agent', 'Analyzes new leads and assigns qualification scores', 'lead_management', 'users', 'green', 15),
  ('Weekly Report Generator', 'Generates and emails weekly analytics report', 'reporting', 'bar-chart', 'purple', 30)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.n8n_workflows IS 'Stores n8n workflow definitions for admin dashboard orchestration';
COMMENT ON TABLE public.n8n_workflow_executions IS 'Tracks execution history and results of n8n workflows';