"use client"

import type { RoadmapMilestone } from "@/app/actions/roadmap-actions"
import { cn } from "@/lib/utils"

interface MilestoneCardProps {
  milestone: RoadmapMilestone
  index: number
}

export function MilestoneCard({ milestone, index }: MilestoneCardProps) {
  const isEven = index % 2 === 0
  
  const statusColors = {
    completed: "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    in_progress: "border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.2)]",
    planned: "border-slate-600/30 shadow-none",
  }

  const statusBadge = {
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    in_progress: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    planned: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  }

  const categoryIcons: Record<string, string> = {
    Infrastructure: "◆",
    Product: "●",
    Automation: "◈",
    Analytics: "◇",
    "AI/ML": "★",
    General: "○",
  }

  return (
    <div className={cn(
      "group relative bg-gradient-to-br from-[#1a1e26]/95 to-[#0a0f1b]/95 border p-8 transition-all duration-400 hover:-translate-y-2",
      statusColors[milestone.status]
    )}>
      {/* Top Line Animation */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left",
        milestone.status === "completed" ? "bg-emerald-400" :
        milestone.status === "in_progress" ? "bg-sky-400" : "bg-slate-400"
      )} />

      {/* Status Badge */}
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider border mb-4",
        statusBadge[milestone.status]
      )}>
        <span className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse",
          milestone.status === "completed" ? "bg-emerald-400" :
          milestone.status === "in_progress" ? "bg-sky-400" : "bg-slate-400"
        )} />
        {milestone.quarter} • {milestone.status.replace("_", " ")}
      </div>

      {/* Category */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-slate-500">{categoryIcons[milestone.category] || "○"}</span>
        <span className="font-mono text-xs tracking-wider text-slate-400 uppercase">
          {milestone.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
        {milestone.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed">
        {milestone.description}
      </p>

      {/* File Attachments Indicator */}
      {milestone.files && milestone.files.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono">📎</span>
            {milestone.files.length} attached file{milestone.files.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  )
}