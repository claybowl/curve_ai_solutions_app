"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface FloatingOpenButtonProps {
  href: string
  variant?: "vibe" | "k8" | "servicepro"
}

export function FloatingOpenButton({ href, variant = "vibe" }: FloatingOpenButtonProps) {
  const styles = {
    vibe: "bg-[#0076FF] hover:bg-[#0076FF]/90 text-white shadow-lg shadow-[#0076FF]/25",
    k8: "bg-[#6366f1] hover:bg-[#6366f1]/90 text-white shadow-lg shadow-[#6366f1]/25",
    servicepro: "bg-[#22c55e] hover:bg-[#22c55e]/90 text-white shadow-lg shadow-[#22c55e]/25",
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${styles[variant]}`}
    >
      <ExternalLink className="w-3 h-3" />
      <span className="hidden sm:inline">Open in New Tab</span>
    </Link>
  )
}
