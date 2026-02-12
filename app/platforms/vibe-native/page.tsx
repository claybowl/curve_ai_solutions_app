import type { Metadata } from "next"
import { FloatingOpenButton } from "@/components/floating-open-button"

export const metadata: Metadata = {
  title: "Vibe Native - AI-Powered No-Code Platform | Donjon Systems",
  description: "Build beautiful, functional applications without code using Vibe Native's AI-powered platform.",
}

export default function VibeNativePage() {
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      <FloatingOpenButton href="https://vibenative.studio/" variant="vibe" />
      <iframe
        src="https://vibenative.studio/"
        className="w-full h-full"
        title="Vibe Native Studio"
        allow="accelerometer; camera; geolocation; microphone; clipboard-read; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}
