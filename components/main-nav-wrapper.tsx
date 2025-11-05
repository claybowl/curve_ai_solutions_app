"use client"

import dynamic from "next/dynamic"

// Dynamically import MainNav to avoid router context issues during SSR
const MainNav = dynamic(() => import("@/components/main-nav").then(mod => ({ default: mod.MainNav })), {
  ssr: false,
})

export function MainNavWrapper() {
  return <MainNav />
}


