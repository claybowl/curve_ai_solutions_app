"use client"

import { Wrench, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolCard } from "./ToolCard"
import { cn } from "@/lib/utils"

interface Tool {
  id: string
  name: string
  description: string | null
  categoryName: string | null
  complexityLevel: "beginner" | "intermediate" | "advanced" | "expert" | null
  averageRating: number
  usageCount: number
}

interface RecentUsage {
  id: string
  toolId: string
  toolName: string
  usedAt: string
  sessionDuration: number | null
}

interface ToolsHubProps {
  featuredTools: Tool[]
  recentUsage: RecentUsage[]
  className?: string
}

export function ToolsHub({
  featuredTools,
  recentUsage,
  className
}: ToolsHubProps) {
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn("space-y-8", className)}>
      <div className="glass-panel p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-slate-50">Featured AI Tools</h2>
          </div>
          <Button 
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            size="sm"
            asChild
          >
            <a href="/solutions">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="neon-line mb-8" />

        {featuredTools.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.slice(0, 6).map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description || ""}
                category={tool.categoryName || undefined}
                complexityLevel={tool.complexityLevel || undefined}
                rating={tool.averageRating}
                usageCount={tool.usageCount}
                onAction={() => window.location.href = `/solutions/${tool.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wrench className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-slate-500 text-sm">No featured tools available</p>
          </div>
        )}
      </div>

      {recentUsage.length > 0 && (
        <div className="glass-panel-solid p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-sky-400" />
            <h3 className="text-lg font-semibold text-slate-50">Recently Used</h3>
          </div>
          <div className="space-y-3">
            {recentUsage.slice(0, 5).map((usage) => (
              <div 
                key={usage.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/solutions/${usage.toolId}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-50">{usage.toolName}</p>
                    {usage.sessionDuration && (
                      <p className="text-xs text-slate-500">
                        {usage.sessionDuration} min session
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  {formatTimeAgo(usage.usedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
