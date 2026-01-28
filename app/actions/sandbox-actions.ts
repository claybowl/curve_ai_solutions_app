"use server"

/**
 * Server Actions for E2B Sandbox Management
 * 
 * Handles sandbox lifecycle operations for consultation sessions:
 * - Create/connect/kill sandboxes
 * - Execute code and commands
 * - Manage file operations
 * - Handle control handoff between consultant and client
 */

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer, isUserAdmin } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import {
  createSandbox as e2bCreateSandbox,
  connectToSandbox,
  runCode as e2bRunCode,
  runCommand as e2bRunCommand,
  writeFile as e2bWriteFile,
  readFile as e2bReadFile,
  listFiles as e2bListFiles,
  extendTimeout,
  killSandbox,
  killSandboxById,
  getSandboxInfo,
  listRunningSandboxes,
  installPackages,
  setupNextJsEnvironment,
} from "@/lib/e2b-client"
import type { 
  SandboxSession, 
  SandboxStatus, 
  SandboxControlMode,
  CreateSandboxInput 
} from "@/types/consultations"

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const createSandboxSchema = z.object({
  consultation_id: z.string().uuid(),
  template: z.string().optional(),
  environment_config: z.record(z.string()).optional(),
  timeout_hours: z.number().min(1).max(24).optional(),
})

const runCodeSchema = z.object({
  sandbox_session_id: z.string().uuid(),
  code: z.string().min(1),
  language: z.enum(["python", "javascript", "typescript"]).optional(),
  timeout_seconds: z.number().min(1).max(300).optional(),
})

const runCommandSchema = z.object({
  sandbox_session_id: z.string().uuid(),
  command: z.string().min(1),
  cwd: z.string().optional(),
  timeout_seconds: z.number().min(1).max(300).optional(),
})

const fileOperationSchema = z.object({
  sandbox_session_id: z.string().uuid(),
  path: z.string().min(1),
  content: z.string().optional(), // Only for write operations
})

const handoffControlSchema = z.object({
  sandbox_session_id: z.string().uuid(),
  new_controller_id: z.string().uuid(),
  control_mode: z.enum(["consultant", "client", "shared"]),
})

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Verify user has access to the consultation (participant or admin)
 */
async function verifyConsultationAccess(
  consultationId: string,
  userId: string
): Promise<{ authorized: boolean; role: "consultant" | "client" | "admin" }> {
  const admin = await isUserAdmin()
  if (admin) {
    return { authorized: true, role: "admin" }
  }

  const result = await sql.query(
    `SELECT user_id, assigned_consultant_id 
     FROM consultations 
     WHERE id = $1`,
    [consultationId]
  )

  if (!result || result.length === 0) {
    return { authorized: false, role: "client" }
  }

  const consultation = result[0]
  if (consultation.user_id === userId) {
    return { authorized: true, role: "client" }
  }
  if (consultation.assigned_consultant_id === userId) {
    return { authorized: true, role: "consultant" }
  }

  return { authorized: false, role: "client" }
}

/**
 * Get sandbox session and verify access
 */
async function getSandboxSessionWithAccess(
  sessionId: string,
  userId: string
): Promise<{
  session: SandboxSession | null
  authorized: boolean
  role: "consultant" | "client" | "admin"
}> {
  const result = await sql.query(
    `SELECT * FROM sandbox_sessions WHERE id = $1`,
    [sessionId]
  )

  if (!result || result.length === 0) {
    return { session: null, authorized: false, role: "client" }
  }

  const session = result[0] as SandboxSession
  const access = await verifyConsultationAccess(session.consultation_id, userId)

  return { session, ...access }
}

/**
 * Check if user has control of the sandbox
 */
function hasControl(
  session: SandboxSession,
  userId: string,
  role: "consultant" | "client" | "admin"
): boolean {
  if (role === "admin") return true
  if (session.control_mode === "shared") return true
  if (session.current_controller_id === userId) return true
  if (session.control_mode === "consultant" && role === "consultant") return true
  if (session.control_mode === "client" && role === "client") return true
  return false
}

// =============================================================================
// SANDBOX LIFECYCLE ACTIONS
// =============================================================================

/**
 * Create a new sandbox for a consultation
 */
