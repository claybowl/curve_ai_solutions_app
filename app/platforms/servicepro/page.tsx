import type { Metadata } from "next"
import { FloatingOpenButton } from "@/components/floating-open-button"

export const metadata: Metadata = {
  title: "ServicePro - Service Business Management Platform | Donjon Systems",
  description: "Comprehensive platform for managing service-based businesses with AI-powered automation.",
}

export default function ServiceProPage() {
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      <FloatingOpenButton href="https://cleanmachinetulsa.com/dashboard" variant="servicepro" />
      <iframe
        src="https://cleanmachinetulsa.com/dashboard"
        className="w-full h-full"
        title="ServicePro Dashboard"
        allow="accelerometer; camera; geolocation; microphone; clipboard-read; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}
