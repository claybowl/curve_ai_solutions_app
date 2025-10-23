'use server'

/**
 * N8N Workflow Server Actions
 * Created: 2025-10-23 by Agent #1
 * Purpose: Server-side actions for managing n8n workflows and executions
 */

import { createClient } from '@/lib/supabase-server'
import { triggerN8NWorkflow } from '@/lib/n8n-client'
import { revalidatePath } from 'next/cache'

export interface Workflow {
  id: string
  name: string
  description: string | null
  category: string | null
  n8n_workflow_id: string | null
  n8n_webhook_url: string | null
  config: any
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  icon: string
  color: string
  estimated_duration_seconds: number | null
  execution_count: number
  last_executed_at: string | null
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  status: string
  started_at: string
  completed_at: string | null
  duration_seconds: number | null
  input_data: any
  output_data: any
  error_message: string | null
  triggered_by: string | null
  trigger_source: string | null
  n8n_execution_id: string | null
  created_at: string
}

/**
 * Get all workflows
 */
export async function getWorkflows(): Promise<Workflow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('n8n_workflows')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching workflows:', error)
    return []
  }

  return data || []
}

/**
 * Get active workflows only
 */
export async function getActiveWorkflows(): Promise<Workflow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('n8n_workflows')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching active workflows:', error)
    return []
  }

  return data || []
}

/**
 * Get workflow by ID
 */
export async function getWorkflowById(id: string): Promise<Workflow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('n8n_workflows')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching workflow:', error)
    return null
  }

  return data
}

/**
 * Create a new workflow
 */
export async function createWorkflow(workflow: Partial<Workflow>) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('n8n_workflows')
    .insert({
      ...workflow,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating workflow:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/ai-agents')
  return { success: true, data }
}

/**
 * Update an existing workflow
 */
export async function updateWorkflow(id: string, updates: Partial<Workflow>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('n8n_workflows')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating workflow:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/ai-agents')
  return { success: true, data }
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('n8n_workflows').delete().eq('id', id)

  if (error) {
    console.error('Error deleting workflow:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/ai-agents')
  return { success: true }
}

/**
 * Execute a workflow
 */
export async function executeWorkflow(
  workflowId: string,
  inputData: Record<string, any> = {}
) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // Get workflow details
  const workflow = await getWorkflowById(workflowId)
  if (!workflow) {
    return { success: false, error: 'Workflow not found' }
  }

  if (!workflow.n8n_webhook_url) {
    return {
      success: false,
      error: 'Workflow does not have a webhook URL configured',
    }
  }

  // Create execution record
  const { data: execution, error: execError } = await supabase
    .from('n8n_workflow_executions')
    .insert({
      workflow_id: workflowId,
      status: 'pending',
      input_data: inputData,
      triggered_by: user.id,
      trigger_source: 'admin_dashboard',
    })
    .select()
    .single()

  if (execError) {
    console.error('Error creating execution record:', execError)
    return { success: false, error: execError.message }
  }

  // Update status to running
  await supabase
    .from('n8n_workflow_executions')
    .update({ status: 'running' })
    .eq('id', execution.id)

  // Trigger n8n workflow
  const result = await triggerN8NWorkflow({
    webhookUrl: workflow.n8n_webhook_url,
    data: inputData,
  })

  // Update execution with result
  const updates: any = {
    completed_at: new Date().toISOString(),
  }

  if (result.success) {
    updates.status = 'success'
    updates.output_data = result.data
  } else {
    updates.status = 'failed'
    updates.error_message = result.error
  }

  await supabase
    .from('n8n_workflow_executions')
    .update(updates)
    .eq('id', execution.id)

  revalidatePath('/admin/ai-agents')

  return {
    success: result.success,
    executionId: execution.id,
    data: result.data,
    error: result.error,
  }
}

/**
 * Get workflow executions
 */
export async function getWorkflowExecutions(
  workflowId?: string,
  limit: number = 50
): Promise<WorkflowExecution[]> {
  const supabase = await createClient()

  let query = supabase
    .from('n8n_workflow_executions')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit)

  if (workflowId) {
    query = query.eq('workflow_id', workflowId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching executions:', error)
    return []
  }

  return data || []
}

/**
 * Get execution by ID
 */
export async function getExecutionById(
  id: string
): Promise<WorkflowExecution | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('n8n_workflow_executions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching execution:', error)
    return null
  }

  return data
}

/**
 * Get workflow statistics
 */
export async function getWorkflowStats() {
  const supabase = await createClient()

  const [workflowsResult, executionsResult, recentResult] = await Promise.all([
    supabase.from('n8n_workflows').select('id', { count: 'exact' }),
    supabase.from('n8n_workflow_executions').select('id', { count: 'exact' }),
    supabase
      .from('n8n_workflow_executions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10),
  ])

  return {
    totalWorkflows: workflowsResult.count || 0,
    totalExecutions: executionsResult.count || 0,
    recentExecutions: recentResult.data || [],
  }
}
