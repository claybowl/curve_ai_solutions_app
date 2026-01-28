/**
 * E2B Sandbox Client
 * 
 * Server-side wrapper for E2B Code Interpreter SDK.
 * Used for collaborative coding sessions during consultations.
 * 
 * @see https://e2b.dev/docs
 */

// Note: Types are imported directly since the package is installed
import { Sandbox } from "@e2b/code-interpreter"

// Default configuration
const DEFAULT_TIMEOUT_HOURS = 24
const DEFAULT_TEMPLATE = "base"
const MAX_TIMEOUT_SECONDS = 86400 // 24 hours (E2B Pro limit)

// Re-export Sandbox type for consumers
export type E2BSandbox = Sandbox

/**
 * Validates E2B API key is available
 */
function validateApiKey(): string {
  const apiKey = process.env.E2B_API_KEY
  if (!apiKey) {
    throw new Error("E2B_API_KEY environment variable is not set")
  }
  return apiKey
}

/**
 * Creates a new E2B sandbox instance
 * 
 * @param options - Sandbox creation options
 * @returns Sandbox instance and ID
 */
export async function createSandbox(options: {
  template?: string
  timeoutHours?: number
  environmentConfig?: Record<string, string>
}): Promise<{
  sandbox: E2BSandbox
  sandboxId: string
  expiresAt: Date
}> {
  validateApiKey()
  
  const timeoutHours = options.timeoutHours ?? DEFAULT_TIMEOUT_HOURS
  const timeoutMs = Math.min(timeoutHours * 3600 * 1000, MAX_TIMEOUT_SECONDS * 1000)
  const template = options.template ?? DEFAULT_TEMPLATE
  
  const sandbox = await Sandbox.create(template, {
    timeoutMs,
    envs: options.environmentConfig,
  })
  
  const expiresAt = new Date(Date.now() + timeoutMs)
  
  return {
    sandbox,
    sandboxId: sandbox.sandboxId,
    expiresAt,
  }
}

/**
 * Connects to an existing E2B sandbox
 * 
 * @param sandboxId - The E2B sandbox ID to connect to
 * @returns Connected sandbox instance
 */
export async function connectToSandbox(sandboxId: string): Promise<E2BSandbox> {
  validateApiKey()
  
  const sandbox = await Sandbox.connect(sandboxId)
  return sandbox
}

/**
 * Runs code in a sandbox and returns the result
 * 
 * @param sandbox - The sandbox instance
 * @param code - Code to execute
 * @param options - Execution options
 * @returns Execution result
 */