export async function createSandboxSession(
  input: CreateSandboxInput
): Promise<{
  success: boolean
  session?: SandboxSession
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = createSandboxSchema.parse(input)
    
    // Verify consultation access
    const access = await verifyConsultationAccess(validated.consultation_id, user.id)
    if (!access.authorized) {
      return { success: false, error: "Not authorized to access this consultation" }
    }

    // Only consultants and admins can create sandboxes
    if (access.role === "client") {
      return { success: false, error: "Only consultants can create sandboxes" }
    }

    // Check if there's already an active sandbox for this consultation
    const existingResult = await sql.query(
      `SELECT id FROM sandbox_sessions 
       WHERE consultation_id = $1 
       AND status IN ('creating', 'running', 'paused')`,
      [validated.consultation_id]
    )

    if (existingResult && existingResult.length > 0) {
      return { 
        success: false, 
        error: "A sandbox already exists for this consultation. Kill it first to create a new one." 
      }
    }

    // Create E2B sandbox
    const { sandbox, sandboxId, expiresAt } = await e2bCreateSandbox({
      template: validated.template,
      timeoutHours: validated.timeout_hours,
      environmentConfig: validated.environment_config,
    })

    // Save to database
    const insertResult = await sql.query(
      `INSERT INTO sandbox_sessions (
        consultation_id,
        e2b_sandbox_id,
        e2b_template,
        status,
        current_controller_id,
        control_mode,
        environment_config,
        timeout_hours,
        expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        validated.consultation_id,
        sandboxId,
        validated.template ?? "base",
        "running",
        user.id,
        "consultant",
        JSON.stringify(validated.environment_config ?? {}),
        validated.timeout_hours ?? 24,
        expiresAt.toISOString(),
      ]
    )

    revalidatePath(`/consultation/room/${validated.consultation_id}`)

    return {
      success: true,
      session: insertResult[0] as SandboxSession,
    }
  } catch (error) {
    console.error("Error creating sandbox:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create sandbox",
    }
  }
}

/**
 * Get sandbox session details
 */
export async function getSandboxSession(
  sessionId: string
): Promise<{
  success: boolean
  session?: SandboxSession
  e2bInfo?: {
    running: boolean
    startedAt?: Date
    endAt?: Date
  }
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const { session, authorized } = await getSandboxSessionWithAccess(sessionId, user.id)
    
    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }

    // Get live E2B status
    const e2bInfo = await getSandboxInfo(session.e2b_sandbox_id)

    // Update status if sandbox has stopped
    if (e2bInfo && !e2bInfo.running && session.status === "running") {
      await sql.query(
        `UPDATE sandbox_sessions SET status = 'expired' WHERE id = $1`,
        [sessionId]
      )
      session.status = "expired"
    }

    return {
      success: true,
      session,
      e2bInfo: e2bInfo ? {
        running: e2bInfo.running,
        startedAt: e2bInfo.startedAt,
        endAt: e2bInfo.endAt,
      } : undefined,
    }
  } catch (error) {
    console.error("Error getting sandbox session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get sandbox session",
    }
  }
}

/**
 * Extend sandbox timeout
 */
export async function extendSandboxTimeout(
  sessionId: string,
  additionalHours: number
): Promise<{
  success: boolean
  newExpiresAt?: Date
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const { session, authorized, role } = await getSandboxSessionWithAccess(sessionId, user.id)
    
    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized || role === "client") {
      return { success: false, error: "Only consultants can extend sandbox timeout" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Can only extend running sandboxes" }
    }

    // Connect and extend
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    const newExpiresAt = await extendTimeout(sandbox, additionalHours)

    // Update database
    await sql.query(
      `UPDATE sandbox_sessions 
       SET expires_at = $1, updated_at = NOW() 
       WHERE id = $2`,
      [newExpiresAt.toISOString(), sessionId]
    )

    return { success: true, newExpiresAt }
  } catch (error) {
    console.error("Error extending sandbox timeout:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to extend timeout",
    }
  }
}

/**
 * Kill a sandbox session
 */
export async function killSandboxSession(
  sessionId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const { session, authorized, role } = await getSandboxSessionWithAccess(sessionId, user.id)
    
    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized || role === "client") {
      return { success: false, error: "Only consultants can kill sandboxes" }
    }

    // Kill E2B sandbox
    try {
      await killSandboxById(session.e2b_sandbox_id)
    } catch (e) {
      // Sandbox might already be dead
      console.warn("E2B sandbox kill error (may already be dead):", e)
    }

    // Update database
    await sql.query(
      `UPDATE sandbox_sessions 
       SET status = 'stopped', updated_at = NOW() 
       WHERE id = $1`,
      [sessionId]
    )

    revalidatePath(`/consultation/room/${session.consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error killing sandbox:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to kill sandbox",
    }
  }
}

// =============================================================================
// CODE EXECUTION ACTIONS
// =============================================================================

/**
 * Run code in the sandbox
 */
