"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, Calendar, Settings, Wrench, UserCog, Lock, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { isAdminUser, logoutUser } from "@/lib/auth-utils"

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    href: "/admin/users/management",
    icon: UserCog,
  },
  {
    name: "Permissions",
    href: "/admin/permissions",
    icon: Lock,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Assessments",
    href: "/admin/assessments",
    icon: FileText,
  },
  {
    name: "Consultations",
    href: "/admin/consultations",
    icon: Calendar,
  },
  {
    name: "AI Tools",
    href: "/admin/tools",
    icon: Wrench,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [adminChecked, setAdminChecked] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (!isAdminUser()) {
      console.log("Not an admin user, redirecting from sidebar")
      router.push("/dashboard")
      return
    }
    setAdminChecked(true)
  }, [router])

  const handleLogout = () => {
    logoutUser(router)
  }

  if (!adminChecked) {
    return null // Don't render until we've checked admin status
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Curve AI</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Admin Portal</p>
      </div>

      <nav className="px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                isActive
                  ? "bg-gray-100 dark:bg-gray-700 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 mt-4 text-sm font-medium rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </nav>
    </div>
  )
}
