'use client'

/**
 * Workflow Card Component
 * Created: 2025-10-23 by Agent #1
 * Purpose: Displays a workflow card with trigger button
 */

import { useState } from 'react'
import { Play, Clock, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { executeWorkflow, type Workflow } from '@/app/actions/workflow-actions'
import { formatExecutionDuration, getExecutionStatusColor } from '@/lib/n8n-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface WorkflowCardProps {
  workflow: Workflow
}

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const router = useRouter()

  const handleExecute = async () => {
    setIsExecuting(true)

    try {
      const result = await executeWorkflow(workflow.id, {
        triggered_from: 'admin_dashboard',
        timestamp: new Date().toISOString(),
      })

      if (result.success) {
        toast.success(`Workflow "${workflow.name}" executed successfully!`)
        router.refresh()
      } else {
        toast.error(`Failed to execute workflow: ${result.error}`)
      }
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsExecuting(false)
    }
  }

  // Icon mapping
  const iconMap: Record<string, any> = {
    mail: '📧',
    users: '👥',
    'bar-chart': '📊',
    workflow: '🔄',
    zap: '⚡',
    database: '🗄️',
    clock: '⏰',
  }

  const icon = iconMap[workflow.icon] || '🤖'

  // Color mapping
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
  }

  const cardColorClass = colorMap[workflow.color] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <Card className={`border-2 hover:shadow-md transition-shadow ${workflow.is_active ? '' : 'opacity-60'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${cardColorClass}`}>
            {icon}
          </div>
          {workflow.category && (
            <Badge variant="secondary" className="text-xs">
              {workflow.category}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-4">{workflow.name}</CardTitle>
        <CardDescription>{workflow.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Est. Duration
          </span>
          <span className="font-medium">
            {workflow.estimated_duration_seconds
              ? formatExecutionDuration(workflow.estimated_duration_seconds)
              : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Executions
          </span>
          <span className="font-medium">{workflow.execution_count || 0}</span>
        </div>

        {workflow.last_executed_at && (
          <div className="text-xs text-muted-foreground">
            Last run: {new Date(workflow.last_executed_at).toLocaleString()}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleExecute}
          disabled={isExecuting || !workflow.is_active || !workflow.n8n_webhook_url}
          className="w-full"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Trigger Workflow
            </>
          )}
        </Button>
      </CardFooter>

      {!workflow.n8n_webhook_url && (
        <div className="px-6 pb-4">
          <Badge variant="destructive" className="w-full justify-center">
            No webhook URL configured
          </Badge>
        </div>
      )}
    </Card>
  )
}
