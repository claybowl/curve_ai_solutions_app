"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Loader2, Check, X, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  getOAuthUrl,
  connectCalendar,
  disconnectCalendar,
  getCalendarConnections,
  getAvailableSlots,
} from "@/app/actions/calendar-actions"
import type { CalendarProvider } from "@/types/consultations"

// =============================================================================
// TYPES
// =============================================================================

interface CalendarConnection {
  id: string
  provider: CalendarProvider
  provider_email?: string
  sync_enabled: boolean
  last_synced_at?: string
}

interface TimeSlot {
  start: string
  end: string
}

interface CalendarConnectProps {
  consultationId?: string
  onSlotSelected?: (slot: TimeSlot) => void
  className?: string
}

// =============================================================================
// PROVIDER CONFIG
// =============================================================================

const PROVIDERS: Array<{
  id: CalendarProvider
  name: string
  icon: string
  color: string
}> = [
  { id: "google", name: "Google Calendar", icon: "G", color: "bg-red-500" },
  { id: "outlook", name: "Outlook Calendar", icon: "O", color: "bg-blue-500" },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function CalendarConnect({
  consultationId,
  onSlotSelected,
  className,
}: CalendarConnectProps) {
  // Connection state
  const [connections, setConnections] = useState<CalendarConnection[]>([])
  const [loadingConnections, setLoadingConnections] = useState(true)
  const [connectingProvider, setConnectingProvider] = useState<CalendarProvider | null>(null)
  const [disconnectingProvider, setDisconnectingProvider] = useState<CalendarProvider | null>(null)

  // Scheduling state
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // Error state
  const [error, setError] = useState<string | null>(null)

  // Load calendar connections on mount
  useEffect(() => {
    async function loadConnections() {
      setLoadingConnections(true)
      const result = await getCalendarConnections()
      if (result.success && result.connections) {
        setConnections(result.connections as CalendarConnection[])
      } else {
        setError(result.error ?? "Failed to load calendar connections")
      }
      setLoadingConnections(false)
    }
    loadConnections()
  }, [])

  // Handle OAuth callback (check URL params)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    const state = params.get("state")
    const provider = params.get("provider") as CalendarProvider | null

    if (code && state && provider) {
      handleOAuthCallback(provider, code)
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  // Load available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([])
      return
    }

    async function loadSlots() {
      setLoadingSlots(true)
      const result = await getAvailableSlots(selectedDate, 60)
      if (result.success && result.slots) {
        setAvailableSlots(result.slots)
      } else {
        setError(result.error ?? "Failed to load available slots")
      }
      setLoadingSlots(false)
    }
    loadSlots()
  }, [selectedDate])

  // Handler: Start OAuth flow
  const handleConnect = useCallback(async (provider: CalendarProvider) => {
    setConnectingProvider(provider)
    setError(null)

    const redirectUri = `${window.location.origin}${window.location.pathname}?provider=${provider}`
    const result = await getOAuthUrl(provider, redirectUri)

    if (result.success && result.url) {
      window.location.href = result.url
    } else {
      setError(result.error ?? "Failed to start OAuth flow")
      setConnectingProvider(null)
    }
  }, [])

  // Handler: Complete OAuth callback
  const handleOAuthCallback = useCallback(async (provider: CalendarProvider, code: string) => {
    setConnectingProvider(provider)
    const redirectUri = `${window.location.origin}${window.location.pathname}?provider=${provider}`
    
    const result = await connectCalendar({
      provider,
      code,
      redirect_uri: redirectUri,
    })

    if (result.success && result.connection) {
      setConnections((prev) => {
        const existing = prev.find((c) => c.provider === provider)
        if (existing) {
          return prev.map((c) => (c.provider === provider ? (result.connection as CalendarConnection) : c))
        }
        return [...prev, result.connection as CalendarConnection]
      })
    } else {
      setError(result.error ?? "Failed to connect calendar")
    }
    setConnectingProvider(null)
  }, [])

  // Handler: Disconnect calendar
  const handleDisconnect = useCallback(async (provider: CalendarProvider) => {
    setDisconnectingProvider(provider)
    setError(null)

    const result = await disconnectCalendar(provider)
    if (result.success) {
      setConnections((prev) => prev.filter((c) => c.provider !== provider))
    } else {
      setError(result.error ?? "Failed to disconnect calendar")
    }
    setDisconnectingProvider(null)
  }, [])

  // Handler: Select time slot
  const handleSlotSelect = useCallback(
    (slot: TimeSlot) => {
      setSelectedSlot(slot)
      onSlotSelected?.(slot)
    },
    [onSlotSelected]
  )

  // Check if provider is connected
  const isConnected = (provider: CalendarProvider) =>
    connections.some((c) => c.provider === provider)

  // Format time for display
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendar Connections */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-50">
            <Calendar className="w-5 h-5 text-sky-400" />
            Calendar Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingConnections ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            </div>
          ) : (
            PROVIDERS.map((provider) => {
              const connection = connections.find((c) => c.provider === provider.id)
              const connected = !!connection
              const isConnecting = connectingProvider === provider.id
              const isDisconnecting = disconnectingProvider === provider.id

              return (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                        provider.color
                      )}
                    >
                      {provider.icon}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{provider.name}</p>
                      {connection?.provider_email && (
                        <p className="text-xs text-slate-400">{connection.provider_email}</p>
                      )}
                    </div>
                  </div>

                  {connected ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Check className="w-3 h-3" />
                        Connected
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(provider.id)}
                        disabled={isDisconnecting}
                        className="text-slate-400 hover:text-red-400"
                      >
                        {isDisconnecting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(provider.id)}
                      disabled={isConnecting}
                      className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
                    >
                      {isConnecting ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4 mr-1" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Scheduling Section - Only show if consultationId provided */}
      {consultationId && (
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-50">
              <Clock className="w-5 h-5 text-sky-400" />
              Schedule Consultation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Available Times
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map((slot, index) => {
                      const isSelected =
                        selectedSlot?.start === slot.start && selectedSlot?.end === slot.end
                      return (
                        <button
                          key={index}
                          onClick={() => handleSlotSelect(slot)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            isSelected
                              ? "bg-sky-500 text-white"
                              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-white/5"
                          )}
                        >
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-4">
                    No available slots for this date
                  </p>
                )}
              </div>
            )}

            {/* Selected Slot Confirmation */}
            {selectedSlot && (
              <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
                <p className="text-sm text-sky-300">
                  Selected: {new Date(selectedSlot.start).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {formatTime(selectedSlot.start)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
