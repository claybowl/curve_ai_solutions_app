"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const PROMOTION_START_DATE = new Date("2025-10-31") // Start date of promotion
const PROMOTION_DURATION_DAYS = 7 // One week

export function PromotionButton({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const checkPromotionValidity = () => {
      const now = new Date()
      const endDate = new Date(PROMOTION_START_DATE)
      endDate.setDate(endDate.getDate() + PROMOTION_DURATION_DAYS)

      // Check if promotion has expired
      if (now > endDate) {
        setIsExpired(true)
        setIsVisible(false)
        return
      }

      // Check if promotion should start
      if (now >= PROMOTION_START_DATE) {
        setIsExpired(false)
        setIsVisible(true)
      } else {
        setIsExpired(true)
        setIsVisible(false)
      }
    }

    checkPromotionValidity()

    // Check every hour to update if needed
    const interval = setInterval(checkPromotionValidity, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible || isExpired) {
    return null
  }

  const isDesktop = variant === "desktop"

  return (
    <Button
      asChild
      className={`
        bg-gradient-to-r from-orange-500 to-red-500
        hover:from-orange-600 hover:to-red-600
        text-white font-semibold shadow-lg hover:shadow-xl
        transition-all duration-300 animate-pulse
        ${isDesktop ? "px-6" : "text-sm px-4 py-1"}
      `}
    >
      <Link href="/consultation" className="flex items-center gap-2">
        🔥 {isDesktop ? "FREE 30-Min Session" : "FREE Session"}
      </Link>
    </Button>
  )
}