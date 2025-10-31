"use client"

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
import { useAuth } from "@/providers/stack-auth-provider"

export function UserProfileDropdown() {
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
      router.push("/")
    }
  }

  // If no user is found or still loading, don't render anything
  if (loading || !user) return null

  // Get user initials for avatar
  const getInitials = () => {
    const displayName = user.displayName || user.email || ''
    const nameParts = displayName.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U'
  }
  
  // Get user display name
  const displayName = user.displayName || user.email || 'User'

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
              {displayName}
            </p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user.email}</p>
            {user.permissions?.includes('admin') && (
              <p className="text-xs text-[#0076FF] dark:text-[#3b82f6] font-medium mt-1">
                Administrator
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
          <Link href={user.permissions?.includes('admin') ? "/admin" : "/dashboard"} className="cursor-pointer flex items-center">
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
