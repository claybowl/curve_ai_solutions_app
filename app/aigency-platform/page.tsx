import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AiGency Workbench | Curve AI Solutions",
  description:
    "Experience the AiGency Workbench - an advanced AI agent workbench by Curve AI Solutions.",
}

export default function AiGencyPlatformPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full py-6 flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center px-4">AiGency Workbench</h1>
        <p className="text-center mb-6 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Experience our advanced AI agent workbench designed to create, manage, and deploy intelligent AI agents.
        </p>

        <div className="flex-1 w-full bg-white dark:bg-gray-900 overflow-hidden">
          <div className="relative w-full h-[calc(100vh-180px)] min-h-[600px]">
            <iframe
              src="https://v0-curve-ai-agent-workbench.vercel.app/"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="AiGency Workbench"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  )
}