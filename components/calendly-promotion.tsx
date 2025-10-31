"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const PROMOTION_START_DATE = new Date("2025-10-31") // Start date of promotion
const PROMOTION_DURATION_DAYS = 7 // One week

export function CalendlyPromotion() {
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

  return (
    <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 px-4 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        aria-label="Close promotion"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm mb-4 animate-pulse">
            🔥 LIMITED TIME OFFER - ONE WEEK ONLY 🔥
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Book a FREE 30-Minute AI Strategy Session!
          </h2>
          <p className="text-xl mb-6 text-gray-100">
            Get expert advice on implementing AI in your business. No strings attached!
          </p>
          <a
            href="https://calendly.com/donjon-systems"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold text-lg px-8 py-4 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            📅 Book My FREE Session Now!
          </a>
          <p className="text-sm mt-4 text-gray-200">
            Limited spots available - Book before this offer ends!
          </p>
        </div>
      </div>
    </section>
  )
}