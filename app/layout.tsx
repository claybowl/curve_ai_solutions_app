import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNavWrapper } from "@/components/main-nav-wrapper"
import { ChatButton } from "@/components/chat-button"
import { Footer } from "@/components/footer"
import { StackAuthProvider } from "@/providers/stack-auth-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Donjon Intelligence Systems",
  description: "Fortifying the future of intelligence. Building fortified AI systems that think, adapt, and protect like living digital fortresses.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <StackAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <div className="flex min-h-screen flex-col">
              <MainNavWrapper />
              <main className="flex-1">{children}</main>
              <Footer />
              <ChatButton />
            </div>
            <Toaster />
          </ThemeProvider>
        </StackAuthProvider>
      </body>
    </html>
  )
}
