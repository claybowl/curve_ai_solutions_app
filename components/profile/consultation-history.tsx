"use client"

import { useState, useEffect } from "react"
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Inbox,
  Video,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getUserConsultationHistory, getUserConsultationStats } from "@/app/actions/message-actions"

interface ConsultationHistoryProps {
  className?: string
}

interface ConsultationItem {
  id: string
  subject: string
  status: string
  consultation_type: string | null
  scheduled_at: string | null
  created_at: string
  updated_at: string
  message_count: number
  unread_count: number
  last_message_at: string | null
  consultant?: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string
  }
}

interface ConsultationStats {
  total_consultations: number
  active_consultations: number
  completed_consultations: number
  total_messages: number
  unread_messages: number
}

export function ConsultationHistory({ className }: ConsultationHistoryProps) {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([])
  const [stats, setStats] = useState<ConsultationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      
      try {
        const [historyResult, statsResult] = await Promise.all([
          getUserConsultationHistory({ status: activeFilter ?? undefined }),
          getUserConsultationStats(),
        ])

        if (historyResult.success && historyResult.consultations) {
          setConsultations(historyResult.consultations)
        } else {
          setError(historyResult.error ?? "Failed to load consultations")
        }

        if (statsResult.success && statsResult.stats) {
          setStats(statsResult.stats)
        }
      } catch (err) {
        setError("Failed to load consultation history")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [activeFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      case "scheduled":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30"
      case "in_progress":
        return "bg-violet-500/10 text-violet-400 border-violet-500/30"
      case "in_review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "in_progress":
        return <Video className="h-4 w-4" />
      case "in_review":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-slate-400">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-slate-50">{stats.total_consultations}</div>
            <div className="text-xs text-slate-400 font-mono uppercase">Total</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-sky-400">{stats.active_consultations}</div>
            <div className="text-xs text-slate-400 font-mono uppercase">Active</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.completed_consultations}</div>
            <div className="text-xs text-slate-400 font-mono uppercase">Completed</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-violet-400">
              {stats.unread_messages > 0 ? stats.unread_messages : stats.total_messages}
            </div>
            <div className="text-xs text-slate-400 font-mono uppercase">
              {stats.unread_messages > 0 ? "Unread" : "Messages"}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter(null)}
          className={activeFilter === null ? "bg-sky-500 hover:bg-sky-400" : ""}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "scheduled" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("scheduled")}
          className={activeFilter === "scheduled" ? "bg-sky-500 hover:bg-sky-400" : ""}
        >
          Scheduled
        </Button>
        <Button
          variant={activeFilter === "in_progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("in_progress")}
          className={activeFilter === "in_progress" ? "bg-sky-500 hover:bg-sky-400" : ""}
        >
          In Progress
        </Button>
        <Button
          variant={activeFilter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("completed")}
          className={activeFilter === "completed" ? "bg-sky-500 hover:bg-sky-400" : ""}
        >
          Completed
        </Button>
      </div>

      {/* Consultation List */}
      {consultations.length > 0 ? (
        <div className="space-y-3">
          {consultations.map((consultation) => (
            <a
              key={consultation.id}
              href={`/consultation/room/${consultation.id}`}
              className="block glass-panel p-4 rounded-xl hover:border-sky-500/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-50 truncate group-hover:text-sky-400 transition-colors">
                      {consultation.subject}
                    </h3>
                    {consultation.unread_count > 0 && (
                      <Badge variant="secondary" className="bg-sky-500 text-white text-xs">
                        {consultation.unread_count} new
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    {consultation.consultation_type && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                        {consultation.consultation_type}
                      </span>
                    )}
                    
                    {consultation.consultant && (
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">with</span>
                        {consultation.consultant.first_name || consultation.consultant.email}
                      </span>
                    )}
                    
                    {consultation.scheduled_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(consultation.scheduled_at)} at {formatTime(consultation.scheduled_at)}
                      </span>
                    )}
                    
                    {consultation.message_count > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {consultation.message_count} messages
                      </span>
                    )}
                    
                    {consultation.last_message_at && (
                      <span className="text-slate-500">
                        Last activity {getRelativeTime(consultation.last_message_at)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border",
                    getStatusColor(consultation.status)
                  )}>
                    {getStatusIcon(consultation.status)}
                    {consultation.status.replace("_", " ")}
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-xl">
          <Inbox className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-50 mb-2">
            {activeFilter ? `No ${activeFilter.replace("_", " ")} consultations` : "No consultations yet"}
          </h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {activeFilter 
              ? "Try a different filter or book a new consultation."
              : "Book your first consultation to get started with expert guidance."}
          </p>
          <Button asChild className="bg-sky-500 hover:bg-sky-400">
            <a href="/consultation">
              <Calendar className="mr-2 h-4 w-4" />
              Book Consultation
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
