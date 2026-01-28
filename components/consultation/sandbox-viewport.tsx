"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Terminal,
  FolderTree,
  Play,
  Square,
  RefreshCw,
  Hand,
  Users,
  Clock,
  AlertCircle,
  Loader2,
  Code,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { SandboxTerminal } from "./sandbox-terminal"
import { SandboxFileExplorer } from "./sandbox-file-explorer"
import {
  createSandboxSession,
  getSandboxSession,
  killSandboxSession,
  runSandboxCommand,
  runSandboxCode,
  listSandboxFiles,
  readSandboxFile,
  handoffSandboxControl,
  extendSandboxTimeout,
} from "@/app/actions/sandbox-actions"
import type { SandboxSession, SandboxControlMode } from "@/types/consultations"

interface SandboxViewportProps {
  consultationId: string
  currentUserId: string
  isConsultant: boolean
  otherParticipantId?: string
  otherParticipantName?: string
  className?: string
}

export function SandboxViewport({
  consultationId,
  currentUserId,
  isConsultant,
  otherParticipantId,
  otherParticipantName = "Client",
  className,
}: SandboxViewportProps) {
  const [session, setSession] = useState<SandboxSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("terminal")
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [codeToRun, setCodeToRun] = useState("")
  const [codeOutput, setCodeOutput] = useState<string | null>(null)
  const [isRunningCode, setIsRunningCode] = useState(false)

  // Check if current user has control
  const hasControl =
    session?.control_mode === "shared" ||
    session?.current_controller_id === currentUserId ||
    (session?.control_mode === "consultant" && isConsultant) ||
    (session?.control_mode === "client" && !isConsultant)

  // Load existing session
  useEffect(() => {
    async function loadSession() {
      // We need to find any active session for this consultation
      // This is a simplified approach - in production, you'd have an endpoint to get session by consultation ID
      setIsLoading(false)
    }
    loadSession()
  }, [consultationId])

  // Create new sandbox
  const handleCreate = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const result = await createSandboxSession({
        consultation_id: consultationId,
        timeout_hours: 24,
      })

      if (result.success && result.session) {
        setSession(result.session)
      } else {
        setError(result.error || "Failed to create sandbox")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sandbox")
    } finally {
      setIsCreating(false)
    }
  }

  // Stop sandbox
  const handleStop = async () => {
    if (!session) return

    setIsStopping(true)
    setError(null)

    try {
      const result = await killSandboxSession(session.id)

      if (result.success) {
        setSession(null)
      } else {
        setError(result.error || "Failed to stop sandbox")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop sandbox")
    } finally {
      setIsStopping(false)
    }
  }

  // Run command in terminal
  const handleCommand = useCallback(
    async (command: string) => {
      if (!session) {
        return { exitCode: 1, stdout: "", stderr: "No sandbox session" }
      }

      const result = await runSandboxCommand({
        sandbox_session_id: session.id,
        command,
        timeout_seconds: 60,
      })

      if (result.success && result.result) {
        return result.result
      }

      return {
        exitCode: 1,
        stdout: "",
        stderr: result.error || "Command failed",
      }
    },
    [session]
  )

  // List files
  const handleListFiles = useCallback(
    async (path: string) => {
      if (!session) return []

      const result = await listSandboxFiles({
        sandbox_session_id: session.id,
        path,
      })

      if (result.success && result.files) {
        return result.files
      }

      return []
    },
    [session]
  )

  // Select file
  const handleSelectFile = useCallback(
    async (path: string) => {
      if (!session) return

      setSelectedFile(path)
      const result = await readSandboxFile({
        sandbox_session_id: session.id,
        path,
      })

      if (result.success && result.content !== undefined) {
        setFileContent(result.content)
        setActiveTab("code")
      }
    },
    [session]
  )

  // Run code
  const handleRunCode = async () => {
    if (!session || !codeToRun.trim()) return

    setIsRunningCode(true)
    setCodeOutput(null)

    try {
      const result = await runSandboxCode({
        sandbox_session_id: session.id,
        code: codeToRun,
        language: "python", // Default to Python
        timeout_seconds: 30,
      })

      if (result.success && result.result) {
        const output = [
          result.result.stdout,
          result.result.stderr ? `\x1b[31m${result.result.stderr}\x1b[0m` : "",
          result.result.output ? `\n→ ${result.result.output}` : "",
          result.result.error ? `\x1b[31mError: ${result.result.error}\x1b[0m` : "",
        ]
          .filter(Boolean)
          .join("\n")
        setCodeOutput(output)
      } else {
        setCodeOutput(`Error: ${result.error}`)
      }
    } catch (err) {
      setCodeOutput(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsRunningCode(false)
    }
  }

  // Handoff control
  const handleHandoff = async (mode: SandboxControlMode) => {
    if (!session || !otherParticipantId) return

    const newControllerId =
      mode === "consultant"
        ? isConsultant
          ? currentUserId
          : otherParticipantId
        : mode === "client"
        ? isConsultant
          ? otherParticipantId
          : currentUserId
        : currentUserId

    const result = await handoffSandboxControl({
      sandbox_session_id: session.id,
      new_controller_id: newControllerId,
      control_mode: mode,
    })

    if (result.success) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              control_mode: mode,
              current_controller_id: newControllerId,
            }
          : null
      )
    } else {
      setError(result.error || "Failed to transfer control")
    }
  }

  // Extend timeout
  const handleExtendTimeout = async () => {
    if (!session) return

    const result = await extendSandboxTimeout(session.id, 4)

    if (result.success && result.newExpiresAt) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              expires_at: result.newExpiresAt!.toISOString(),
            }
          : null
      )
    } else {
      setError(result.error || "Failed to extend timeout")
    }
  }

  // No sandbox - show create button
  if (!session) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-50">Coding Sandbox</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Code className="h-12 w-12 text-emerald-400" />
          </div>

          <div className="text-center">
            <h4 className="text-xl font-semibold text-slate-50 mb-2">
              E2B Coding Sandbox
            </h4>
            <p className="text-slate-400 max-w-md">
              Start a collaborative coding environment. Both parties can view
              the terminal, files, and code output in real-time.
            </p>
          </div>

          {error && (
            <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {isConsultant ? (
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-6 text-lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Terminal className="h-5 w-5 mr-2" />
                  Start Sandbox
                </>
              )}
            </Button>
          ) : (
            <p className="text-sm text-slate-500">
              Waiting for consultant to start the sandbox...
            </p>
          )}

          <p className="text-xs text-slate-500">
            Sandboxes have a 24-hour timeout • Includes Python, Node.js, and common tools
          </p>
        </div>
      </div>
    )
  }

  // Sandbox active
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-50">Sandbox Active</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            <span>
              Expires:{" "}
              {session.expires_at
                ? new Date(session.expires_at).toLocaleTimeString()
                : "Unknown"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Control indicator */}
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs",
              hasControl
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-amber-500/20 text-amber-300"
            )}
          >
            <Hand className="h-3 w-3" />
            {hasControl ? "You have control" : `${otherParticipantName} has control`}
          </div>

          {/* Handoff dialog */}
          {isConsultant && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400">
                  <Users className="h-4 w-4 mr-1" />
                  Handoff
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10">
                <DialogHeader>
                  <DialogTitle>Control Handoff</DialogTitle>
                  <DialogDescription>
                    Transfer control of the sandbox to the client or enable shared mode.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Button
                    onClick={() => handleHandoff("client")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Hand className="h-4 w-4 mr-2" />
                    Give control to {otherParticipantName}
                  </Button>
                  <Button
                    onClick={() => handleHandoff("shared")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Enable shared mode (both can type)
                  </Button>
                  <Button
                    onClick={() => handleHandoff("consultant")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Hand className="h-4 w-4 mr-2" />
                    Take back control
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Extend timeout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExtendTimeout}
            className="text-slate-400"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            +4h
          </Button>

          {/* Stop button */}
          {isConsultant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStop}
              disabled={isStopping}
              className="text-red-400 hover:text-red-300"
            >
              {isStopping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/30 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto text-red-400"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* File explorer sidebar */}
        <div className="w-48 border-r border-white/10 flex-shrink-0">
          <SandboxFileExplorer
            onListFiles={handleListFiles}
            onSelectFile={handleSelectFile}
            disabled={!hasControl}
            className="h-full"
          />
        </div>

        {/* Main panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2 w-fit bg-slate-800/50">
              <TabsTrigger value="terminal" className="gap-1">
                <Terminal className="h-3 w-3" />
                Terminal
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1">
                <Code className="h-3 w-3" />
                Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terminal" className="flex-1 p-4 min-h-0">
              <SandboxTerminal
                onCommand={handleCommand}
                disabled={!hasControl}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="code" className="flex-1 p-4 flex flex-col gap-4 min-h-0">
              {/* Code editor */}
              <div className="flex-1 min-h-0">
                <Textarea
                  value={fileContent || codeToRun}
                  onChange={(e) => {
                    setCodeToRun(e.target.value)
                    setFileContent(null)
                  }}
                  placeholder="# Enter Python code to run..."
                  disabled={!hasControl}
                  className="h-full resize-none font-mono text-sm bg-slate-900/50 border-white/10"
                />
              </div>

              {/* Run button and output */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRunCode}
                  disabled={!hasControl || isRunningCode || !codeToRun.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400"
                >
                  {isRunningCode ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-1" />
                  )}
                  Run Code
                </Button>
                {selectedFile && (
                  <span className="text-xs text-slate-400">
                    Editing: {selectedFile}
                  </span>
                )}
              </div>

              {/* Output */}
              {codeOutput && (
                <div className="h-32 p-3 rounded-lg bg-slate-900/80 border border-white/10 overflow-auto">
                  <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
                    {codeOutput}
                  </pre>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
