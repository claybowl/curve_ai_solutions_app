"use client"

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  percentage: number
  size?: "sm" | "md" | "lg"
  strokeWidth?: number
  label?: string
  className?: string
}

export function ProgressRing({ 
  percentage, 
  size = "md", 
  strokeWidth = 8, 
  label,
  className 
}: ProgressRingProps) {
  const sizes = {
    sm: 80,
    md: 120,
    lg: 160
  }
  
  const dimension = sizes[size]
  const radius = (dimension - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  // Color based on percentage
  const getStrokeColor = () => {
    if (percentage >= 75) return "stroke-emerald-400"
    if (percentage >= 50) return "stroke-sky-400"
    return "stroke-amber-400"
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            className={cn(getStrokeColor(), "transition-all duration-1000 ease-out")}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-50">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm text-slate-400 text-center">
          {label}
        </span>
      )}
    </div>
  )
}
