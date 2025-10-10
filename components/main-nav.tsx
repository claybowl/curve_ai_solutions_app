"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function MainNav() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [dashboardUrl, setDashboardUrl] = useState("/dashboard")
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check Supabase auth session and user role
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      
      if (session?.user) {
        // Check if user is admin by looking at profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
        
        const userIsAdmin = profile?.role === 'admin'
        setIsAdmin(userIsAdmin)
        setDashboardUrl(userIsAdmin ? "/admin" : "/dashboard")
      }
    }
    
    checkAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
      if (!session) {
        setIsAdmin(false)
        setDashboardUrl("/dashboard")
      } else {
        checkAuth() // Re-check role when session changes
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
      router.push("/")
    }
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Assessments", href: "/assessments" },
    { name: "Prompts", href: "/solutions/prompts" },
    { name: "AiPex Platform", href: "/aipex-platform-prototype" },
    { name: "AiGency Workbench", href: "/aigency-platform" },
    { name: "Knowledge Studio", href: "/donjon-chat" },
    { name: "Fundraising", href: "/fundraising" },
    { name: "About", href: "/about" },
    { name: "Consultation", href: "/consultation" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-3">
          {/* Castle Icon */}
          <div className="flex-shrink-0">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              className="text-donjon-graphite dark:text-white"
              fill="currentColor"
            >
              {/* Solid castle tower with tapered base */}
              <path d="M6 28 L6 20 L4 20 L4 18 L6 18 L6 8 L8 8 L8 6 L10 6 L10 8 L12 8 L12 6 L14 6 L14 8 L16 8 L16 6 L18 6 L18 8 L20 8 L20 6 L22 6 L22 8 L24 8 L24 6 L26 6 L26 8 L28 8 L28 18 L30 18 L30 20 L28 20 L28 28 L6 28 Z" />
              
              {/* Main tower body */}
              <rect x="10" y="8" width="12" height="12" />
              
              {/* Battlements */}
              <rect x="10" y="6" width="4" height="2" />
              <rect x="14" y="6" width="4" height="2" />
              <rect x="18" y="6" width="4" height="2" />
              
              {/* Arched doorway (cutout) */}
              <path d="M14 20 L14 24 L18 24 L18 20 Q18 18 16 18 Q14 18 14 20 Z" fill="transparent" />
            </svg>
          </div>
          {/* Company Name */}
          <div className="flex flex-col">
            <span className="text-lg font-bold text-donjon-graphite dark:text-white leading-tight">DONJON</span>
            <span className="text-xs text-donjon-indigo dark:text-donjon-indigo leading-tight">INTELLIGENCE SYSTEMS</span>
          </div>
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
                  ? "text-donjon-indigo dark:text-donjon-indigo"
                  : "text-gray-700 hover:text-donjon-indigo dark:text-gray-300 dark:hover:text-donjon-indigo",
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
                  <Link href={dashboardUrl}>Dashboard</Link>
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
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  className="bg-donjon-indigo hover:bg-donjon-indigo/90 dark:bg-donjon-indigo dark:hover:bg-donjon-indigo/90"
                  asChild
                >
                  <Link href="/login">Sign Up</Link>
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
                    ? "text-donjon-indigo dark:text-donjon-indigo"
                    : "text-gray-700 hover:text-donjon-indigo dark:text-gray-300 dark:hover:text-donjon-indigo",
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
                    <Link href={dashboardUrl}>Dashboard</Link>
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
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="bg-donjon-indigo hover:bg-donjon-indigo/90 dark:bg-donjon-indigo dark:hover:bg-donjon-indigo/90"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/login">Sign Up</Link>
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
