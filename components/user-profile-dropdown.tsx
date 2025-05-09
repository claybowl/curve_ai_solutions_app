"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, LogOut, CreditCard, HelpCircle } from "lucide-react"

export function UserProfileDropdown() {
  const router = useRouter()
  const [user, setUser] = useState<{
    email: string
    firstName?: string
    lastName?: string
    role?: string
  } | null>(null)

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("admin-token")

    if (token) {
      // In a real app, we would fetch user data from an API
      // For now, we'll use a mock user or extract from token
      const [userId, role] = token.split(":")

      // Try to get user from sessionStorage if available
      const sessionUser = sessionStorage.getItem("user-data")
      if (sessionUser) {
        try {
          setUser(JSON.parse(sessionUser))
          return
        } catch (e) {
          console.error("Failed to parse user data from session", e)
        }
      }

      // Fallback to mock data
      setUser({
        email: "demo@curveai.com",
        firstName: "Demo",
        lastName: "User",
        role: role || "client",
      })
    }
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
      })
  }

  // If no user is found, don't render anything
  if (!user) return null

  // Get user initials for avatar
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.email.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-[#0076FF]/20 hover:border-[#0076FF]/50 transition-colors">
            <AvatarFallback className="bg-[#0076FF]/10 text-[#0076FF] dark:bg-[#0076FF]/20 dark:text-[#3b82f6]">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none dark:text-white">
              {user.firstName ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user.email}</p>
            {user.role && (
              <p className="text-xs text-[#0076FF] dark:text-[#3b82f6] font-medium mt-1">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="cursor-pointer flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing" className="cursor-pointer flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support" className="cursor-pointer flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Support</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
