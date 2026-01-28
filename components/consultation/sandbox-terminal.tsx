"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Terminal as XTerminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { WebLinksAddon } from "@xterm/addon-web-links"
import "@xterm/xterm/css/xterm.css"

interface SandboxTerminalProps {
  onCommand: (command: string) => Promise<{
    exitCode: number
    stdout: string
    stderr: string
  }>
  disabled?: boolean
  initialMessage?: string
  className?: string
}

export function SandboxTerminal({
  onCommand,
  disabled = false,
  initialMessage,
  className,
}: SandboxTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [currentLine, setCurrentLine] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)

  // Initialize terminal
  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return

    const term = new XTerminal({
      theme: {
        background: "#0f172a", // slate-900
        foreground: "#e2e8f0", // slate-200
        cursor: "#38bdf8", // sky-400
        cursorAccent: "#0f172a",
        selectionBackground: "#38bdf840",
        black: "#1e293b",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        blue: "#3b82f6",
        magenta: "#a855f7",
        cyan: "#06b6d4",
        white: "#f1f5f9",
        brightBlack: "#475569",
        brightRed: "#f87171",
        brightGreen: "#4ade80",
        brightYellow: "#facc15",
        brightBlue: "#60a5fa",
        brightMagenta: "#c084fc",
        brightCyan: "#22d3ee",
        brightWhite: "#ffffff",
      },
      fontFamily: '"Fira Code", "Cascadia Code", Menlo, monospace',
      fontSize: 13,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: "block",
      scrollback: 1000,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // Initial message
    if (initialMessage) {
      term.writeln(initialMessage)
    }
    term.writeln("\x1b[90m# E2B Sandbox Terminal\x1b[0m")
    term.writeln("\x1b[90m# Type commands to execute in the sandbox\x1b[0m")
    term.write("\x1b[38;5;39m❯\x1b[0m ")

    // Handle resize
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      term.dispose()
      xtermRef.current = null
    }
  }, [initialMessage])

  // Handle keyboard input
  const handleData = useCallback(
    async (data: string) => {
      const term = xtermRef.current
      if (!term || disabled || isExecuting) return

      // Handle special keys
      if (data === "\r") {
        // Enter
        term.writeln("")
        
        if (currentLine.trim()) {
          historyRef.current.push(currentLine)
          historyIndexRef.current = historyRef.current.length
          
          setIsExecuting(true)
          
          try {
            const result = await onCommand(currentLine)
            
            if (result.stdout) {
              result.stdout.split("\n").forEach((line) => {
                term.writeln(line)
              })
            }
            if (result.stderr) {
              result.stderr.split("\n").forEach((line) => {
                term.writeln(`\x1b[31m${line}\x1b[0m`)
              })
            }
            if (result.exitCode !== 0) {
              term.writeln(`\x1b[31mExit code: ${result.exitCode}\x1b[0m`)
            }
          } catch (error) {
            term.writeln(
              `\x1b[31mError: ${error instanceof Error ? error.message : "Command failed"}\x1b[0m`
            )
          }
          
          setIsExecuting(false)
        }
        
        setCurrentLine("")
        term.write("\x1b[38;5;39m❯\x1b[0m ")
      } else if (data === "\x7f") {
        // Backspace
        if (currentLine.length > 0) {
          setCurrentLine((prev) => prev.slice(0, -1))
          term.write("\b \b")
        }
      } else if (data === "\x1b[A") {
        // Up arrow - history
        if (historyRef.current.length > 0 && historyIndexRef.current > 0) {
          historyIndexRef.current--
          const historyItem = historyRef.current[historyIndexRef.current]
          
          // Clear current line
          term.write("\x1b[2K\r")
          term.write("\x1b[38;5;39m❯\x1b[0m ")
          term.write(historyItem)
          setCurrentLine(historyItem)
        }
      } else if (data === "\x1b[B") {
        // Down arrow - history
        if (historyIndexRef.current < historyRef.current.length - 1) {
          historyIndexRef.current++
          const historyItem = historyRef.current[historyIndexRef.current]
          
          term.write("\x1b[2K\r")
          term.write("\x1b[38;5;39m❯\x1b[0m ")
          term.write(historyItem)
          setCurrentLine(historyItem)
        } else if (historyIndexRef.current === historyRef.current.length - 1) {
          historyIndexRef.current++
          term.write("\x1b[2K\r")
          term.write("\x1b[38;5;39m❯\x1b[0m ")
          setCurrentLine("")
        }
      } else if (data === "\x03") {
        // Ctrl+C
        term.writeln("^C")
        setCurrentLine("")
        term.write("\x1b[38;5;39m❯\x1b[0m ")
      } else if (data >= " " && data <= "~") {
        // Printable characters
        setCurrentLine((prev) => prev + data)
        term.write(data)
      }
    },
    [currentLine, disabled, isExecuting, onCommand]
  )

  // Attach data handler
  useEffect(() => {
    const term = xtermRef.current
    if (!term) return

    const disposable = term.onData(handleData)
    return () => disposable.dispose()
  }, [handleData])

  // Write output to terminal (for external use)
  const writeOutput = useCallback((output: string, isError = false) => {
    const term = xtermRef.current
    if (!term) return

    const color = isError ? "\x1b[31m" : "\x1b[0m"
    output.split("\n").forEach((line) => {
      term.writeln(`${color}${line}\x1b[0m`)
    })
  }, [])

  // Clear terminal
  const clear = useCallback(() => {
    const term = xtermRef.current
    if (!term) return

    term.clear()
    term.write("\x1b[38;5;39m❯\x1b[0m ")
    setCurrentLine("")
  }, [])

  return (
    <div
      ref={terminalRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0f172a",
        borderRadius: "0.5rem",
        padding: "0.5rem",
      }}
    />
  )
}

// Export utilities
export type SandboxTerminalRef = {
  writeOutput: (output: string, isError?: boolean) => void
  clear: () => void
}
