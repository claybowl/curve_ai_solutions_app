"use client"

import type React from "react"

interface CastleBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export function CastleBackground({
  children,
  className = "",
}: CastleBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Castle-appropriate gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900"></div>
      
      {/* Subtle stone texture overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0,0,0,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Subtle architectural lines */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="castle-lines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 10 0 M 0 5 L 10 5 M 0 10 L 10 10" stroke="currentColor" strokeWidth="0.1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#castle-lines)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
