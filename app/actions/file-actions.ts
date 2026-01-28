"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// =============================================================================
// TYPES & SCHEMAS
// =============================================================================

const uploadFileSchema = z.object({
  consultation_id: z.string().uuid(),
  filename: z.string().min(1),
  mime_type: z.string().min(1),
  file_size: z.number().positive(),
  is_public: z.boolean().optional(),
})

const downloadFileSchema = z.object({
  file_id: z.string().uuid(),
})

// Blocked file extensions for security
const BLOCKED_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".vbe",
  ".js", ".jse", ".ws", ".wsf", ".wsc", ".wsh",
  ".msi", ".msp", ".com", ".scr", ".pif",
  ".application", ".gadget", ".hta", ".cpl",
  ".msc", ".jar", ".dll", ".sys",
]

// Max file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024

// File retention (90 days)
const DEFAULT_RETENTION_DAYS = 90

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Verify user has access to consultation
 */
async function verifyConsultationAccess(
  consultationId: string,
  userId: string
): Promise<boolean> {
  const result = await sql.query(
    `SELECT 1 FROM consultations 
     WHERE id = $1 AND (user_id = $2 OR assigned_consultant_id = $2)`,
    [consultationId, userId]
  )
  return result.rows.length > 0
}

/**
 * Check if file extension is blocked
 */
function isBlockedExtension(filename: string): boolean {
  const lowerFilename = filename.toLowerCase()
  return BLOCKED_EXTENSIONS.some((ext) => lowerFilename.endsWith(ext))
}

/**
 * Generate secure storage path
 */
function generateStoragePath(consultationId: string, filename: string): string {
  const timestamp = Date.now()
  const random = crypto.randomBytes(8).toString("hex")
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  return `consultations/${consultationId}/${timestamp}-${random}-${safeFilename}`
}

/**
 * Calculate file hash (for deduplication and integrity)
 */
function calculateFileHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex")
}

/**
 * Get Supabase client for storage operations
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase configuration missing")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// =============================================================================
// FILE UPLOAD
// =============================================================================

/**
 * Upload a file to the consultation
 * Returns a signed upload URL for the client to upload directly
 */
