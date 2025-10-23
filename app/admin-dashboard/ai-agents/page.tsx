/**
 * AI Agents Dashboard - Migrated from old admin
 * Purpose: Admin interface for managing and triggering n8n workflows
 */

import { Suspense } from 'react'
import { Bot, Play, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <main className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Agents
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and trigger n8n workflow automations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Available Workflows
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Click to trigger a workflow with default parameters
        </p>

        {workflows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workflows configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Run the database migration to create sample workflows
              </p>
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Recent Executions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          View workflow execution history and results
        </p>

        <Suspense fallback={
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        }>
          <ExecutionHistory executions={recentExecutions} workflows={workflows} />
        </Suspense>
      </div>
    </main>
  )
}
