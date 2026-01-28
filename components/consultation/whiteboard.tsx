"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Tldraw, Editor, getSnapshot, loadSnapshot } from "tldraw"
import type { TLStoreSnapshot } from "tldraw"
import "tldraw/tldraw.css"
import { Save, Trash2, Circle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useWhiteboard } from "@/hooks/use-realtime"

// =============================================================================
// TYPES
// =============================================================================

interface WhiteboardProps {
  consultationId: string
  userId: string
  currentUserName?: string
  readOnly?: boolean
  initialSnapshot?: string
  className?: string
  onSave?: (snapshot: string) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Whiteboard({
  consultationId,
  userId,
  currentUserName,
  readOnly = false,
  initialSnapshot,
  className,
  onSave,
}: WhiteboardProps) {
  const editorRef = useRef<Editor | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const lastBroadcastRef = useRef<number>(0)
  const BROADCAST_THROTTLE = 100 // ms

  // Real-time whiteboard hook
  const {
    isConnected,
    error,
    remoteCursors,
    sendDraw,
    sendCursor,
    sendClear,
  } = useWhiteboard({
    consultationId,
    userId,
    onDraw: (data) => {
      // Handle incoming draw from other users
      if (editorRef.current && data.userId !== userId) {
        try {
          // For simplicity, we'll just trigger a refresh
          // In production, you'd merge the specific elements
          console.log("Received draw from:", data.userId)
        } catch (e) {
          console.error("Error applying remote draw:", e)
        }
      }
    },
    onClear: () => {
      // Clear local canvas when another user clears
      if (editorRef.current) {
        editorRef.current.selectAll()
        editorRef.current.deleteShapes(editorRef.current.getSelectedShapeIds())
      }
    },
  })

  // Handle editor mount
  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor

      // Load initial snapshot if provided
      if (initialSnapshot) {
        try {
          const snapshot = JSON.parse(initialSnapshot) as TLStoreSnapshot
          loadSnapshot(editor.store, snapshot)
        } catch (e) {
          console.error("Error loading snapshot:", e)
        }
      }

      // Set up change listener to broadcast draws
      const unsubscribe = editor.store.listen(
        () => {
          const now = Date.now()
          if (now - lastBroadcastRef.current > BROADCAST_THROTTLE) {
            lastBroadcastRef.current = now
            const shapes = editor.getCurrentPageShapes()
            sendDraw(shapes as unknown[])
          }
        },
        { source: "user", scope: "document" }
      )

      return () => {
        unsubscribe()
      }
    },
    [initialSnapshot, sendDraw]
  )

  // Handle cursor movement for broadcasting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById("whiteboard-container")
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Only broadcast if mouse is inside whiteboard
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        sendCursor(x, y)
      }
    }

    // Throttle cursor updates
    let lastCursorUpdate = 0
    const throttledHandler = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastCursorUpdate > 50) {
        lastCursorUpdate = now
        handleMouseMove(e)
      }
    }

    window.addEventListener("mousemove", throttledHandler)
    return () => window.removeEventListener("mousemove", throttledHandler)
  }, [sendCursor])

  // Handle save
  const handleSave = useCallback(async () => {
    if (!editorRef.current || !onSave) return

    setIsSaving(true)
    try {
      const snapshot = getSnapshot(editorRef.current.store)
      const snapshotString = JSON.stringify(snapshot)
      onSave(snapshotString)
    } catch (e) {
      console.error("Error saving whiteboard:", e)
    }
    setIsSaving(false)
  }, [onSave])

  // Handle clear
  const handleClear = useCallback(() => {
    if (!editorRef.current) return

    editorRef.current.selectAll()
    editorRef.current.deleteShapes(editorRef.current.getSelectedShapeIds())
    sendClear()
  }, [sendClear])

  return (
    <div className={cn("glass-panel flex flex-col h-full overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Circle
              className={cn(
                "w-3 h-3",
                isConnected
                  ? "fill-emerald-400 text-emerald-400"
                  : "fill-red-400 text-red-400"
              )}
            />
            <span className="text-xs text-slate-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Remote Users Count */}
          {remoteCursors.size > 0 && (
            <div className="flex items-center gap-1 text-xs text-sky-400">
              <Users className="w-3 h-3" />
              <span>{remoteCursors.size} other{remoteCursors.size > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!readOnly && (
          <div className="flex gap-2">
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="text-slate-300 hover:text-sky-400"
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-slate-300 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-3 py-2 bg-red-500/10 border-b border-red-500/30 flex-shrink-0">
          <p className="text-xs text-red-400">{error.message}</p>
        </div>
      )}

      {/* Canvas Container */}
      <div
        id="whiteboard-container"
        className="flex-1 relative min-h-0"
        style={{ backgroundColor: "#1e293b" }}
      >
        <Tldraw
          onMount={handleMount}
          hideUi={readOnly}
        />

        {/* Remote Cursors Overlay */}
        {Array.from(remoteCursors.entries()).map(([odUserId, pos]) => (
          <div
            key={odUserId}
            className="absolute pointer-events-none z-50 transition-transform duration-75"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Cursor dot */}
            <div className="w-4 h-4 rounded-full border-2 border-sky-400 bg-sky-400/30" />
            {/* User label */}
            <span className="absolute left-5 top-0 text-xs text-sky-400 whitespace-nowrap bg-slate-900/80 px-1 rounded">
              {odUserId.slice(0, 8)}
            </span>
          </div>
        ))}
      </div>

      {/* User Indicator */}
      {currentUserName && (
        <div className="absolute bottom-4 left-4 z-40">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-900/80 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-xs text-slate-300">{currentUserName}</span>
          </div>
        </div>
      )}
    </div>
  )
}
