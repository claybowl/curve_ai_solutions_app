import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display as PlayfairDisplay, EB_Garamond as EBGaramond } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import ChatWidget from "@/components/chat-widget"
import WelcomeMessage from "@/components/welcome-message"

const playfair = PlayfairDisplay({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const garamond = EBGaramond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Clean Machine Mobile Detailing | Premium Automotive Care",
  description:
    "Exceptional automotive detailing services delivered with meticulous attention to detail and white-glove service.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${garamond.variable} font-garamond bg-ivory text-navy-dark`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WelcomeMessage />
            <ChatWidget />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
