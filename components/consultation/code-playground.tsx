"use client"

import { useState, useCallback, useRef } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { Play, Share2, Trash2, Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// =============================================================================
// CONSTANTS
// =============================================================================

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
] as const

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// JavaScript Playground
console.log('Hello, World!');

// Try some array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);
`,
  typescript: `// TypeScript Playground
interface User {
  name: string;
  age: number;
}

const user: User = { name: 'Alice', age: 30 };
console.log(\`Hello, \${user.name}!\`);
`,
  python: `# Python Playground
print("Hello, World!")

# Try some list operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(f"Doubled: {doubled}")
`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>HTML Preview</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Edit this HTML and see the preview.</p>
</body>
</html>
`,
  css: `/* CSS Playground */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b, #0f172a);
}

.card {
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
`,
  json: `{
  "name": "Code Playground",
  "version": "1.0.0",
  "features": ["syntax highlighting", "code execution", "sharing"],
  "languages": ["javascript", "typescript", "python", "html", "css", "json", "markdown"]
}
`,
  markdown: `# Code Playground

A simple code editor for quick experiments.

## Features

- **Syntax Highlighting** - Monaco Editor support
- **Multiple Languages** - JS, TS, Python, HTML, CSS, JSON, MD
- **Code Execution** - Run JavaScript locally
- **Share to Sandbox** - Send to E2B for advanced execution

## Usage

1. Select a language
2. Write your code
3. Click Run or Share
`,
}

// =============================================================================
// TYPES
// =============================================================================

interface CodePlaygroundProps {
  initialCode?: string
  initialLanguage?: string
  onShareToSandbox?: (code: string, language: string) => void
  onRunCode?: (code: string, language: string) => Promise<string>
  readOnly?: boolean
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CodePlayground({
  initialCode,
  initialLanguage = "javascript",
  onShareToSandbox,
  onRunCode,
  readOnly = false,
  className,
}: CodePlaygroundProps) {
  const [language, setLanguage] = useState(initialLanguage)
  const [code, setCode] = useState(initialCode ?? DEFAULT_CODE[initialLanguage] ?? "")
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const editorRef = useRef<any>(null)

  // Handle editor mount
  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  // Handle language change
  const handleLanguageChange = useCallback((newLang: string) => {
    setLanguage(newLang)
    // Set default code for the new language if current code is default
    if (!initialCode) {
      setCode(DEFAULT_CODE[newLang] ?? "")
    }
    setOutput([])
    setError(null)
  }, [initialCode])

  // Handle code run
  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setError(null)
    setOutput([])

    try {
      if (onRunCode) {
        // Use provided run handler (e.g., E2B sandbox)
        const result = await onRunCode(code, language)
        setOutput(result.split("\n"))
      } else if (language === "javascript" || language === "typescript") {
        // Simple eval for JS/TS (sandboxed via Function constructor)
        const logs: string[] = []
        const mockConsole = {
          log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
          error: (...args: unknown[]) => logs.push(`[ERROR] ${args.map(String).join(" ")}`),
          warn: (...args: unknown[]) => logs.push(`[WARN] ${args.map(String).join(" ")}`),
          info: (...args: unknown[]) => logs.push(`[INFO] ${args.map(String).join(" ")}`),
          table: (data: unknown) => logs.push(JSON.stringify(data, null, 2)),
        }

        try {
          // Create sandboxed function
          const fn = new Function("console", code)
          fn(mockConsole)
          setOutput(logs.length > 0 ? logs : ["(no output)"])
        } catch (e) {
          setError(e instanceof Error ? e.message : "Execution error")
        }
      } else if (language === "json") {
        // Validate JSON
        try {
          const parsed = JSON.parse(code)
          setOutput([
            "Valid JSON!",
            "",
            "Parsed structure:",
            JSON.stringify(parsed, null, 2),
          ])
        } catch (e) {
          setError(e instanceof Error ? e.message : "Invalid JSON")
        }
      } else {
        setOutput([
          `Direct execution not supported for ${language}.`,
          "",
          'Use "Share to Sandbox" to run this code in a full environment.',
        ])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setIsRunning(false)
    }
  }, [code, language, onRunCode])

  // Handle share to sandbox
  const handleShare = useCallback(() => {
    onShareToSandbox?.(code, language)
  }, [code, language, onShareToSandbox])

  // Handle clear
  const handleClear = useCallback(() => {
    setCode("")
    setOutput([])
    setError(null)
  }, [])

  // Handle copy code
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Failed to copy:", e)
    }
  }, [code])

  return (
    <div className={cn("glass-panel flex flex-col h-full overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 flex-shrink-0">
        {/* Language Selector */}
        <Select value={language} onValueChange={handleLanguageChange} disabled={readOnly}>
          <SelectTrigger className="w-[140px] h-8 bg-slate-800/50 border-white/10 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/10">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem
                key={lang.value}
                value={lang.value}
                className="text-slate-200 focus:bg-slate-700 focus:text-slate-100"
              >
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-400 hover:text-slate-200"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || readOnly}
            className="text-slate-300 hover:text-sky-400"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            Run
          </Button>
          {onShareToSandbox && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={readOnly}
              className="text-slate-300 hover:text-emerald-400"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={readOnly}
            className="text-slate-300 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Monaco Editor */}
        <div className="flex-[6] min-h-0 border-b border-white/10">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', 'Consolas', monospace",
              lineNumbers: "on",
              readOnly,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              padding: { top: 12 },
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </div>

        {/* Output Section */}
        <div className="flex-[4] min-h-0 flex flex-col bg-slate-900/50">
          <div className="px-3 py-2 text-xs text-slate-400 border-b border-white/10 flex-shrink-0">
            Output
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 font-mono text-sm">
              {error && (
                <div className="text-red-400 mb-2">
                  <span className="text-red-500">Error:</span> {error}
                </div>
              )}
              {output.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre-wrap",
                    line.startsWith("[ERROR]")
                      ? "text-red-400"
                      : line.startsWith("[WARN]")
                        ? "text-amber-400"
                        : line.startsWith("[INFO]")
                          ? "text-sky-400"
                          : "text-emerald-400"
                  )}
                >
                  {line.startsWith("[") ? line : `> ${line}`}
                </div>
              ))}
              {!error && output.length === 0 && (
                <div className="text-slate-500">
                  Click &quot;Run&quot; to execute code
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
