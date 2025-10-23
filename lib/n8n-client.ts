/**
 * N8N API Client
 * Created: 2025-10-23 by Agent #1
 * Purpose: Utility functions for triggering and managing n8n workflows
 */

export interface N8NWorkflowTriggerParams {
  workflowId?: string
  webhookUrl?: string
  data?: Record<string, any>
}

export interface N8NWorkflowResponse {
  success: boolean
  executionId?: string
  data?: any
  error?: string
}

export interface N8NWorkflowStatus {
  id: string
  finished: boolean
  mode: string
  startedAt: string
  stoppedAt?: string
  workflowId: string
  data?: any
}

/**
 * N8N Client Configuration
 */
const N8N_CONFIG = {
  apiUrl: process.env.N8N_API_URL || process.env.NEXT_PUBLIC_N8N_API_URL || '',
  apiKey: process.env.N8N_API_KEY || '',
}

/**
 * Trigger an n8n workflow via webhook
 * This is the primary method for Option B implementation
 */
export async function triggerN8NWorkflow(
  params: N8NWorkflowTriggerParams
): Promise<N8NWorkflowResponse> {
  try {
    const { webhookUrl, data = {} } = params

    if (!webhookUrl) {
      return {
        success: false,
        error: 'Webhook URL is required to trigger workflow',
      }
    }

    // Trigger workflow via webhook POST
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Webhook trigger failed: ${response.status} ${errorText}`,
      }
    }

    const result = await response.json()

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('N8N workflow trigger error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get workflow execution status from n8n API
 * Requires n8n API credentials
 */
export async function getN8NExecutionStatus(
  executionId: string
): Promise<N8NWorkflowStatus | null> {
  try {
    if (!N8N_CONFIG.apiUrl || !N8N_CONFIG.apiKey) {
      console.warn('N8N API credentials not configured')
      return null
    }

    const response = await fetch(
      `${N8N_CONFIG.apiUrl}/executions/${executionId}`,
      {
        headers: {
          'X-N8N-API-KEY': N8N_CONFIG.apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch execution status: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data as N8NWorkflowStatus
  } catch (error) {
    console.error('Error fetching n8n execution status:', error)
    return null
  }
}

/**
 * List all workflows from n8n API
 * Useful for syncing workflows from n8n to our database
 */
export async function listN8NWorkflows(): Promise<any[]> {
  try {
    if (!N8N_CONFIG.apiUrl || !N8N_CONFIG.apiKey) {
      console.warn('N8N API credentials not configured')
      return []
    }

    const response = await fetch(`${N8N_CONFIG.apiUrl}/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_CONFIG.apiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`Failed to list workflows: ${response.status}`)
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error listing n8n workflows:', error)
    return []
  }
}

/**
 * Test n8n API connection
 */
export async function testN8NConnection(): Promise<boolean> {
  try {
    if (!N8N_CONFIG.apiUrl || !N8N_CONFIG.apiKey) {
      return false
    }

    const response = await fetch(`${N8N_CONFIG.apiUrl}/workflows`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': N8N_CONFIG.apiKey,
      },
    })

    return response.ok
  } catch (error) {
    console.error('N8N connection test failed:', error)
    return false
  }
}

/**
 * Format execution duration for display
 */
export function formatExecutionDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Get status badge color for UI
 */
export function getExecutionStatusColor(status: string): string {
  switch (status) {
    case 'success':
      return 'green'
    case 'failed':
    case 'error':
      return 'red'
    case 'running':
      return 'blue'
    case 'pending':
      return 'yellow'
    default:
      return 'gray'
  }
}
