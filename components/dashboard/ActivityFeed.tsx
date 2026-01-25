"use client"

import { Bell, Activity } from "lucide-react"
import { ActivityTimeline } from "./ActivityTimeline"
import { cn } from "@/lib/utils"

interface ActivityEvent {
  id: string
  type: "assessment" | "tool" | "consultation" | "prompt"
  title: string
  description?: string
  timestamp: string
}

interface Notification {
  id: string
  title: string
  message: string
  notificationType: string | null
  isRead: boolean
  createdAt: string
}

interface ActivityFeedProps {
  recentActivity: ActivityEvent[]
  notifications: Notification[]
  className?: string
}

export function ActivityFeed({
  recentActivity,
  notifications,
  className
}: ActivityFeedProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className={cn("space-y-6", className)}>
      {unreadCount > 0 && (
        <div className="glass-panel-solid p-4 rounded-xl border-sky-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <Bell className="h-5 w-5 text-sky-400" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-sky-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            </div>
            <h3 className="font-semibold text-slate-50">Unread Notifications</h3>
          </div>
          <div className="space-y-2">
            {notifications.filter(n => !n.isRead).slice(0, 3).map((notification) => (
              <div 
                key={notification.id}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <h4 className="text-sm font-medium text-slate-50 mb-1">
                  {notification.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-slate-50">Recent Activity</h3>
        </div>
        <ActivityTimeline events={recentActivity} maxItems={10} />
      </div>
    </div>
  )
}