export async function runSandboxCode(
  input: z.infer<typeof runCodeSchema>
): Promise<{
  success: boolean
  result?: {
    stdout: string
    stderr: string
    output?: string
    error?: string
  }
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = runCodeSchema.parse(input)
    const { session, authorized, role } = await getSandboxSessionWithAccess(
      validated.sandbox_session_id,
      user.id
    )

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }
    if (!hasControl(session, user.id, role)) {
      return { success: false, error: "You don't have control of this sandbox" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Sandbox is not running" }
    }

    // Connect and run code
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    const result = await e2bRunCode(sandbox, validated.code, {
      language: validated.language,
      timeoutSeconds: validated.timeout_seconds,
    })

    // Update last activity
    await sql.query(
      `UPDATE sandbox_sessions SET last_activity_at = NOW() WHERE id = $1`,
      [validated.sandbox_session_id]
    )

    return {
      success: true,
      result: {
        stdout: result.stdout,
        stderr: result.stderr,
        output: result.result,
        error: result.error,
      },
    }
  } catch (error) {
    console.error("Error running code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to run code",
    }
  }
}

/**
 * Run shell command in the sandbox
 */
export async function runSandboxCommand(
  input: z.infer<typeof runCommandSchema>
): Promise<{
  success: boolean
  result?: {
    exitCode: number
    stdout: string
    stderr: string
  }
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = runCommandSchema.parse(input)
    const { session, authorized, role } = await getSandboxSessionWithAccess(
      validated.sandbox_session_id,
      user.id
    )

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }
    if (!hasControl(session, user.id, role)) {
      return { success: false, error: "You don't have control of this sandbox" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Sandbox is not running" }
    }

    // Connect and run command
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    const result = await e2bRunCommand(sandbox, validated.command, {
      cwd: validated.cwd,
      timeoutSeconds: validated.timeout_seconds,
    })

    // Update last activity
    await sql.query(
      `UPDATE sandbox_sessions SET last_activity_at = NOW() WHERE id = $1`,
      [validated.sandbox_session_id]
    )

    return {
      success: true,
      result: {
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
      },
    }
  } catch (error) {
    console.error("Error running command:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to run command",
    }
  }
}

// =============================================================================
// FILE OPERATIONS
// =============================================================================

/**
 * Write file to sandbox
 */
export async function writeSandboxFile(
  input: z.infer<typeof fileOperationSchema> & { content: string }
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = fileOperationSchema.parse(input)
    if (!input.content) {
      return { success: false, error: "Content is required for write operation" }
    }

    const { session, authorized, role } = await getSandboxSessionWithAccess(
      validated.sandbox_session_id,
      user.id
    )

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }
    if (!hasControl(session, user.id, role)) {
      return { success: false, error: "You don't have control of this sandbox" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Sandbox is not running" }
    }

    // Connect and write file
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    await e2bWriteFile(sandbox, validated.path, input.content)

    // Update last activity
    await sql.query(
      `UPDATE sandbox_sessions SET last_activity_at = NOW() WHERE id = $1`,
      [validated.sandbox_session_id]
    )

    return { success: true }
  } catch (error) {
    console.error("Error writing file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to write file",
    }
  }
}

/**
 * Read file from sandbox
 */
export async function readSandboxFile(
  input: z.infer<typeof fileOperationSchema>
): Promise<{
  success: boolean
  content?: string
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = fileOperationSchema.parse(input)
    const { session, authorized } = await getSandboxSessionWithAccess(
      validated.sandbox_session_id,
      user.id
    )

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Sandbox is not running" }
    }

    // Connect and read file
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    const content = await e2bReadFile(sandbox, validated.path)

    return { success: true, content }
  } catch (error) {
    console.error("Error reading file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to read file",
    }
  }
}

/**
 * List files in sandbox directory
 */
export async function listSandboxFiles(
  input: z.infer<typeof fileOperationSchema>
): Promise<{
  success: boolean
  files?: Array<{
    name: string
    path: string
    isDir: boolean
    size?: number
  }>
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = fileOperationSchema.parse(input)
    const { session, authorized } = await getSandboxSessionWithAccess(
      validated.sandbox_session_id,
      user.id
    )

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Sandbox is not running" }
    }

    // Connect and list files
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    const files = await e2bListFiles(sandbox, validated.path)

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
// CONTROL HANDOFF
// =============================================================================

/**
 * Transfer control of the sandbox to another user
 */
