import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Curve AI Chat | Curve AI Solutions",
  description: "Interact with our AI assistant to get answers to your questions about AI implementation and solutions.",
}

export default function CurveAIChatPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Curve AI Chat</h1>
        <p className="text-center text-muted-foreground mb-8">
          Ask our AI assistant any questions about AI implementation, solutions, or how Curve AI can help your business.
        </p>

        <div className="w-full aspect-[16/9] md:aspect-[16/10] lg:aspect-auto lg:h-[85vh] overflow-hidden">
          <iframe
            src="https://curveai-chat.vercel.app/"
            className="w-full h-full"
            allow="microphone; camera; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Having trouble with the chat?{" "}
            <a
              href="https://curveai-chat.vercel.app/"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in a new window
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
