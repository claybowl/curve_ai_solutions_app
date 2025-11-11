"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function AlfieDemoPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading to false after iframe loads or timeout
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-full flex-1 flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-donjon-indigo" />
            <p className="text-gray-300">Loading Alfie Agent...</p>
            <p className="text-sm text-gray-400">Connecting to knowledge graph memory</p>
          </div>
        </div>
      )}
      <iframe
        src="https://alfie-agent.vercel.app/"
        className="w-full flex-1 border-0"
        title="Alfie AI Agent Demo - Knowledge Graph Memory Interface"
        onLoad={() => setIsLoading(false)}
        allow="clipboard-read; clipboard-write; microphone; camera"
        style={{
          minHeight: "600px",
        }}
      />
    </div>
  )
}

