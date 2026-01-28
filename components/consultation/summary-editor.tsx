"use client"

import { useState, useEffect, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Save,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  createSummary,
  getSummary,
  updateSummary,
  toggleActionItem,
  archiveSummary,
} from "@/app/actions/summary-actions"
import type { ConsultationSessionSummary } from "@/types/consultations"

interface ActionItem {
  item: string
  completed?: boolean
  due_date?: string
}

interface SummaryEditorProps {
  consultationId: string
  isConsultant: boolean
  className?: string
}

export function SummaryEditor({
  consultationId,
  isConsultant,
  className,
}: SummaryEditorProps) {
  const [summary, setSummary] = useState<ConsultationSessionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState("notes")
  
  // Action items state
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [newActionItem, setNewActionItem] = useState("")
  
  // Key decisions state
  const [keyDecisions, setKeyDecisions] = useState<string[]>([])
  const [newDecision, setNewDecision] = useState("")
  
  // Follow-up tasks state
  const [followUpTasks, setFollowUpTasks] = useState<string[]>([])
  const [newFollowUp, setNewFollowUp] = useState("")

  // TipTap editor for notes
  const notesEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your session notes here...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: "",
    editable: isConsultant,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  })

  // TipTap editor for summary
  const summaryEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a brief summary of the consultation...",
      }),
    ],
    content: "",
    editable: isConsultant,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[100px] p-4",
      },
    },
  })

  // Load existing summary
  useEffect(() => {
    async function loadSummary() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getSummary(consultationId)
        if (result.success && result.summary) {
          setSummary(result.summary)
          notesEditor?.commands.setContent(result.summary.notes || "")
          summaryEditor?.commands.setContent(result.summary.summary || "")
          setActionItems(result.summary.action_items || [])
          setKeyDecisions(result.summary.key_decisions || [])
          setFollowUpTasks(result.summary.follow_up_tasks || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load summary")
      } finally {
        setIsLoading(false)
      }
    }
    loadSummary()
  }, [consultationId, notesEditor, summaryEditor])

  // Save summary
  const handleSave = useCallback(async () => {
    if (!isConsultant) return

    setIsSaving(true)
    setError(null)

    try {
      const data = {
        summary: summaryEditor?.getHTML() || "",
        notes: notesEditor?.getHTML() || "",
        action_items: actionItems,
        key_decisions: keyDecisions,
        follow_up_tasks: followUpTasks,
      }

      let result
      if (summary) {
        result = await updateSummary({
          summary_id: summary.id,
          ...data,
        })
      } else {
        result = await createSummary({
          consultation_id: consultationId,
          ...data,
        })
      }

      if (result.success && result.summary) {
        setSummary(result.summary)
        setLastSaved(new Date())
      } else {
        setError(result.error || "Failed to save summary")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save summary")
    } finally {
      setIsSaving(false)
    }
  }, [
    isConsultant,
    summary,
    consultationId,
    summaryEditor,
    notesEditor,
    actionItems,
    keyDecisions,
    followUpTasks,
  ])

  // Finalize summary
  const handleFinalize = async () => {
    if (!summary) return

    setIsSaving(true)
    try {
      const result = await updateSummary({
        summary_id: summary.id,
        status: "final",
      })
      if (result.success && result.summary) {
        setSummary(result.summary)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to finalize")
    } finally {
      setIsSaving(false)
    }
  }

  // Archive summary
  const handleArchive = async () => {
    if (!summary) return

    setIsSaving(true)
    try {
      const result = await archiveSummary(summary.id)
      if (result.success) {
        setSummary(null)
        notesEditor?.commands.clearContent()
        summaryEditor?.commands.clearContent()
        setActionItems([])
        setKeyDecisions([])
        setFollowUpTasks([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive")
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle action item
  const handleToggleAction = async (index: number) => {
    if (!summary) {
      // Local toggle if not saved yet
      setActionItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, completed: !item.completed } : item
        )
      )
    } else {
      const result = await toggleActionItem(summary.id, index)
      if (result.success) {
        setActionItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, completed: !item.completed } : item
          )
        )
      }
    }
  }

  // Add action item
  const handleAddActionItem = () => {
    if (!newActionItem.trim()) return
    setActionItems((prev) => [...prev, { item: newActionItem.trim(), completed: false }])
    setNewActionItem("")
  }

  // Remove action item
  const handleRemoveActionItem = (index: number) => {
    setActionItems((prev) => prev.filter((_, i) => i !== index))
  }

  // Add key decision
  const handleAddDecision = () => {
    if (!newDecision.trim()) return
    setKeyDecisions((prev) => [...prev, newDecision.trim()])
    setNewDecision("")
  }

  // Remove key decision
  const handleRemoveDecision = (index: number) => {
    setKeyDecisions((prev) => prev.filter((_, i) => i !== index))
  }

  // Add follow-up task
  const handleAddFollowUp = () => {
    if (!newFollowUp.trim()) return
    setFollowUpTasks((prev) => [...prev, newFollowUp.trim()])
    setNewFollowUp("")
  }

  // Remove follow-up task
  const handleRemoveFollowUp = (index: number) => {
    setFollowUpTasks((prev) => prev.filter((_, i) => i !== index))
  }

  // Toolbar button component
  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
  }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8",
        isActive && "bg-sky-500/20 text-sky-400"
      )}
    >
      {children}
    </Button>
  )

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          <h3 className="font-semibold text-slate-50">Session Summary</h3>
          {summary && (
            <Badge
              variant="outline"
              className={cn(
                summary.status === "final"
                  ? "border-emerald-500/50 text-emerald-400"
                  : "border-amber-500/50 text-amber-400"
              )}
            >
              {summary.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isConsultant && (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-sky-500 hover:bg-sky-400"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Save
              </Button>
              {summary && summary.status === "draft" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFinalize}
                  disabled={isSaving}
                >
                  Finalize
                </Button>
              )}
              {summary && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleArchive}
                  disabled={isSaving}
                  className="text-slate-400"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Error display */}
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

      {/* Content */}
      <ScrollArea className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
          <TabsList className="mb-4 bg-slate-800/50">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="actions">
              Action Items ({actionItems.length})
            </TabsTrigger>
            <TabsTrigger value="decisions">
              Decisions ({keyDecisions.length})
            </TabsTrigger>
          </TabsList>

          {/* Notes Tab */}
          <TabsContent value="notes" className="mt-0">
            {/* Toolbar */}
            {isConsultant && notesEditor && (
              <div className="flex items-center gap-1 p-2 border border-white/10 rounded-t-lg bg-slate-800/30">
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleBold().run()}
                  isActive={notesEditor.isActive("bold")}
                >
                  <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleItalic().run()}
                  isActive={notesEditor.isActive("italic")}
                >
                  <Italic className="h-4 w-4" />
                </ToolbarButton>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleHeading({ level: 1 }).run()}
                  isActive={notesEditor.isActive("heading", { level: 1 })}
                >
                  <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleHeading({ level: 2 }).run()}
                  isActive={notesEditor.isActive("heading", { level: 2 })}
                >
                  <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleBulletList().run()}
                  isActive={notesEditor.isActive("bulletList")}
                >
                  <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleOrderedList().run()}
                  isActive={notesEditor.isActive("orderedList")}
                >
                  <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleTaskList().run()}
                  isActive={notesEditor.isActive("taskList")}
                >
                  <CheckSquare className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().toggleBlockquote().run()}
                  isActive={notesEditor.isActive("blockquote")}
                >
                  <Quote className="h-4 w-4" />
                </ToolbarButton>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().undo().run()}
                  disabled={!notesEditor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => notesEditor.chain().focus().redo().run()}
                  disabled={!notesEditor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </ToolbarButton>
              </div>
            )}
            <div className="border border-white/10 rounded-b-lg bg-slate-900/50 min-h-[300px]">
              <EditorContent editor={notesEditor} />
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-0">
            <div className="border border-white/10 rounded-lg bg-slate-900/50 min-h-[200px]">
              <EditorContent editor={summaryEditor} />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Write a brief executive summary of the consultation session.
            </p>
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions" className="mt-0 space-y-4">
            {/* Add new action item */}
            {isConsultant && (
              <div className="flex gap-2">
                <Input
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddActionItem()}
                  placeholder="Add an action item..."
                  className="bg-slate-900/50 border-white/10"
                />
                <Button onClick={handleAddActionItem} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Action items list */}
            <div className="space-y-2">
              {actionItems.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No action items yet. Add items to track follow-up tasks.
                </p>
              ) : (
                actionItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5"
                  >
                    <button
                      onClick={() => handleToggleAction(index)}
                      className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                        item.completed
                          ? "bg-emerald-500/20 border-emerald-500/50"
                          : "border-white/20 hover:border-white/40"
                      )}
                    >
                      {item.completed && (
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        item.completed && "line-through text-slate-500"
                      )}
                    >
                      {item.item}
                    </span>
                    {item.due_date && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.due_date}
                      </span>
                    )}
                    {isConsultant && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveActionItem(index)}
                        className="h-6 w-6 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Decisions Tab */}
          <TabsContent value="decisions" className="mt-0 space-y-4">
            {/* Add new decision */}
            {isConsultant && (
              <div className="flex gap-2">
                <Input
                  value={newDecision}
                  onChange={(e) => setNewDecision(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDecision()}
                  placeholder="Add a key decision..."
                  className="bg-slate-900/50 border-white/10"
                />
                <Button onClick={handleAddDecision} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Decisions list */}
            <div className="space-y-2">
              {keyDecisions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No key decisions recorded yet.
                </p>
              ) : (
                keyDecisions.map((decision, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5"
                  >
                    <div className="h-2 w-2 rounded-full bg-indigo-400" />
                    <span className="flex-1 text-sm">{decision}</span>
                    {isConsultant && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDecision(index)}
                        className="h-6 w-6 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Follow-up tasks section */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-slate-300 mb-3">
                Follow-up Tasks
              </h4>
              {isConsultant && (
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newFollowUp}
                    onChange={(e) => setNewFollowUp(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFollowUp()}
                    placeholder="Add a follow-up task..."
                    className="bg-slate-900/50 border-white/10"
                  />
                  <Button onClick={handleAddFollowUp} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                {followUpTasks.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No follow-up tasks yet.
                  </p>
                ) : (
                  followUpTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5"
                    >
                      <div className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="flex-1 text-sm">{task}</span>
                      {isConsultant && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFollowUp(index)}
                          className="h-6 w-6 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}
