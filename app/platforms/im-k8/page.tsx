import type { Metadata } from "next"
import { FloatingOpenButton } from "@/components/floating-open-button"

export const metadata: Metadata = {
  title: "I'm K8 - AI Communication Platform | Donjon Systems",
  description: "Intelligent AI-powered communication and collaboration platform.",
}

export default function ImK8Page() {
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      <FloatingOpenButton href="https://im-k8.lovable.app/" variant="k8" />
      <iframe
        src="https://im-k8.lovable.app/"
        className="w-full h-full"
        title="I'm K8 Platform"
        allow="accelerometer; camera; geolocation; microphone; clipboard-read; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}
