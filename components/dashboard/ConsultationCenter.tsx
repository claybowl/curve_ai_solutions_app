"use client"

import { Users, Calendar, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Consultation {
  id: string
  subject: string
  consultationType: string | null
  status: string
  urgency: string
  createdAt: string
  scheduledAt: string | null
}

interface ConsultationCenterProps {
  activeConsultations: Consultation[]
  className?: string
}

export function ConsultationCenter({
  activeConsultations,
  className
}: ConsultationCenterProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      case "in_progress":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30"
      case "in_review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    if (urgency === "high" || urgency === "critical") {
      return <AlertCircle className="h-4 w-4 text-amber-400" />
    }
    return null
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className={cn("glass-panel p-8 rounded-2xl", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-slate-50">Consultations</h2>
        </div>
        <Button 
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold"
          size="sm"
          asChild
        >
          <a href="/consultation">
            <Calendar className="mr-2 h-4 w-4" />
            Book Consultation
          </a>
        </Button>
      </div>

      <div className="neon-line mb-8" />

      {activeConsultations.length > 0 ? (
        <div className="space-y-4">
          {activeConsultations.map((consultation) => (
            <div 
              key={consultation.id}
              className="p-4 rounded-lg border border-white/10 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-50">{consultation.subject}</h3>
                    {getUrgencyIcon(consultation.urgency)}
                  </div>
                  {consultation.consultationType && (
                    <span className="text-xs font-mono px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                      {consultation.consultationType}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-mono border flex-shrink-0",
                  getStatusColor(consultation.status)
                )}>
                  {consultation.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(consultation.scheduledAt)}</span>
                </div>
              </div>
            </div>
          ))}

          <Button 
            variant="ghost"
            className="w-full text-indigo-400 hover:bg-indigo-500/10 mt-4"
            asChild
          >
            <a href="/consultations">
              View All Consultations
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-24 w-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
            <Users className="h-12 w-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-50 mb-3">
            Expert Guidance Available
          </h3>
          <p className="text-slate-400 mb-6 max-w-md">
            Book a consultation with our AI experts to discuss your strategy, implementation, or specific challenges.
          </p>
          <Button 
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold"
            asChild
          >
            <a href="/consultation">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
