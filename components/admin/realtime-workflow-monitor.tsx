'use client'

/**
 * Real-time Workflow Monitor Component
 * Created: 2025-10-31 by Agent #1
 * Purpose: Shows live workflow execution updates using Supabase Realtime
 */

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase-client'
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { Database } from '@/types/database.types'

type WorkflowExecution = Database['public']['Tables']['n8n_workflow_executions']['Row']

interface RealtimeWorkflowMonitorProps {
  workflowId?: string
  maxItems?: number
}

export default function RealtimeWorkflowMonitor({ 
  workflowId, 
  maxItems = 5 
}: RealtimeWorkflowMonitorProps) {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Fetch initial executions
    const fetchInitialExecutions = async () => {
      let query = supabase
        .from('n8n_workflow_executions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(maxItems)

      if (workflowId) {
        query = query.eq('workflow_id', workflowId)
      }

      const { data, error } = await query

      if (data && !error) {
        setExecutions(data)
      }
    }

    fetchInitialExecutions()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('workflow-executions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'n8n_workflow_executions',
          ...(workflowId ? { filter: `workflow_id=eq.${workflowId}` } : {}),
        },
        (payload) => {
          console.log('📡 Workflow execution update:', payload)

          if (payload.eventType === 'INSERT') {
            // Add new execution to the top
            setExecutions((prev) => [payload.new as WorkflowExecution, ...prev].slice(0, maxItems))
          } else if (payload.eventType === 'UPDATE') {
            // Update existing execution
            setExecutions((prev) =>
              prev.map((exec) =>
                exec.id === payload.new.id ? (payload.new as WorkflowExecution) : exec
              )
            )
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted execution
            setExecutions((prev) => prev.filter((exec) => exec.id !== payload.old.id))
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [workflowId, maxItems])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700">Success</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>
      case 'running':
        return <Badge className="bg-blue-100 text-blue-700">Running</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Pending</Badge>
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Executions</CardTitle>
            <CardDescription>Real-time workflow execution monitoring</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {executions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No executions yet</p>
            <p className="text-xs mt-1">Trigger a workflow to see live updates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {executions.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(execution.status)}
                  <div>
                    <div className="text-sm font-medium">
                      Execution #{execution.id.slice(0, 8)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(execution.started_at || '').toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">
                    {formatDuration(execution.duration_seconds)}
                  </div>
                  {getStatusBadge(execution.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