export async function runCode(
  sandbox: E2BSandbox,
  code: string,
  options?: {
    language?: "python" | "javascript" | "typescript"
    timeoutSeconds?: number
    envs?: Record<string, string>
    onStdout?: (output: string) => void
    onStderr?: (output: string) => void
  }
): Promise<{
  success: boolean
  stdout: string
  stderr: string
  result?: string
  error?: string
}> {
  try {
    const execution = await sandbox.runCode(code, {
      language: options?.language ?? "python",
      timeoutMs: (options?.timeoutSeconds ?? 30) * 1000,
      envs: options?.envs,
      onStdout: options?.onStdout 
        ? (msg: { line: string }) => options.onStdout!(msg.line) 
        : undefined,
      onStderr: options?.onStderr 
        ? (msg: { line: string }) => options.onStderr!(msg.line) 
        : undefined,
    })
    
    return {
      success: !execution.error,
      stdout: execution.logs.stdout.join("\n"),
      stderr: execution.logs.stderr.join("\n"),
      result: execution.text,
      error: execution.error?.name,
    }
  } catch (error) {
    return {
      success: false,
      stdout: "",
      stderr: "",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Runs a shell command in the sandbox
 * 
 * @param sandbox - The sandbox instance
 * @param command - Shell command to execute
 * @param options - Execution options
 * @returns Command result
 */
export async function runCommand(
  sandbox: E2BSandbox,
  command: string,
  options?: {
    cwd?: string
    timeoutSeconds?: number
    envs?: Record<string, string>
    onStdout?: (output: string) => void
    onStderr?: (output: string) => void
  }
): Promise<{
  success: boolean
  exitCode: number
  stdout: string
  stderr: string
}> {
  try {
    const result = await sandbox.commands.run(command, {
      cwd: options?.cwd,
      timeoutMs: (options?.timeoutSeconds ?? 60) * 1000,
      envs: options?.envs,
      onStdout: options?.onStdout 
        ? (data: string) => options.onStdout!(data) 
        : undefined,
      onStderr: options?.onStderr 
        ? (data: string) => options.onStderr!(data) 
        : undefined,
    })
    
    return {
      success: result.exitCode === 0,
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
    }
  } catch (error) {
    return {
      success: false,
      exitCode: -1,
      stdout: "",
      stderr: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Writes a file to the sandbox filesystem
 * 
 * @param sandbox - The sandbox instance
 * @param path - File path in sandbox
 * @param content - File content
 */
export async function writeFile(
  sandbox: E2BSandbox,
  path: string,
  content: string
): Promise<void> {
  await sandbox.files.write(path, content)
}

/**
 * Reads a file from the sandbox filesystem
 * 
 * @param sandbox - The sandbox instance
 * @param path - File path in sandbox
 * @returns File content as string
 */
export async function readFile(
  sandbox: E2BSandbox,
  path: string
): Promise<string> {
  return await sandbox.files.read(path)
}

/**
 * Lists files in a directory in the sandbox
 * 
 * @param sandbox - The sandbox instance
 * @param path - Directory path
 * @returns List of file entries
 */
export async function listFiles(
  sandbox: E2BSandbox,
  path: string
): Promise<Array<{
  name: string
  path: string
  isDir: boolean
  size?: number
}>> {
  const entries = await sandbox.files.list(path)
  return entries.map((entry) => ({
    name: entry.name,
    path: entry.path,
    isDir: entry.type === "dir",
    size: entry.type === "file" ? entry.size : undefined,
  }))
}

/**
 * Extends the sandbox timeout
 * 
 * @param sandbox - The sandbox instance
 * @param additionalHours - Additional hours to add
 */
export async function extendTimeout(
  sandbox: E2BSandbox,
  additionalHours: number
): Promise<Date> {
  const additionalMs = Math.min(additionalHours * 3600 * 1000, MAX_TIMEOUT_SECONDS * 1000)
  await Sandbox.setTimeout(sandbox.sandboxId, additionalMs)
  return new Date(Date.now() + additionalMs)
}

/**
 * Gets sandbox information
 * 
 * @param sandboxId - The sandbox ID
 * @returns Sandbox info
 */
export async function getSandboxInfo(sandboxId: string): Promise<{
  exists: boolean
  running: boolean
  startedAt?: Date
  endAt?: Date
} | null> {
  validateApiKey()
  
  try {
    const info = await Sandbox.getInfo(sandboxId)
    
    return {
      exists: true,
      running: info.state === "running",
      startedAt: info.startedAt,
      endAt: info.endAt,
    }
  } catch (error) {
    // Sandbox not found
    return { exists: false, running: false }
  }
}

/**
 * Kills a sandbox instance
 * 
 * @param sandbox - The sandbox instance to kill
 */
export async function killSandbox(sandbox: E2BSandbox): Promise<void> {
  await sandbox.kill()
}

/**
 * Kills a sandbox by ID (static method)
 * 
 * @param sandboxId - The sandbox ID to kill
 */
export async function killSandboxById(sandboxId: string): Promise<void> {
  validateApiKey()
  await Sandbox.kill(sandboxId)
}

/**
 * Lists all running sandboxes
 * 
 * @returns List of running sandbox IDs and info
 */
export async function listRunningSandboxes(): Promise<Array<{
  sandboxId: string
  startedAt: Date
  endAt: Date
}>> {
  validateApiKey()
  
  const paginator = Sandbox.list()
  const sandboxes: Array<{
    sandboxId: string
    startedAt: Date
    endAt: Date
  }> = []
  
  // Iterate through all pages
  while (paginator.hasNext) {
    const items = await paginator.nextItems()
    for (const s of items) {
      sandboxes.push({
        sandboxId: s.sandboxId,
        startedAt: s.startedAt,
        endAt: s.endAt,
      })
    }
  }
  
  return sandboxes
}

/**
 * Installs npm packages in the sandbox
 * 
 * @param sandbox - The sandbox instance
 * @param packages - Packages to install
 */
export async function installPackages(
  sandbox: E2BSandbox,
  packages: string[]
): Promise<{
  success: boolean
  error?: string
}> {
  const command = `npm install ${packages.join(" ")}`
  const result = await runCommand(sandbox, command, {
    timeoutSeconds: 120,
  })
  
  return {
    success: result.success,
    error: result.success ? undefined : result.stderr,
  }
}

/**
 * Sets up a Next.js/React development environment in the sandbox
 * 
 * @param sandbox - The sandbox instance
 */
export async function setupNextJsEnvironment(
  sandbox: E2BSandbox
): Promise<{
  success: boolean
  error?: string
}> {
  // Install common packages
  const packages = [
    "typescript",
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "next",
    "react",
    "react-dom",
    "tailwindcss",
    "postcss",
    "autoprefixer",
  ]
  
  return await installPackages(sandbox, packages)
}
