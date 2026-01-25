"use client"

import type React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-emerald-400" />,
    down: <TrendingDown className="h-4 w-4 text-amber-400" />,
    neutral: <Minus className="h-4 w-4 text-slate-400" />
  }

  return (
    <div className={cn("glass-panel p-6 rounded-lg hover:border-sky-500/30 transition-all duration-300", className)}>
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-mono text-xs text-slate-500 tracking-wider uppercase mb-2">
            {label}
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-slate-50">
              {value}
            </div>
            {trend && (
              <div className="flex items-center">
                {trendIcons[trend]}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