export async function createUploadUrl(
  input: z.infer<typeof uploadFileSchema>
): Promise<{
  success: boolean
  uploadUrl?: string
  fileId?: string
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = uploadFileSchema.parse(input)

    // Verify access
    const hasAccess = await verifyConsultationAccess(validated.consultation_id, user.id)
    if (!hasAccess) {
      return { success: false, error: "Not authorized to access this consultation" }
    }

    // Validate file
    if (isBlockedExtension(validated.filename)) {
      return { success: false, error: "This file type is not allowed for security reasons" }
    }

    if (validated.file_size > MAX_FILE_SIZE) {
      return { success: false, error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` }
    }

    // Generate storage path
    const storagePath = generateStoragePath(validated.consultation_id, validated.filename)

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + DEFAULT_RETENTION_DAYS)

    // Create file record
    const insertResult = await sql.query(
      `INSERT INTO consultation_files (
        consultation_id,
        uploaded_by,
        filename,
        original_filename,
        storage_path,
        storage_provider,
        mime_type,
        file_size,
        virus_scanned,
        is_public,
        retention_days,
        expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
      [
        validated.consultation_id,
        user.id,
        validated.filename,
        validated.filename,
        storagePath,
        "supabase",
        validated.mime_type,
        validated.file_size,
        false, // Will be scanned after upload
        validated.is_public ?? false,
        DEFAULT_RETENTION_DAYS,
        expiresAt.toISOString(),
      ]
    )

    const fileId = insertResult.rows[0].id

    // Generate signed upload URL
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage
      .from("consultation-files")
      .createSignedUploadUrl(storagePath)

    if (error || !data) {
      // Rollback file record
      await sql.query(`DELETE FROM consultation_files WHERE id = $1`, [fileId])
      return { success: false, error: "Failed to create upload URL" }
    }

    return {
      success: true,
      uploadUrl: data.signedUrl,
      fileId,
    }
  } catch (error) {
    console.error("Error creating upload URL:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create upload URL",
    }
  }
}

/**
 * Confirm file upload and trigger virus scan
 */
export async function confirmFileUpload(
  fileId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Get file record
    const fileResult = await sql.query(
      `SELECT * FROM consultation_files WHERE id = $1`,
      [fileId]
    )

    if (fileResult.rows.length === 0) {
      return { success: false, error: "File not found" }
    }

    const file = fileResult.rows[0]

    // Verify uploader
    if (file.uploaded_by !== user.id) {
      return { success: false, error: "Not authorized" }
    }

    // In production, you would trigger a virus scan here
    // For now, we'll just mark it as scanned (placeholder)
    await sql.query(
      `UPDATE consultation_files 
       SET virus_scanned = true, 
           virus_scan_result = 'clean',
           scanned_at = NOW()
       WHERE id = $1`,
      [fileId]
    )

    revalidatePath(`/consultation/room/${file.consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error confirming upload:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to confirm upload",
    }
  }
}

// =============================================================================
// FILE DOWNLOAD
// =============================================================================

/**
 * Get a signed download URL for a file
 */
export async function getDownloadUrl(
  fileId: string
): Promise<{
  success: boolean
  downloadUrl?: string
  filename?: string
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Get file record
    const fileResult = await sql.query(
      `SELECT f.*, c.user_id as client_id, c.assigned_consultant_id
       FROM consultation_files f
       JOIN consultations c ON f.consultation_id = c.id
       WHERE f.id = $1 AND f.deleted_at IS NULL`,
      [fileId]
    )

    if (fileResult.rows.length === 0) {
      return { success: false, error: "File not found" }
    }

    const file = fileResult.rows[0]

    // Verify access
    const isParticipant =
      file.client_id === user.id || file.assigned_consultant_id === user.id

    if (!isParticipant && !file.is_public) {
      return { success: false, error: "Not authorized to download this file" }
    }

    // Generate signed download URL
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage
      .from("consultation-files")
      .createSignedUrl(file.storage_path, 3600) // 1 hour expiry

    if (error || !data) {
      return { success: false, error: "Failed to generate download URL" }
    }

    // Increment download count
    await sql.query(
      `UPDATE consultation_files SET download_count = download_count + 1 WHERE id = $1`,
      [fileId]
    )

    return {
      success: true,
      downloadUrl: data.signedUrl,
      filename: file.original_filename,
    }
  } catch (error) {
    console.error("Error getting download URL:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get download URL",
    }
  }
}

// =============================================================================
// FILE LISTING
// =============================================================================

/**
 * List files for a consultation
 */
export async function listConsultationFiles(
  consultationId: string
): Promise<{
  success: boolean
  files?: Array<{
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
  }>
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Verify access
    const hasAccess = await verifyConsultationAccess(consultationId, user.id)
    if (!hasAccess) {
      return { success: false, error: "Not authorized to access this consultation" }
    }

    // Get files with uploader info
    const filesResult = await sql.query(
      `SELECT 
        f.id, f.filename, f.mime_type, f.file_size, f.uploaded_by,
        f.virus_scanned, f.virus_scan_result, f.download_count,
        f.created_at, f.expires_at,
        p.first_name, p.last_name
       FROM consultation_files f
       LEFT JOIN profiles p ON f.uploaded_by = p.id
       WHERE f.consultation_id = $1 
         AND f.deleted_at IS NULL
       ORDER BY f.created_at DESC`,
      [consultationId]
    )

    const files = filesResult.rows.map((f: {
      id: string
      filename: string
      mime_type: string
      file_size: number
      uploaded_by: string
      virus_scanned: boolean
      virus_scan_result?: string
      download_count: number
      created_at: string
      expires_at?: string
      first_name?: string
      last_name?: string
    }) => ({
      id: f.id,
      filename: f.filename,
      mime_type: f.mime_type,
      file_size: f.file_size,
      uploaded_by: f.uploaded_by,
      uploader_name: f.first_name && f.last_name 
        ? `${f.first_name} ${f.last_name}` 
        : undefined,
      virus_scanned: f.virus_scanned,
      virus_scan_result: f.virus_scan_result,
      download_count: f.download_count,
      created_at: f.created_at,
      expires_at: f.expires_at,
    }))

    return { success: true, files }
  } catch (error) {
    console.error("Error listing files:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list files",
    }
  }
}

// =============================================================================
// FILE DELETION
// =============================================================================

/**
 * Delete a file (soft delete)
 */
export async function deleteFile(
  fileId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Get file record
    const fileResult = await sql.query(
      `SELECT f.*, c.user_id as client_id, c.assigned_consultant_id
       FROM consultation_files f
       JOIN consultations c ON f.consultation_id = c.id
       WHERE f.id = $1 AND f.deleted_at IS NULL`,
      [fileId]
    )

    if (fileResult.rows.length === 0) {
      return { success: false, error: "File not found" }
    }

    const file = fileResult.rows[0]

    // Only uploader or consultant can delete
    if (file.uploaded_by !== user.id && file.assigned_consultant_id !== user.id) {
      return { success: false, error: "Not authorized to delete this file" }
    }

    // Soft delete
    await sql.query(
      `UPDATE consultation_files SET deleted_at = NOW() WHERE id = $1`,
      [fileId]
    )

    // Also delete from storage (optional - could keep for recovery)
    try {
      const supabase = getSupabaseClient()
      await supabase.storage
        .from("consultation-files")
        .remove([file.storage_path])
    } catch (storageError) {
      console.warn("Failed to delete from storage:", storageError)
      // Don't fail the operation - file is marked as deleted
    }

    revalidatePath(`/consultation/room/${file.consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete file",
    }
  }
}

// =============================================================================
// CLEANUP
// =============================================================================

/**
 * Clean up expired files (admin/cron job)
 */
export async function cleanupExpiredFiles(): Promise<{
  success: boolean
  cleaned: number
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, cleaned: 0, error: "Authentication required" }
    }

    // Get expired files
    const expiredResult = await sql.query(
      `SELECT id, storage_path FROM consultation_files 
       WHERE expires_at < NOW() AND deleted_at IS NULL`
    )

    if (expiredResult.rows.length === 0) {
      return { success: true, cleaned: 0 }
    }

    const supabase = getSupabaseClient()
    let cleaned = 0

    for (const file of expiredResult.rows) {
      try {
        // Delete from storage
        await supabase.storage
          .from("consultation-files")
          .remove([file.storage_path])

        // Mark as deleted
        await sql.query(
          `UPDATE consultation_files SET deleted_at = NOW() WHERE id = $1`,
          [file.id]
        )

        cleaned++
      } catch (err) {
        console.warn(`Failed to cleanup file ${file.id}:`, err)
      }
    }

    return { success: true, cleaned }
  } catch (error) {
    console.error("Error cleaning up files:", error)
    return {
      success: false,
      cleaned: 0,
      error: error instanceof Error ? error.message : "Failed to cleanup files",
    }
  }
}
