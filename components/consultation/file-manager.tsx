"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Upload,
  Download,
  Trash2,
  File,
  FileText,
  FileImage,
  FileCode,
  FileArchive,
  FileAudio,
  FileVideo,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  User,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import {
  createUploadUrl,
  confirmFileUpload,
  getDownloadUrl,
  listConsultationFiles,
  deleteFile,
} from "@/app/actions/file-actions"

interface FileInfo {
  id: string
  filename: string
  mime_type: string
  file_size: number
  uploaded_by: string
  uploader_name?: string
  virus_scanned: boolean
  virus_scan_result?: string
  download_count: number
  created_at: string
  expires_at?: string
}

interface FileManagerProps {
  consultationId: string
  currentUserId: string
  className?: string
}

export function FileManager({
  consultationId,
  currentUserId,
  className,
}: FileManagerProps) {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState<Map<string, number>>(new Map())
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load files
  const loadFiles = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await listConsultationFiles(consultationId)
      if (result.success && result.files) {
        setFiles(result.files)
      } else {
        setError(result.error || "Failed to load files")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files")
    } finally {
      setIsLoading(false)
    }
  }, [consultationId])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  // Handle file upload
  const handleUpload = async (fileList: FileList) => {
    const filesToUpload = Array.from(fileList)

    for (const file of filesToUpload) {
      const uploadId = `${file.name}-${Date.now()}`
      setUploading((prev) => new Map(prev).set(uploadId, 0))

      try {
        // Get upload URL
        const urlResult = await createUploadUrl({
          consultation_id: consultationId,
          filename: file.name,
          mime_type: file.type || "application/octet-stream",
          file_size: file.size,
        })

        if (!urlResult.success || !urlResult.uploadUrl || !urlResult.fileId) {
          throw new Error(urlResult.error || "Failed to get upload URL")
        }

        // Upload file directly to storage
        const xhr = new XMLHttpRequest()

        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100)
              setUploading((prev) => new Map(prev).set(uploadId, progress))
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve()
            } else {
              reject(new Error(`Upload failed: ${xhr.status}`))
            }
          }

          xhr.onerror = () => reject(new Error("Upload failed"))

          xhr.open("PUT", urlResult.uploadUrl!)
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream")
          xhr.send(file)
        })

        // Confirm upload
        await confirmFileUpload(urlResult.fileId)

        // Refresh file list
        await loadFiles()
      } catch (err) {
        console.error("Upload error:", err)
        setError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setUploading((prev) => {
          const next = new Map(prev)
          next.delete(uploadId)
          return next
        })
      }
    }
  }

  // Handle download
  const handleDownload = async (fileId: string) => {
    try {
      const result = await getDownloadUrl(fileId)
      if (result.success && result.downloadUrl) {
        // Open download in new tab
        const link = document.createElement("a")
        link.href = result.downloadUrl
        link.download = result.filename || "download"
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        setError(result.error || "Failed to get download URL")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed")
    }
  }

  // Handle delete
  const handleDelete = async (fileId: string) => {
    try {
      const result = await deleteFile(fileId)
      if (result.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId))
      } else {
        setError(result.error || "Failed to delete file")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files)
      }
    },
    [consultationId]
  )

  // Get file icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImage className="h-4 w-4 text-pink-400" />
    if (mimeType.startsWith("video/")) return <FileVideo className="h-4 w-4 text-purple-400" />
    if (mimeType.startsWith("audio/")) return <FileAudio className="h-4 w-4 text-amber-400" />
    if (mimeType.startsWith("text/")) return <FileText className="h-4 w-4 text-slate-400" />
    if (mimeType.includes("zip") || mimeType.includes("compressed") || mimeType.includes("archive")) {
      return <FileArchive className="h-4 w-4 text-amber-400" />
    }
    if (mimeType.includes("javascript") || mimeType.includes("typescript") || mimeType.includes("json")) {
      return <FileCode className="h-4 w-4 text-sky-400" />
    }
    return <File className="h-4 w-4 text-slate-400" />
  }

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5 text-sky-400" />
          <h3 className="font-semibold text-slate-50">Files</h3>
          <span className="text-xs text-slate-400">({files.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={loadFiles}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-sky-500 hover:bg-sky-400"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="hidden"
      />

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

      {/* Upload progress */}
      {uploading.size > 0 && (
        <div className="px-4 py-2 bg-sky-500/10 border-b border-sky-500/30">
          {Array.from(uploading.entries()).map(([id, progress]) => (
            <div key={id} className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-sky-300">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex-1 transition-colors relative",
          isDragging && "bg-sky-500/10"
        )}
      >
        {isDragging && (
          <div className="absolute inset-4 border-2 border-dashed border-sky-400 rounded-xl flex items-center justify-center z-10 bg-slate-900/80">
            <div className="text-center">
              <Upload className="h-12 w-12 text-sky-400 mx-auto mb-2" />
              <p className="text-lg font-medium text-sky-300">Drop files here</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-slate-500" />
            </div>
            <h4 className="text-lg font-medium text-slate-300 mb-2">No files shared</h4>
            <p className="text-sm text-slate-500 max-w-xs">
              Drag and drop files here or click the Upload button to share files.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5 hover:border-white/10 transition-colors"
                >
                  {/* Icon */}
                  {getFileIcon(file.mime_type)}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {file.filename}
                      </span>
                      {/* Scan status */}
                      {file.virus_scanned ? (
                        file.virus_scan_result === "clean" ? (
                          <ShieldCheck className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <ShieldX className="h-3 w-3 text-red-400 flex-shrink-0" />
                        )
                      ) : (
                        <Shield className="h-3 w-3 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{formatSize(file.file_size)}</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {file.uploader_name || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(file.created_at)}
                      </span>
                      <span>{file.download_count} downloads</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(file.id)}
                      className="h-8 w-8 text-slate-400 hover:text-sky-400"
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    {file.uploaded_by === currentUserId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete file?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete &quot;{file.filename}&quot;. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(file.id)}
                              className="bg-red-500 hover:bg-red-400"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 text-xs text-slate-500">
        Max 50MB per file • Files expire after 90 days • Executable files blocked
      </div>
    </div>
  )
}
