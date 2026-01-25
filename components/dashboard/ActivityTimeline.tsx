"use client"

import { Brain, Wrench, Users, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityEvent {
  id: string
  type: "assessment" | "tool" | "consultation" | "prompt"
  title: string
  description?: string
  timestamp: string
}

interface ActivityTimelineProps {
  events: ActivityEvent[]
  maxItems?: number
  className?: string
}

export function ActivityTimeline({ events, maxItems = 10, className }: ActivityTimelineProps) {
  const displayEvents = events.slice(0, maxItems)

  const getIcon = (type: ActivityEvent["type"]) => {
    const iconClass = "h-4 w-4"
    switch (type) {
      case "assessment":
        return <Brain className={cn(iconClass, "text-sky-400")} />
      case "tool":
        return <Wrench className={cn(iconClass, "text-emerald-400")} />
      case "consultation":
        return <Users className={cn(iconClass, "text-indigo-400")} />
      case "prompt":
        return <FileText className={cn(iconClass, "text-violet-400")} />
    }
  }

  const getIconBgColor = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "assessment":
        return "bg-sky-500/10"
      case "tool":
        return "bg-emerald-500/10"
      case "consultation":
        return "bg-indigo-500/10"
      case "prompt":
        return "bg-violet-500/10"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (displayEvents.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
        <FileText className="h-12 w-12 text-slate-600 mb-3" />
        <p className="text-slate-500 text-sm">No recent activity</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {displayEvents.map((event, index) => (
        <div key={event.id} className="flex gap-4 group">
          <div className="relative flex flex-col items-center">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
              getIconBgColor(event.type)
            )}>
              {getIcon(event.type)}
            </div>
            {index < displayEvents.length - 1 && (
              <div className="w-px h-full bg-white/10 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-slate-50 font-medium text-sm group-hover:text-sky-400 transition-colors">
                {event.title}
              </h4>
              <span className="text-xs text-slate-500 flex-shrink-0">
                {formatTimestamp(event.timestamp)}
              </span>
            </div>
            {event.description && (
              <p className="text-sm text-slate-400 mt-1">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
