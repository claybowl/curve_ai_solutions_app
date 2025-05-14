import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { ChatButton } from "@/components/chat-button"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Curve AI Solutions",
  description: "The Anti-Gravity for business. Breakaway with no resistance.",
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
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <div className="flex min-h-screen flex-col">
              <MainNav />
              <main className="flex-1">{children}</main>
              <Footer />
              <ChatButton />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
