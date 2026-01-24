import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "I'm K8 - AI Communication Platform | Donjon Systems",
  description: "Intelligent AI-powered communication and collaboration platform.",
}

export default function ImK8Page() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <section className="pt-4 pb-4">
        <div className="px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-50">I'm K8</h1>
          <Button
            className="bg-sky-500 hover:bg-sky-400 text-black font-bold transition-all duration-300"
            asChild
          >
            <Link href="https://im-k8.lovable.app/" target="_blank" rel="noopener noreferrer">
              Open in New Tab <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative w-full" style={{ height: 'calc(100vh - 80px)' }}>
          <iframe
            src="https://im-k8.lovable.app/"
            className="w-full h-full border-t border-b border-white/10"
            title="I'm K8 Platform"
            allow="accelerometer; camera; geolocation; microphone; clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </section>
    </div>
  )
}
