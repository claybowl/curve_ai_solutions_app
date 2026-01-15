import type React from "react"
import "@/app/globals.css"
import { Outfit, Fira_Code } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNavWrapper } from "@/components/main-nav-wrapper"
import { ChatButton } from "@/components/chat-button"
import { Footer } from "@/components/footer"
import { StackAuthProvider } from "@/providers/stack-auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { SynapseBackground } from "@/components/donjon/synapse-background"

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["200", "400", "600", "700"]
})

const firaCode = Fira_Code({ 
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["300", "400"]
})

export const metadata = {
  title: "Donjon Intelligence Systems",
  description: "Engineering resilient intelligence. We build systems that understand context, learn from experience, and adapt to evolving challenges in real-time.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${firaCode.variable} font-sans bg-donjon-dark text-slate-50 antialiased overflow-x-hidden`} suppressHydrationWarning>
        <StackAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <SynapseBackground />
            <div className="relative z-10 flex min-h-screen flex-col">
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
