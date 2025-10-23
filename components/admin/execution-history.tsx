'use client'

/**
 * Execution History Component
 * Created: 2025-10-23 by Agent #1
 * Purpose: Displays workflow execution history in a table
 */

import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { type Workflow, type WorkflowExecution } from '@/app/actions/workflow-actions'
import { formatExecutionDuration } from '@/lib/n8n-client'

interface ExecutionHistoryProps {
  executions: WorkflowExecution[]
  workflows: Workflow[]
}

export default function ExecutionHistory({ executions, workflows }: ExecutionHistoryProps) {
  // Create a map of workflow IDs to workflow names for quick lookup
  const workflowMap = new Map(workflows.map((w) => [w.id, w]))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'failed':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      success: 'default',
      failed: 'destructive',
      error: 'destructive',
      running: 'secondary',
      pending: 'outline',
    }

    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status}
      </Badge>
    )
  }

  if (executions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No executions yet</h3>
          <p className="text-sm text-muted-foreground">
            Trigger a workflow to see execution history
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-[120px]">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((execution) => {
              const workflow = workflowMap.get(execution.workflow_id)
              return (
                <TableRow key={execution.id}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getStatusIcon(execution.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{workflow?.name || 'Unknown Workflow'}</div>
                    {workflow?.category && (
                      <div className="text-xs text-muted-foreground">{workflow.category}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(execution.started_at).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {execution.duration_seconds
                        ? formatExecutionDuration(execution.duration_seconds)
                        : execution.status === 'running'
                        ? 'In progress...'
                        : '-'}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(execution.status)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
