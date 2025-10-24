"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Database,
  Lightbulb,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { signOut, getCurrentUser } from "@/lib/supabase-client"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    name: "Dashboard",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    heading: "Users & Services",
    items: [
      {
        name: "Users",
        href: "/admin-dashboard/users",
        icon: Users,
      },
      {
        name: "Consultations",
        href: "/admin-dashboard/consultations",
        icon: Calendar,
      },
      {
        name: "Assessments",
        href: "/admin-dashboard/assessments",
        icon: FileText,
      },
    ],
  },
  {
    heading: "Management",
    items: [
      {
        name: "Prompt Library",
        href: "/admin-dashboard/prompts",
        icon: Lightbulb,
      },
      {
        name: "Analytics",
        href: "/admin-dashboard/analytics",
        icon: BarChart3,
      },
      {
        name: "AI Agents",
        href: "/admin-dashboard/ai-agents",
        icon: Bot,
      },
      {
        name: "Database",
        href: "/admin-dashboard/database",
        icon: Database,
      },
    ],
  },
  {
    heading: "System",
    items: [
      {
        name: "Settings",
        href: "/admin-dashboard/settings",
        icon: Settings,
      },
    ],
  },
]

// Main Sidebar Component content for reuse
function SidebarContent({
  pathname,
  router,
  onClose,
}: {
  pathname: string
  router: any
  onClose?: () => void
}) {
  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/logout")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Curve AI</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Admin Dashboard</p>
      </div>

      <nav
        className="px-4 py-2 space-y-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {navItems.map((item, index) => {
          if ("heading" in item) {
            // This is a section with sub-items
            return (
              <div key={`section-${index}`} className="mb-4">
                <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 px-4 py-2">
                  {item.heading}
                </h3>
                <div className="space-y-1">
                  {item.items.map((subItem) => {
                    const isActive =
                      pathname === subItem.href ||
                      pathname?.startsWith(`${subItem.href}/`)

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                      >
                        <subItem.icon className="mr-3 h-5 w-5" />
                        {subItem.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          } else {
            // This is a single item
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          }
        })}

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>
    </>
  )
}

// Mobile Sidebar Component
function MobileSidebar({ pathname, router }: { pathname: string; router: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-gray-800">
        <SidebarContent
          pathname={pathname}
          router={router}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

export function AdminDashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  // Layout already verifies admin status, so just render sidebar immediately
  // No async checks needed here

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <MobileSidebar pathname={pathname} router={router} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
        <SidebarContent pathname={pathname} router={router} />
      </div>
    </>
  )
}
