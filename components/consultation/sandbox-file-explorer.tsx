"use client"

import { useState, useCallback } from "react"
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  FileText,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface FileEntry {
  name: string
  path: string
  isDir: boolean
  size?: number
}

interface SandboxFileExplorerProps {
  onListFiles: (path: string) => Promise<FileEntry[]>
  onSelectFile: (path: string) => void
  disabled?: boolean
  className?: string
}

interface TreeNode extends FileEntry {
  children?: TreeNode[]
  isExpanded?: boolean
  isLoading?: boolean
}

export function SandboxFileExplorer({
  onListFiles,
  onSelectFile,
  disabled = false,
  className,
}: SandboxFileExplorerProps) {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load root directory
  const loadRoot = useCallback(async () => {
    if (disabled) return
    
    setIsRefreshing(true)
    setError(null)
    
    try {
      const files = await onListFiles("/home/user")
      setTree(
        files.map((f) => ({
          ...f,
          isExpanded: false,
          children: f.isDir ? undefined : undefined,
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files")
    } finally {
      setIsRefreshing(false)
    }
  }, [onListFiles, disabled])

  // Toggle directory expansion
  const toggleDir = useCallback(
    async (path: string) => {
      if (disabled) return

      setTree((prevTree) => {
        const updateNode = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map((node) => {
            if (node.path === path && node.isDir) {
              if (node.isExpanded) {
                // Collapse
                return { ...node, isExpanded: false }
              } else {
                // Mark as loading, will expand after fetch
                return { ...node, isLoading: true }
              }
            }
            if (node.children) {
              return { ...node, children: updateNode(node.children) }
            }
            return node
          })
        }
        return updateNode(prevTree)
      })

      // Check if we need to fetch children
      const findNode = (nodes: TreeNode[], targetPath: string): TreeNode | null => {
        for (const node of nodes) {
          if (node.path === targetPath) return node
          if (node.children) {
            const found = findNode(node.children, targetPath)
            if (found) return found
          }
        }
        return null
      }

      const node = findNode(tree, path)
      if (node && node.isDir && !node.isExpanded && !node.children) {
        // Fetch children
        try {
          const children = await onListFiles(path)
          setTree((prevTree) => {
            const updateNode = (nodes: TreeNode[]): TreeNode[] => {
              return nodes.map((n) => {
                if (n.path === path) {
                  return {
                    ...n,
                    isExpanded: true,
                    isLoading: false,
                    children: children.map((c) => ({
                      ...c,
                      isExpanded: false,
                    })),
                  }
                }
                if (n.children) {
                  return { ...n, children: updateNode(n.children) }
                }
                return n
              })
            }
            return updateNode(prevTree)
          })
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load directory")
          setTree((prevTree) => {
            const updateNode = (nodes: TreeNode[]): TreeNode[] => {
              return nodes.map((n) => {
                if (n.path === path) {
                  return { ...n, isLoading: false }
                }
                if (n.children) {
                  return { ...n, children: updateNode(n.children) }
                }
                return n
              })
            }
            return updateNode(prevTree)
          })
        }
      } else if (node && node.isDir && node.children) {
        // Already has children, just toggle expansion
        setTree((prevTree) => {
          const updateNode = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map((n) => {
              if (n.path === path) {
                return { ...n, isExpanded: !n.isExpanded, isLoading: false }
              }
              if (n.children) {
                return { ...n, children: updateNode(n.children) }
              }
              return n
            })
          }
          return updateNode(prevTree)
        })
      }
    },
    [disabled, onListFiles, tree]
  )

  // Handle file selection
  const handleSelect = useCallback(
    (node: TreeNode) => {
      if (disabled) return
      
      if (node.isDir) {
        toggleDir(node.path)
      } else {
        setSelectedPath(node.path)
        onSelectFile(node.path)
      }
    },
    [disabled, toggleDir, onSelectFile]
  )

  // Get icon for file type
  const getFileIcon = (node: TreeNode) => {
    if (node.isDir) {
      return node.isExpanded ? (
        <FolderOpen className="h-4 w-4 text-amber-400" />
      ) : (
        <Folder className="h-4 w-4 text-amber-400" />
      )
    }

    const ext = node.name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "py":
      case "rb":
      case "go":
        return <FileCode className="h-4 w-4 text-sky-400" />
      case "json":
        return <FileJson className="h-4 w-4 text-amber-400" />
      case "md":
      case "txt":
        return <FileText className="h-4 w-4 text-slate-400" />
      default:
        return <File className="h-4 w-4 text-slate-400" />
    }
  }

  // Render tree node
  const renderNode = (node: TreeNode, depth: number = 0) => {
    return (
      <div key={node.path}>
        <button
          onClick={() => handleSelect(node)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center gap-1 px-2 py-1 text-sm text-left rounded transition-colors",
            "hover:bg-white/5",
            selectedPath === node.path && "bg-sky-500/20 text-sky-300",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.isDir && (
            <span className="w-4 h-4 flex items-center justify-center">
              {node.isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
              ) : node.isExpanded ? (
                <ChevronDown className="h-3 w-3 text-slate-400" />
              ) : (
                <ChevronRight className="h-3 w-3 text-slate-400" />
              )}
            </span>
          )}
          {!node.isDir && <span className="w-4" />}
          {getFileIcon(node)}
          <span className="truncate flex-1">{node.name}</span>
          {!node.isDir && node.size !== undefined && (
            <span className="text-xs text-slate-500">
              {node.size < 1024
                ? `${node.size}B`
                : node.size < 1024 * 1024
                ? `${Math.round(node.size / 1024)}KB`
                : `${Math.round(node.size / 1024 / 1024)}MB`}
            </span>
          )}
        </button>
        {node.isDir && node.isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-sm font-medium text-slate-300">Files</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={loadRoot}
          disabled={disabled || isRefreshing}
          className="h-6 w-6"
        >
          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      {/* File tree */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {error && (
            <div className="px-2 py-1 text-xs text-red-400">{error}</div>
          )}
          {tree.length === 0 && !error && !isRefreshing && (
            <div className="px-2 py-4 text-xs text-slate-500 text-center">
              Click refresh to load files
            </div>
          )}
          {tree.map((node) => renderNode(node))}
        </div>
      </ScrollArea>
    </div>
  )
}
