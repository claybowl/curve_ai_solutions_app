import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AiGency Knowledge Studio | Curve AI Solutions",
  description: "Experience the AiGency Knowledge Studio - your comprehensive AI knowledge and learning platform.",
}

export default function CurveAIChatPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full flex-1 flex flex-col">
        <div className="py-6 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h1 className="text-3xl font-bold mb-2 text-center">AiGency Knowledge Studio</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your comprehensive AI knowledge and learning platform for exploring AI capabilities and solutions.
          </p>
        </div>
        
        <div className="flex-1 w-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
          <div className="relative w-full h-[calc(100vh-154px)]">
            <iframe
              src="https://aigency-hq.vercel.app/"
              className="absolute inset-0 w-full h-full border-0"
              allow="microphone; camera; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="AiGency Knowledge Studio"
            ></iframe>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Having trouble with the embedded view?
              <Link
                href="https://aigency-hq.vercel.app/"
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
