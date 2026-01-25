"use client"

import { Lightbulb, TrendingUp, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LearningInsightsProps {
  engagementScore: number
  improvementAreas: string[]
  className?: string
}

export function LearningInsights({
  engagementScore,
  improvementAreas,
  className
}: LearningInsightsProps) {
  const resources = [
    {
      title: "AI Strategy Fundamentals",
      description: "Learn how to develop an effective AI strategy for your business",
      type: "Guide",
      icon: BookOpen,
      color: "sky"
    },
    {
      title: "Data Governance Best Practices",
      description: "Essential practices for managing and protecting your data",
      type: "Article",
      icon: Lightbulb,
      color: "emerald"
    },
    {
      title: "Team AI Literacy Training",
      description: "Upskill your team with AI fundamentals and practical applications",
      type: "Course",
      icon: TrendingUp,
      color: "violet"
    }
  ]

  const getIconColor = (color: string) => {
    switch (color) {
      case "sky":
        return "text-sky-400 bg-sky-500/10"
      case "emerald":
        return "text-emerald-400 bg-emerald-500/10"
      case "violet":
        return "text-violet-400 bg-violet-500/10"
      default:
        return "text-slate-400 bg-slate-500/10"
    }
  }

  return (
    <div className={cn("glass-panel p-8 rounded-2xl", className)}>
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-amber-400" />
        <h2 className="text-2xl font-bold text-slate-50">Learning & Insights</h2>
      </div>

      <div className="neon-line mb-8" />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-slate-500 tracking-wider uppercase">
            Engagement Score
          </h3>
          <span className="text-2xl font-bold text-slate-50">{engagementScore}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              engagementScore >= 75 ? "bg-emerald-400" :
              engagementScore >= 50 ? "bg-sky-400" : "bg-amber-400"
            )}
            style={{ width: `${engagementScore}%` }}
          />
        </div>
      </div>

      {improvementAreas.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-mono text-slate-500 tracking-wider uppercase mb-4">
            Focus Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {improvementAreas.map((area, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-mono text-slate-500 tracking-wider uppercase mb-4">
          Recommended Resources
        </h3>
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg border border-white/10 hover:border-sky-500/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  getIconColor(resource.color)
                )}>
                  <resource.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-50 group-hover:text-sky-400 transition-colors">
                      {resource.title}
                    </h4>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {resource.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-sky-400 transition-colors flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <Button 
          variant="ghost"
          className="w-full text-sky-400 hover:bg-sky-500/10"
          asChild
        >
          <a href="/knowledge-vault">
            Explore Knowledge Vault
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
