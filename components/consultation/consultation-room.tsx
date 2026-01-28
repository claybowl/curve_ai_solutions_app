"use client"

/**
 * Consultation Room Component
 * 
 * Main client component that manages the consultation room UI.
 * Integrates: Video, Chat, AI Assistant, Sandbox, Whiteboard, Files, Code Playground, Summaries
 */

import { useState, useCallback, useEffect } from "react"
import { 
  Video, 
  MessageSquare, 
  Bot, 
  Terminal, 
  Palette, 
  FolderOpen, 
  FileCode, 
  FileText,
  ChevronLeft,
  MoreVertical,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { startConsultationSession } from "@/app/actions/consultation-room-actions"

// Import all consultation components
import { VideoChat } from "./video-chat"
import { ChatPanel } from "./chat-panel"
import { AiAssistant } from "./ai-assistant"
import { SandboxViewport } from "./sandbox-viewport"
import { Whiteboard } from "./whiteboard"
import { FileManager } from "./file-manager"
import { CodePlayground } from "./code-playground"
import { SummaryEditor } from "./summary-editor"

import type { 
  ConsultationWithDetails, 
  ConsultationMessageWithSender,
  ConsultationFileWithUploader,
  SandboxSession,
  WhiteboardSnapshot,
  ConsultationSessionSummary 
} from "@/types/consultations"

// =============================================================================
// TYPES
// =============================================================================

interface ConsultationRoomProps {
  consultationId: string
  consultation: ConsultationWithDetails
  currentUserId: string
  currentUserName: string
  initialMessages: ConsultationMessageWithSender[]
  initialFiles: ConsultationFileWithUploader[]
  initialSandbox?: SandboxSession
  initialWhiteboard?: WhiteboardSnapshot
  initialSummary?: ConsultationSessionSummary
  isConsultant: boolean
}

type TabId = 
  | "video" 
  | "chat" 
  | "ai" 
  | "sandbox" 
  | "whiteboard" 
  | "files" 
  | "code" 
  | "summary"

interface TabConfig {
  id: TabId
  label: string
  icon: React.ReactNode
  description: string
}

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

const TABS: TabConfig[] = [
  { id: "video", label: "Video", icon: <Video className="w-4 h-4" />, description: "Video call" },
  { id: "chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" />, description: "Messages" },
  { id: "ai", label: "AI", icon: <Bot className="w-4 h-4" />, description: "AI Assistant" },
  { id: "sandbox", label: "Sandbox", icon: <Terminal className="w-4 h-4" />, description: "Code environment" },
  { id: "whiteboard", label: "Whiteboard", icon: <Palette className="w-4 h-4" />, description: "Collaborative drawing" },
  { id: "files", label: "Files", icon: <FolderOpen className="w-4 h-4" />, description: "Shared files" },
  { id: "code", label: "Code", icon: <FileCode className="w-4 h-4" />, description: "Code playground" },
  { id: "summary", label: "Summary", icon: <FileText className="w-4 h-4" />, description: "Session notes" },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function ConsultationRoom({
  consultationId,
  consultation,
  currentUserId,
  currentUserName,
  initialMessages,
  initialFiles,
  initialSandbox,
  initialWhiteboard,
  initialSummary,
  isConsultant,
}: ConsultationRoomProps) {
  // State
  const [activeTab, setActiveTab] = useState<TabId>("video")
  const [leftPanelTab, setLeftPanelTab] = useState<TabId>("chat")
  const [rightPanelTab, setRightPanelTab] = useState<TabId>("ai")
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [consultationStarted, setConsultationStarted] = useState(false)

  // Start session on mount
  useEffect(() => {
    async function startSession() {
      const result = await startConsultationSession(consultationId)
      if (result.success) {
        setConsultationStarted(true)
      }
      setLoading(false)
    }
    startSession()
  }, [consultationId])

  // Context for AI assistant
  const aiContext = {
    consultationId,
    subject: consultation.subject,
    description: consultation.description,
    type: consultation.consultation_type,
    status: consultation.status,
    scheduledAt: consultation.scheduled_at,
    user: consultation.user,
    consultant: consultation.assigned_consultant,
  }

  // Handle sharing code to sandbox
  const handleShareToSandbox = useCallback((code: string, language: string) => {
    // Switch to sandbox tab and pass the code
    setRightPanelTab("sandbox")
    setShowRightPanel(true)
    // The sandbox would need to accept this code - simplified for now
    console.log("Sharing code to sandbox:", { code, language })
  }, [])

  // Handle whiteboard save
  const handleWhiteboardSave = useCallback((snapshot: string) => {
    // Would call server action to save
    console.log("Whiteboard saved:", snapshot.length, "chars")
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading consultation room...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
          <p className="text-slate-400">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-sky-500/30 text-sky-400"
            onClick={() => window.location.href = "/dashboard"}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // =============================================================================
  // RENDER TABS
  // =============================================================================

  const renderTabContent = (tabId: TabId, compact: boolean = false) => {
    const className = compact ? "h-full" : "h-full"
    
    switch (tabId) {
      case "video":
        return (
          <VideoChat
            consultationId={consultationId}
            currentUserId={currentUserId}
            className={className}
          />
        )
      
      case "chat":
        return (
          <ChatPanel
            consultationId={consultationId}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            className={className}
          />
        )
      
      case "ai":
        return (
          <AiAssistant
            consultationId={consultationId}
            className={className}
          />
        )
      
      case "sandbox":
        return (
          <SandboxViewport
            consultationId={consultationId}
            currentUserId={currentUserId}
            isConsultant={isConsultant}
            className={className}
          />
        )
      
      case "whiteboard":
        return (
          <Whiteboard
            consultationId={consultationId}
            userId={currentUserId}
            currentUserName={currentUserName}
            initialSnapshot={initialWhiteboard?.snapshot_data ? JSON.stringify(initialWhiteboard.snapshot_data) : undefined}
            readOnly={false}
            className={className}
            onSave={handleWhiteboardSave}
          />
        )
      
      case "files":
        return (
          <FileManager
            consultationId={consultationId}
            currentUserId={currentUserId}
            className={className}
          />
        )
      
      case "code":
        return (
          <CodePlayground
            initialLanguage="javascript"
            onShareToSandbox={handleShareToSandbox}
            className={className}
          />
        )
      
      case "summary":
        return (
          <SummaryEditor
            consultationId={consultationId}
            isConsultant={isConsultant}
            className={className}
          />
        )
      
      default:
        return null
    }
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-white/10 bg-slate-900/50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => window.location.href = "/dashboard"}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="h-4 w-px bg-white/10" />
          
          <div>
            <h1 className="text-sm font-medium text-white">
              {consultation.subject}
            </h1>
            <p className="text-xs text-slate-400">
              {consultation.user?.company_name && `${consultation.user.company_name} • `}
              {isConsultant ? "Consultant View" : "Client View"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <span className={cn(
              "w-2 h-2 rounded-full",
              consultationStarted ? "bg-emerald-400" : "bg-yellow-400"
            )} />
            <span className={consultationStarted ? "text-emerald-400" : "text-yellow-400"}>
              {consultationStarted ? "Active" : "Starting..."}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-slate-400">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat/Video Toggle */}
        <div className="w-80 border-r border-white/10 bg-slate-900/30 flex flex-col shrink-0">
          {/* Left Panel Tabs */}
          <div className="flex border-b border-white/10">
            {["chat", "video"].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftPanelTab(tab as TabId)}
                className={cn(
                  "flex-1 py-2 px-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors",
                  leftPanelTab === tab
                    ? "text-sky-400 bg-sky-500/10 border-b-2 border-sky-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                {TABS.find((t) => t.id === tab)?.icon}
                {TABS.find((t) => t.id === tab)?.label}
              </button>
            ))}
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 min-h-0">
            {renderTabContent(leftPanelTab, true)}
          </div>
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Center Panel Header */}
          <div className="h-10 border-b border-white/10 bg-slate-900/30 flex items-center px-4 overflow-x-auto">
            <div className="flex gap-1">
                {["whiteboard", "code", "sandbox", "files", "summary"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as TabId)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap",
                      activeTab === tab
                        ? "text-sky-400 bg-sky-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}
                  >
                    {TABS.find((t) => t.id === tab)?.icon}
                    {TABS.find((t) => t.id === tab)?.label}
                  </button>
                ))}
              </div>
          </div>

          {/* Center Panel Content */}
          <div className="flex-1 min-h-0 p-4">
            {renderTabContent(activeTab)}
          </div>
        </div>

        {/* Right Panel - Toggleable */}
        {showRightPanel && (
          <div className="w-80 border-l border-white/10 bg-slate-900/30 flex flex-col shrink-0">
            {/* Right Panel Tabs */}
            <div className="flex border-b border-white/10">
              {["ai", "sandbox", "summary"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightPanelTab(tab as TabId)}
                  className={cn(
                    "flex-1 py-2 px-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors",
                    rightPanelTab === tab
                      ? "text-sky-400 bg-sky-500/10 border-b-2 border-sky-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  {TABS.find((t) => t.id === tab)?.icon}
                </button>
              ))}
            </div>

            {/* Right Panel Content */}
            <div className="flex-1 min-h-0">
              {renderTabContent(rightPanelTab, true)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Tab Bar */}
      <div className="sm:hidden h-14 border-t border-white/10 bg-slate-900/50 flex items-center justify-around px-2 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors",
              activeTab === tab.id
                ? "text-sky-400"
                : "text-slate-400"
            )}
          >
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
