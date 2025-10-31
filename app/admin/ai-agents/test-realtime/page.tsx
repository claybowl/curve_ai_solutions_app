/**
 * Real-time Workflow Testing Page
 * Created: 2025-10-31 by Agent #1
 * Purpose: Demonstrate real-time workflow execution monitoring
 */

import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import RealtimeWorkflowMonitor from '@/components/admin/realtime-workflow-monitor'
import { getActiveWorkflows } from '@/app/actions/workflow-actions'
import WorkflowCard from '@/components/admin/workflow-card'

export const dynamic = 'force-dynamic'

export default async function TestRealtimePage() {
  const workflows = await getActiveWorkflows()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/ai-agents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-time Workflow Testing</h1>
          <p className="text-muted-foreground">
            Watch workflow executions update in real-time using Supabase Realtime
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold mb-2">🧪 How to Test</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Trigger Workflow" on any workflow card below</li>
          <li>Watch the "Live Executions" panel update automatically</li>
          <li>No page refresh needed - updates happen in real-time!</li>
          <li>Open this page in multiple browser tabs to see sync across tabs</li>
        </ol>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Workflow Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Trigger Workflows</h2>
          {workflows.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No active workflows found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.slice(0, 3).map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Real-time Monitor */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Live Execution Monitor</h2>
          <Suspense fallback={<div>Loading monitor...</div>}>
            <RealtimeWorkflowMonitor maxItems={10} />
          </Suspense>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4">
        <h3 className="font-semibold mb-2">🔧 Technical Details</h3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            <strong>Real-time Subscription:</strong> Uses Supabase Realtime to subscribe to{' '}
            <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
              n8n_workflow_executions
            </code>{' '}
            table changes
          </p>
          <p>
            <strong>Events Monitored:</strong> INSERT (new executions), UPDATE (status changes),
            DELETE (cleanup)
          </p>
          <p>
            <strong>Connection Status:</strong> Green dot indicates active WebSocket connection
          </p>
          <p>
            <strong>Auto-refresh:</strong> Table updates automatically without manual refresh
          </p>
        </div>
      </div>

      {/* Link back */}
      <div className="flex justify-center pt-4">
        <Link href="/admin/ai-agents">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Agents Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}


