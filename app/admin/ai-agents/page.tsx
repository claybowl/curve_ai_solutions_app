/**
 * AI Agents Dashboard
 * Created: 2025-10-23 by Agent #1
 * Purpose: Admin interface for managing and triggering n8n workflows (Option B)
 */

import { Suspense } from 'react'
import { Bot, Play, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getActiveWorkflows, getWorkflowStats, getWorkflowExecutions } from '@/app/actions/workflow-actions'
import WorkflowCard from '@/components/admin/workflow-card'
import ExecutionHistory from '@/components/admin/execution-history'

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic'

export default async function AIAgentsPage() {
  const [workflows, stats, recentExecutions] = await Promise.all([
    getActiveWorkflows(),
    getWorkflowStats(),
    getWorkflowExecutions(undefined, 10),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">
            Manage and trigger n8n workflow automations
          </p>
        </div>
        <Button variant="outline">
          <Bot className="mr-2 h-4 w-4" />
          Configure Workflows
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {workflows.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentExecutions.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 10 executions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Workflows */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Available Workflows</h2>
          <p className="text-muted-foreground">
            Click to trigger a workflow with default parameters
          </p>
        </div>

        {workflows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workflows configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Run the database migration to create sample workflows
              </p>
              <Button variant="outline">View Documentation</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        )}
      </div>

      {/* Execution History */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Executions</h2>
          <p className="text-muted-foreground">
            View workflow execution history and results
          </p>
        </div>

        <Suspense fallback={<div>Loading executions...</div>}>
          <ExecutionHistory executions={recentExecutions} workflows={workflows} />
        </Suspense>
      </div>
    </div>
  )
}
