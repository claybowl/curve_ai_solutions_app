"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { PromotionButton } from "@/components/promotion-button"
import { useAuth } from "@/providers/stack-auth-provider"
import { supabase } from "@/lib/supabase"

// Helper hook for navbar-specific auth data
function useNavbarAuth() {
  const { user, loading } = useAuth()
  
  // Check admin permission from Stack Auth user
  const isAdmin = user?.permissions?.includes('admin') || false
  
  return {
    isLoggedIn: !!user,
    userRole: isAdmin ? 'admin' : (user ? 'client' : null),
    user: user,
    loading
  }
}

// Update the Navbar component to include the UserProfileDropdown
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, userRole, user, loading } = useNavbarAuth()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Assessments", href: "/assessments" },
    { name: "About", href: "/about" },
  ]

  // Updated logout handler for Supabase
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <header className="bg-gray-800 shadow-sm sticky top-0 z-50 border-gray-700">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-white">Curve AI Solutions</span>
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
                    : "text-gray-200 hover:bg-gray-700",
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-4 flex items-center gap-2">
              <PromotionButton variant="desktop" />
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <PromotionButton variant="mobile" />
            <button
              type="button"
              className="p-2 rounded-md text-gray-200 hover:bg-gray-700"
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
                    : "text-gray-200 hover:bg-gray-700",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-700">
              <PromotionButton variant="desktop" />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
