"use client"

import { Copy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PromptCardProps {
  id: string
  title: string
  description?: string
  category?: string
  complexity?: "beginner" | "intermediate" | "advanced"
  rating?: number
  usageCount?: number
  onCopy?: () => void
  className?: string
}

export function PromptCard({
  id,
  title,
  description,
  category,
  complexity,
  rating = 0,
  usageCount = 0,
  onCopy,
  className
}: PromptCardProps) {
  const getComplexityColor = () => {
    switch (complexity) {
      case "beginner":
        return "tech-tag-emerald"
      case "intermediate":
        return "tech-tag-indigo"
      case "advanced":
        return "tech-tag-violet"
      default:
        return "tech-tag-indigo"
    }
  }

  const renderStars = () => {
    const fullStars = Math.floor(rating)
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < fullStars ? "fill-amber-400 text-amber-400" : "text-slate-600"
          )}
        />
      )
    }
    return stars
  }

  return (
    <div className={cn("glass-panel-solid p-6 rounded-lg border-white/10 hover:border-indigo-500/30 transition-all duration-300", className)}>
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-slate-50 mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-grow">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {category && (
            <span className="tech-tag tech-tag-indigo">
              {category}
            </span>
          )}
          {complexity && (
            <span className={cn("tech-tag", getComplexityColor())}>
              {complexity}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {renderStars()}
            <span className="text-xs text-slate-500 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>
          {usageCount > 0 && (
            <span className="text-xs text-slate-500">
              {usageCount.toLocaleString()} uses
            </span>
          )}
        </div>

        {onCopy && (
          <Button
            variant="ghost"
            className="w-full text-indigo-400 hover:bg-indigo-500/10"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Prompt
          </Button>
        )}
      </div>
    </div>
  )
}
