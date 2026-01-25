"use client"

import { Sparkles, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  id: string
  name: string
  description: string
  category?: string
  complexityLevel?: "beginner" | "intermediate" | "advanced" | "expert"
  rating?: number
  usageCount?: number
  onAction?: () => void
  className?: string
}

export function ToolCard({
  id,
  name,
  description,
  category,
  complexityLevel,
  rating = 0,
  usageCount = 0,
  onAction,
  className
}: ToolCardProps) {
  const getComplexityColor = () => {
    switch (complexityLevel) {
      case "beginner":
        return "tech-tag-emerald"
      case "intermediate":
        return "tech-tag-sky"
      case "advanced":
        return "tech-tag-amber"
      case "expert":
        return "tech-tag-pink"
      default:
        return "tech-tag-sky"
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
    <div className={cn("glass-panel data-card p-6 rounded-lg border-white/10", className)}>
      <div className="flex flex-col h-full">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-sky-400" />
        </div>

        <h3 className="text-lg font-semibold text-sky-400 mb-2">
          {name}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {category && (
            <span className="tech-tag tech-tag-sky">
              {category}
            </span>
          )}
          {complexityLevel && (
            <span className={cn("tech-tag", getComplexityColor())}>
              {complexityLevel}
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
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Users className="h-3 w-3" />
              <span>{usageCount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {onAction && (
          <Button
            variant="outline"
            className="w-full border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
            onClick={onAction}
          >
            Try Now
          </Button>
        )}
      </div>
    </div>
  )
}
