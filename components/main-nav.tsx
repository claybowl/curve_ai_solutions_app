"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainNav() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in by looking for auth token
    const token = localStorage.getItem("admin-token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("admin-token")
    sessionStorage.removeItem("user-data")

    // Call the logout API to clear cookies
    fetch("/api/logout", { method: "POST" })
      .catch((err) => console.error("Error during logout:", err))
      .finally(() => {
        // Redirect to home page
        router.push("/")
        // Force reload to ensure all state is cleared
        window.location.href = "/"
      })
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Assessments", href: "/assessments" },
    { name: "Prompts", href: "/solutions/prompts" },
    { name: "AiPex Platform", href: "/aipex-platform-prototype" },
    { name: "AI Models", href: "/curve-ai-chat" },
    { name: "Fundraising", href: "/fundraising" },
    { name: "About", href: "/about" },
    { name: "Consultation", href: "/consultation" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-[#1A365D] dark:text-white">Curve AI</span>
          <span className="ml-2 text-[#0076FF] dark:text-[#3b82f6]">Solutions</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "text-sm font-medium transition-colors flex items-center",
                pathname === item.href
                  ? "text-[#0076FF] dark:text-[#3b82f6]"
                  : "text-gray-700 hover:text-[#0076FF] dark:text-gray-300 dark:hover:text-[#3b82f6]",
              )}
            >
              {item.name}
              {item.external && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3 ml-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>
          ))}
        </nav>
        <div className="ml-auto md:ml-6 flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-4">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button
                  className="bg-[#0076FF] hover:bg-[#0076FF]/90 dark:bg-[#3b82f6] dark:hover:bg-[#3b82f6]/90"
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 px-4 sm:px-6 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center",
                  pathname === item.href
                    ? "text-[#0076FF] dark:text-[#3b82f6]"
                    : "text-gray-700 hover:text-[#0076FF] dark:text-gray-300 dark:hover:text-[#3b82f6]",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
                {item.external && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t dark:border-gray-800 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    className="bg-[#0076FF] hover:bg-[#0076FF]/90 dark:bg-[#3b82f6] dark:hover:bg-[#3b82f6]/90"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
