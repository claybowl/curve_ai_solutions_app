"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"

// Replace the existing useAuth function with this updated version
function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check if there's an auth token in localStorage
    const token = localStorage.getItem("admin-token")
    if (token) {
      const [userId, role] = token.split(":")
      setIsLoggedIn(true)
      setUserRole(role)
    }
  }, [])

  return { isLoggedIn, userRole }
}

// Update the Navbar component to include the UserProfileDropdown
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, userRole } = useAuth()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Assessments", href: "/assessments" },
    { name: "About", href: "/about" },
    { name: "Consultation", href: "/consultation" },
  ]

  // Add a logout handler
  const handleLogout = () => {
    localStorage.removeItem("admin-token")

    // Call the logout API to clear cookies
    fetch("/api/logout", { method: "POST" })
      .catch((err) => console.error("Error during logout:", err))
      .finally(() => {
        router.push("/auth/signin")
      })
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-[#1A365D] dark:text-white">Curve AI Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[#0076FF]/10 text-[#0076FF]"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-4 flex items-center gap-2">
              <ThemeToggle />
              {isLoggedIn ? (
                <UserProfileDropdown />
              ) : (
                <>
                  <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
                    <Link href="/assessments/new">Get Started</Link>
                  </Button>
                  <Link
                    href="/auth/signin"
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn && <UserProfileDropdown />}
            <button
              type="button"
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "bg-[#0076FF]/10 text-[#0076FF]"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isLoggedIn && (
              <>
                <div className="pt-2">
                  <Button asChild className="w-full bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
                    <Link href="/assessments/new" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
                <div className="pt-2">
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
