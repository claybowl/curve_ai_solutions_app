"use client"

import { Brain, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "./ProgressRing"
import { cn } from "@/lib/utils"

interface CategoryScore {
  categoryId: string
  categoryName: string
  score: number
}

interface AssessmentOverviewProps {
  overallScore: number | null
  categoryScores: CategoryScore[]
  hasAssessments: boolean
  className?: string
}

export function AssessmentOverview({
  overallScore,
  categoryScores,
  hasAssessments,
  className
}: AssessmentOverviewProps) {
  if (!hasAssessments) {
    return (
      <div className={cn("glass-panel p-8 rounded-2xl", className)}>
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-sky-400" />
          <h2 className="text-2xl font-bold text-slate-50">AI Readiness Assessment</h2>
        </div>
        <div className="neon-line mb-6" />
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-24 w-24 rounded-full bg-sky-500/10 flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-sky-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-50 mb-3">
            Discover Your AI Potential
          </h3>
          <p className="text-slate-400 mb-6 max-w-md">
            Take your first AI readiness assessment to understand where you stand and get personalized recommendations.
          </p>
          <Button 
            className="bg-sky-500 hover:bg-sky-400 text-black font-bold"
            asChild
          >
            <a href="/assessments/new">
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    )
  }

  const displayScore = overallScore || 0

  return (
    <div className={cn("glass-panel p-8 rounded-2xl", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-sky-400" />
          <h2 className="text-2xl font-bold text-slate-50">AI Readiness</h2>
        </div>
        <Button 
          variant="outline"
          className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
          size="sm"
          asChild
        >
          <a href="/assessments/new">
            Retake Assessment
          </a>
        </Button>
      </div>

      <div className="neon-line mb-8" />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <ProgressRing 
            percentage={displayScore}
            size="lg"
            label="Overall Readiness Score"
          />
          {displayScore >= 75 && (
            <div className="flex items-center gap-2 mt-4 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Excellent Progress!</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-mono text-slate-500 tracking-wider uppercase mb-4">
            Category Breakdown
          </h3>
          {categoryScores.length > 0 ? (
            categoryScores.map((category) => (
              <div key={category.categoryId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{category.categoryName}</span>
                  <span className="text-sm font-bold text-slate-50">{Math.round(category.score)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      category.score >= 75 ? "bg-emerald-400" :
                      category.score >= 50 ? "bg-sky-400" : "bg-amber-400"
                    )}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              Complete an assessment to see your category scores.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <Button 
          variant="ghost"
          className="w-full text-sky-400 hover:bg-sky-500/10"
          asChild
        >
          <a href="/assessments">
            View Full Assessment History
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
