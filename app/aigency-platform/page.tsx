import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AiGency Platform | Curve AI Solutions",
  description:
    "Experience the AiGency Platform - an advanced AI agent workbench by Curve AI Solutions.",
}

export default function AiGencyPlatformPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full py-6 flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center px-4">AiGency Platform</h1>
        <p className="text-center mb-6 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Experience our advanced AI agent workbench designed to create, manage, and deploy intelligent AI agents.
        </p>

        <div className="flex-1 w-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
          <div className="relative w-full h-[calc(100vh-220px)] min-h-[600px]">
            <iframe
              src="https://v0-curve-ai-agent-workbench.vercel.app/"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="AiGency Platform"
            ></iframe>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Having trouble with the embedded view?
              <Link
                href="https://v0-curve-ai-agent-workbench.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Open in a new window
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}