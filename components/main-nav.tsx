"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/supabase-auth-provider"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState("")
  const { user, signOut } = useAuth()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    if (pathname) {
      setCurrentPath(pathname)
    } else if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }
  }, [pathname])

  const isLoggedIn = !!user

  const handleLogout = async () => {
    try {
      await signOut()
      if (router && mounted) {
        router.push("/")
      } else {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Error during logout:", error)
      if (router && mounted) {
        router.push("/")
      } else {
        window.location.href = "/"
      }
    }
  }

  type NavItem = {
    name: string
    href: string
    dropdown?: boolean
    external?: boolean
  }

  const navigation: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions", dropdown: true },
    { name: "Platforms", href: "/aipex-platform-prototype", dropdown: true },
    { name: "Knowledge Vault", href: "/knowledge-vault", dropdown: true },
    { name: "Assessments", href: "/assessments" },
    { name: "Consultation", href: "/consultation" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 transition-all duration-300">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-3">
          {/* Castle Icon */}
          <div className="flex-shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 64 64"
              className="text-sky-400"
              fill="currentColor"
            >
              {/* Left Tower */}
              <rect x="4" y="20" width="12" height="40" />
              <rect x="4" y="18" width="3" height="4" />
              <rect x="9" y="18" width="3" height="4" />
              <rect x="13" y="18" width="3" height="4" />

              {/* Right Tower */}
              <rect x="48" y="20" width="12" height="40" />
              <rect x="48" y="18" width="3" height="4" />
              <rect x="53" y="18" width="3" height="4" />
              <rect x="57" y="18" width="3" height="4" />

              {/* Main Keep (center) */}
              <rect x="16" y="28" width="32" height="32" />

              {/* Keep Battlements */}
              <rect x="16" y="26" width="4" height="4" />
              <rect x="22" y="26" width="4" height="4" />
              <rect x="28" y="26" width="4" height="4" />
              <rect x="34" y="26" width="4" height="4" />
              <rect x="40" y="26" width="4" height="4" />
              <rect x="44" y="26" width="4" height="4" />

              {/* Central Gate/Door */}
              <rect x="26" y="48" width="12" height="12" opacity="0.3" />

              {/* Windows on towers */}
              <rect x="8" y="30" width="4" height="5" opacity="0.3" />
              <rect x="8" y="40" width="4" height="5" opacity="0.3" />
              <rect x="52" y="30" width="4" height="5" opacity="0.3" />
              <rect x="52" y="40" width="4" height="5" opacity="0.3" />

              {/* Windows on keep */}
              <rect x="22" y="36" width="4" height="5" opacity="0.3" />
              <rect x="38" y="36" width="4" height="5" opacity="0.3" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extralight tracking-[0.4em] uppercase text-white">Donjon</span>
            <span className="text-lg font-semibold text-sky-400">Systems</span>
          </div>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6 items-center">
          {navigation.map((item) => {
            if (item.name === "Solutions") {
              return (
                <div key={item.name} className="relative">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            "text-sm font-medium transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-sky-400",
                            mounted && ((pathname || currentPath) === "/solutions" || (pathname || currentPath) === "/products")
                              ? "text-sky-400"
                              : "text-slate-400 hover:text-sky-400"
                          )}
                        >
                          Solutions
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[200px] p-2 glass-panel rounded-lg shadow-xl">
                            <Link
                              href="/solutions"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/solutions"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              Solutions
                            </Link>
                            <Link
                              href="/products"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/products"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              Products
                            </Link>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              )
            }
            if (item.name === "Platforms") {
              return (
                <div key={item.name} className="relative">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            "text-sm font-medium transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-sky-400",
                            mounted && ((pathname || currentPath).includes("/aipex") || (pathname || currentPath).includes("/aigency") || (pathname || currentPath).includes("/donjon-chat"))
                              ? "text-sky-400"
                              : "text-slate-400 hover:text-sky-400"
                          )}
                        >
                          Platforms
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[220px] p-2 glass-panel rounded-lg shadow-xl">
                            <Link
                              href="/aipex-platform-prototype"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/aipex-platform-prototype"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              AiPex Platform
                            </Link>
                            <Link
                              href="/aigency-platform"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/aigency-platform"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              AiGency Workbench
                            </Link>
                            <Link
                              href="/donjon-chat"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/donjon-chat"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              Knowledge Studio
                            </Link>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              )
            }
            if (item.name === "Knowledge Vault") {
              return (
                <div key={item.name} className="relative">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            "text-sm font-medium transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-sky-400",
                            mounted && ((pathname || currentPath).includes("/knowledge-vault") || (pathname || currentPath) === "/roi-calculator" || (pathname || currentPath) === "/solutions/prompts")
                              ? "text-sky-400"
                              : "text-slate-400 hover:text-sky-400"
                          )}
                        >
                          Knowledge Vault
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[240px] p-2 glass-panel rounded-lg shadow-xl">
                            <Link
                              href="/knowledge-vault"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/knowledge-vault"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              Home
                            </Link>
                            <Link
                              href="/knowledge-vault/documentation"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/knowledge-vault/documentation"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              Documentation
                            </Link>
                            <Link
                              href="/solutions/prompts"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/solutions/prompts"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              Prompts
                            </Link>
                            <Link
                              href="/roi-calculator"
                              className={cn(
                                "block px-4 py-2 rounded-md text-sm transition-colors",
                                (pathname || currentPath) === "/roi-calculator"
                                  ? "bg-sky-500/20 text-sky-400 font-medium"
                                  : "text-slate-400 hover:bg-white/5 hover:text-sky-400"
                              )}
                            >
                              ROI Calculator
                            </Link>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              )
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center",
                  mounted && (pathname || currentPath) === item.href
                    ? "text-sky-400"
                    : "text-slate-400 hover:text-sky-400",
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
            )
          })}
          <span className="fira-label hidden lg:block text-xs tracking-wider">[STATUS: <span className="text-emerald-400">OPERATIONAL</span>]</span>
        </nav>
        <div className="ml-auto md:ml-6 flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-900 hover:bg-red-950 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 transition-all duration-300"
                  asChild
                >
                  <Link href="/login">
                    Log In
                  </Link>
                </Button>
              </>
            )}
            <Button
              className="bg-sky-500 hover:bg-sky-400 text-black font-bold transition-all duration-300"
              asChild
            >
              <Link href="/consultation">
                Schedule Consultation
              </Link>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 px-4 sm:px-6 flex flex-col gap-4 glass-panel border-t border-white/5">
            {navigation.map((item) => {
              if (item.name === "Solutions") {
                return (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Solutions</div>
                    <Link
                      href="/solutions"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/solutions"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Solutions
                    </Link>
                    <Link
                      href="/products"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/products"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Products
                    </Link>
                  </div>
                )
              }
              if (item.name === "Platforms") {
                return (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Platforms</div>
                    <Link
                      href="/aipex-platform-prototype"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/aipex-platform-prototype"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AiPex Platform
                    </Link>
                    <Link
                      href="/aigency-platform"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/aigency-platform"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AiGency Workbench
                    </Link>
                    <Link
                      href="/donjon-chat"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/donjon-chat"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Knowledge Studio
                    </Link>
                  </div>
                )
              }
              if (item.name === "Knowledge Vault") {
                return (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Knowledge Vault</div>
                    <Link
                      href="/knowledge-vault"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/knowledge-vault"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/knowledge-vault/documentation"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/knowledge-vault/documentation"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Documentation
                    </Link>
                    <Link
                      href="/solutions/prompts"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/solutions/prompts"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Prompts
                    </Link>
                    <Link
                      href="/roi-calculator"
                      className={cn(
                        "text-sm font-medium transition-colors pl-4",
                        pathname === "/roi-calculator"
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ROI Calculator
                    </Link>
                  </div>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center",
                    pathname === item.href
                      ? "text-sky-400"
                      : "text-slate-400 hover:text-sky-400",
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
              )
            })}
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    className="text-red-600 border-red-900 hover:bg-red-950 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 transition-all duration-300"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/login">
                    Log In
                  </Link>
                </Button>
              )}
              <Button
                className="bg-sky-500 hover:bg-sky-400 text-black font-bold transition-all duration-300"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/consultation">
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