export async function handoffSandboxControl(
  input: z.infer<typeof handoffControlSchema>
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = handoffControlSchema.parse(input)
    const { session, authorized, role } = await getSandboxSessionWithAccess(
      validated.sandbox_session_id,
      user.id
    )

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }

    // Only current controller or admin can transfer control
    if (session.current_controller_id !== user.id && role !== "admin") {
      return { success: false, error: "Only the current controller can transfer control" }
    }

    // Verify new controller is a participant
    const targetAccess = await verifyConsultationAccess(
      session.consultation_id,
      validated.new_controller_id
    )
    if (!targetAccess.authorized) {
      return { success: false, error: "Target user is not a participant in this consultation" }
    }

    // Update control
    await sql.query(
      `UPDATE sandbox_sessions 
       SET current_controller_id = $1, control_mode = $2, updated_at = NOW() 
       WHERE id = $3`,
      [validated.new_controller_id, validated.control_mode, validated.sandbox_session_id]
    )

    revalidatePath(`/consultation/room/${session.consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error transferring control:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to transfer control",
    }
  }
}

// =============================================================================
// SETUP HELPERS
// =============================================================================

/**
 * Install packages in the sandbox
 */
export async function installSandboxPackages(
  sessionId: string,
  packages: string[]
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const { session, authorized, role } = await getSandboxSessionWithAccess(sessionId, user.id)

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }
    if (!hasControl(session, user.id, role)) {
      return { success: false, error: "You don't have control of this sandbox" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Sandbox is not running" }
    }

    // Connect and install packages
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    const result = await installPackages(sandbox, packages)

    if (result.success) {
      // Update installed packages in DB
      const currentPackages = session.installed_packages ?? []
      const newPackages = [...new Set([...currentPackages, ...packages])]
      await sql.query(
        `UPDATE sandbox_sessions 
         SET installed_packages = $1, last_activity_at = NOW() 
         WHERE id = $2`,
        [newPackages, sessionId]
      )
    }

    return result
  } catch (error) {
    console.error("Error installing packages:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to install packages",
    }
  }
}

/**
 * Setup Next.js development environment
 */
export async function setupSandboxNextJs(
  sessionId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const { session, authorized, role } = await getSandboxSessionWithAccess(sessionId, user.id)

    if (!session) {
      return { success: false, error: "Sandbox session not found" }
    }
    if (!authorized) {
      return { success: false, error: "Not authorized to access this sandbox" }
    }
    if (!hasControl(session, user.id, role)) {
      return { success: false, error: "You don't have control of this sandbox" }
    }

    if (session.status !== "running") {
      return { success: false, error: "Sandbox is not running" }
    }

    // Connect and setup
    const sandbox = await connectToSandbox(session.e2b_sandbox_id)
    const result = await setupNextJsEnvironment(sandbox)

    if (result.success) {
      await sql.query(
        `UPDATE sandbox_sessions SET last_activity_at = NOW() WHERE id = $1`,
        [sessionId]
      )
    }

    return result
  } catch (error) {
    console.error("Error setting up Next.js:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to setup Next.js",
    }
  }
}

// =============================================================================
// ADMIN FUNCTIONS
// =============================================================================

/**
 * Get all active sandboxes (admin only)
 */
export async function getActiveSandboxes(): Promise<{
  success: boolean
  sandboxes?: SandboxSession[]
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const admin = await isUserAdmin()
    if (!admin) {
      return { success: false, error: "Admin access required" }
    }

    const result = await sql.query(
      `SELECT * FROM sandbox_sessions 
       WHERE status IN ('creating', 'running', 'paused')
       ORDER BY created_at DESC`
    )

    return {
      success: true,
      sandboxes: result as SandboxSession[],
    }
  } catch (error) {
    console.error("Error getting active sandboxes:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get active sandboxes",
    }
  }
}

/**
 * Cleanup expired sandboxes (admin only)
 */
export async function cleanupExpiredSandboxes(): Promise<{
  success: boolean
  cleaned: number
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, cleaned: 0, error: "Authentication required" }
    }

    const admin = await isUserAdmin()
    if (!admin) {
      return { success: false, cleaned: 0, error: "Admin access required" }
    }

    // Get all supposedly running sandboxes
    const dbSandboxes = await sql.query(
      `SELECT id, e2b_sandbox_id FROM sandbox_sessions 
       WHERE status = 'running' AND expires_at < NOW()`
    )

    if (!dbSandboxes || dbSandboxes.length === 0) {
      return { success: true, cleaned: 0 }
    }

    // Get actually running sandboxes from E2B
    const running = await listRunningSandboxes()
    const runningIds = new Set(running.map((s) => s.sandboxId))

    let cleaned = 0
    for (const dbSandbox of dbSandboxes) {
      // Kill if still running
      if (runningIds.has(dbSandbox.e2b_sandbox_id)) {
        try {
          await killSandboxById(dbSandbox.e2b_sandbox_id)
        } catch (e) {
          console.warn("Failed to kill expired sandbox:", e)
        }
      }

      // Update DB status
      await sql.query(
        `UPDATE sandbox_sessions SET status = 'expired' WHERE id = $1`,
        [dbSandbox.id]
      )
      cleaned++
    }

    return { success: true, cleaned }
  } catch (error) {
    console.error("Error cleaning up sandboxes:", error)
    return {
      success: false,
      cleaned: 0,
      error: error instanceof Error ? error.message : "Failed to cleanup sandboxes",
    }
  }
}
