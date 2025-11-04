"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, Users, FileText, Calendar, Settings, Wrench, 
  UserCog, Lock, LogOut, Lightbulb, BarChart3, 
  Library, Bot, Shield, MessageSquare, Menu, RefreshCw
} from "lucide-react"
import { useAuth } from "@/providers/stack-auth-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    heading: "Users & Permissions",
    items: [
      {
        name: "User Management",
        href: "/admin/users/management",
        icon: UserCog,
      },
      {
        name: "Users List",
        href: "/admin/users",
        icon: Users,
      },
      {
        name: "Roles & Permissions",
        href: "/admin/permissions",
        icon: Lock,
      },
    ],
  },
  {
    heading: "Customer Services",
    items: [
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
    ],
  },
  {
    heading: "Content Management",
    items: [
      {
        name: "Prompt Library",
        href: "/admin/prompts",
        icon: Lightbulb,
      },
      {
        name: "AI Tools",
        href: "/admin/tools",
        icon: Wrench,
      },
    ],
  },
  {
    heading: "Analytics",
    items: [
      {
        name: "Statistics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        name: "User Engagement",
        href: "/admin/analytics/engagement",
        icon: MessageSquare,
      },
    ],
  },
  {
    heading: "System",
    items: [
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        name: "Auth Migration",
        href: "/admin/migrate-auth",
        icon: RefreshCw,
      },
    ],
  },
]

// Main Sidebar Component content for reuse
function SidebarContent({ pathname, router, onClose }: { pathname: string, router: any, onClose?: () => void }) {
  const { signOut } = useAuth()
  
  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      router.push("/")
    }
  }

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-white">Curve AI</h2>
        <p className="text-sm text-gray-500 text-gray-400">Admin Portal</p>
      </div>

      <nav className="px-4 py-2 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        {navItems.map((item, index) => {
          if ('heading' in item) {
            // This is a section with sub-items
            return (
              <div key={`section-${index}`} className="mb-4">
                <h3 className="text-xs uppercase font-semibold text-gray-500 text-gray-400 px-4 py-2">
                  {item.heading}
                </h3>
                <div className="space-y-1">
                  {item.items.map((subItem) => {
                    const isActive = pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
                    
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                          isActive
                            ? "bg-gray-100 bg-gray-700 text-primary"
                            : "text-gray-600 text-gray-300 hover:bg-gray-50 hover:bg-gray-700",
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
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-gray-100 bg-gray-700 text-primary"
                    : "text-gray-600 text-gray-300 hover:bg-gray-50 hover:bg-gray-700",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          }
        })}

        <div className="pt-4 mt-4 border-t border-gray-200 border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md bg-red-50 bg-red-900/20 text-red-600 text-red-400 hover:bg-red-100 hover:bg-red-900/30 transition-colors"
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
function MobileSidebar({ pathname, router }: { pathname: string, router: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-white bg-gray-800">
        <SidebarContent pathname={pathname} router={router} onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Check admin status from Stack Auth user permissions
    if (user) {
      const permissions = (user as any).permissions || []
      setIsAdmin(Array.isArray(permissions) && permissions.includes('admin'))
    } else {
      setIsAdmin(false)
    }
    setIsLoading(loading)
    setIsMounted(true)
  }, [user, loading])

  // Redirect non-admin users to dashboard
  useEffect(() => {
    if (!isLoading && !isAdmin && isMounted) {
      console.log("Not an admin user, redirecting from sidebar")
      router.push("/dashboard")
    }
  }, [isAdmin, isLoading, isMounted, router])

  // Show loading state or nothing while checking session
  if (isLoading || !isMounted || !isAdmin) {
    return null
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <MobileSidebar pathname={pathname} router={router} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 bg-white bg-gray-800 border-r border-gray-200 border-gray-700 h-screen">
        <SidebarContent pathname={pathname} router={router} />
      </div>
    </>
  )
}