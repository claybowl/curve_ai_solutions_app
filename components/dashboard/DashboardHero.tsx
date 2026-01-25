"use client"

import { Calendar, Zap, Award, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatCard } from "./StatCard"
import { cn } from "@/lib/utils"

interface DashboardHeroProps {
  firstName?: string | null
  lastName?: string | null
  daysSinceSignup: number
  assessmentsCompleted: number
  toolsExplored: number
  subscriptionStatus: string
  className?: string
}

export function DashboardHero({
  firstName,
  lastName,
  daysSinceSignup,
  assessmentsCompleted,
  toolsExplored,
  subscriptionStatus,
  className
}: DashboardHeroProps) {
  const displayName = firstName || "there"
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || "User"

  const getSubscriptionBadge = () => {
    const badges = {
      free: { label: "Free", color: "bg-slate-500/10 text-slate-400 border-slate-500/30" },
      basic: { label: "Basic", color: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
      premium: { label: "Premium", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
      enterprise: { label: "Enterprise", color: "bg-violet-500/10 text-violet-400 border-violet-500/30" }
    }
    const badge = badges[subscriptionStatus as keyof typeof badges] || badges.free
    return (
      <span className={cn("px-3 py-1 rounded-full text-xs font-mono border", badge.color)}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className={cn("glass-panel p-8 rounded-2xl relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -z-10" />
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-1">
              Welcome back, {displayName}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-slate-400">
                Your AI Intelligence Dashboard
              </p>
              {getSubscriptionBadge()}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-sky-500 hover:bg-sky-400 text-black font-bold"
            asChild
          >
            <a href="/assessments/new">
              <Award className="mr-2 h-4 w-4" />
              New Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button 
            variant="outline"
            className="border-white/10 text-slate-300 hover:bg-white/5"
            asChild
          >
            <a href="/solutions">
              <Zap className="mr-2 h-4 w-4" />
              Browse Tools
            </a>
          </Button>
          <Button 
            variant="ghost"
            className="text-slate-400 hover:bg-white/5"
            asChild
          >
            <a href="/consultation">
              <Calendar className="mr-2 h-4 w-4" />
              Book Consultation
            </a>
          </Button>
        </div>
      </div>

      <div className="neon-line mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Member Since"
          value={`${daysSinceSignup} days`}
          trend={daysSinceSignup > 30 ? "up" : "neutral"}
        />
        <StatCard
          icon={<Award className="h-5 w-5" />}
          label="Assessments"
          value={assessmentsCompleted}
          trend={assessmentsCompleted > 0 ? "up" : "neutral"}
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Tools Explored"
          value={toolsExplored}
          trend={toolsExplored > 5 ? "up" : toolsExplored > 0 ? "neutral" : undefined}
        />
      </div>
    </div>
  )
}
