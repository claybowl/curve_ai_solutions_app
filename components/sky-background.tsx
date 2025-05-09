"use client"

import type React from "react"

interface SkyBackgroundProps {
  children?: React.ReactNode
  className?: string
  showGrid?: boolean
  showClouds?: boolean
  showStars?: boolean
}

export function SkyBackground({
  children,
  className = "",
  showGrid = true,
  showClouds = true,
  showStars = true,
}: SkyBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Grid pattern overlay */}
      {showGrid && (
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-10 z-0"></div>
      )}

      {/* Shooting stars - enhanced for dark mode */}
      {showStars && (
        <>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "10%",
              left: "80%",
              animationDelay: "0s",
              animationDuration: "12s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "15%",
              left: "40%",
              animationDelay: "2s",
              animationDuration: "15s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "5%",
              left: "60%",
              animationDelay: "4s",
              animationDuration: "14s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "25%",
              left: "70%",
              animationDelay: "6s",
              animationDuration: "16s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "20%",
              left: "30%",
              animationDelay: "8s",
              animationDuration: "13s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "8%",
              left: "90%",
              animationDelay: "10s",
              animationDuration: "15s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "12%",
              left: "55%",
              animationDelay: "3s",
              animationDuration: "14s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "18%",
              left: "75%",
              animationDelay: "7s",
              animationDuration: "16s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0"
            style={{
              top: "22%",
              left: "45%",
              animationDelay: "9s",
              animationDuration: "13s",
            }}
          ></div>
          {/* Additional stars for dark mode */}
          <div
            className="shooting-star absolute z-0 dark:opacity-100"
            style={{
              top: "7%",
              left: "35%",
              animationDelay: "1s",
              animationDuration: "10s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0 dark:opacity-100"
            style={{
              top: "14%",
              left: "65%",
              animationDelay: "5s",
              animationDuration: "12s",
            }}
          ></div>
          <div
            className="shooting-star absolute z-0 dark:opacity-100"
            style={{
              top: "28%",
              left: "25%",
              animationDelay: "11s",
              animationDuration: "18s",
            }}
          ></div>
        </>
      )}

      {/* Fluffy white clouds - adjusted for dark mode */}
      {showClouds && (
        <>
          <div
            className="floating-cloud absolute z-0"
            style={{
              top: "-10%",
              left: "15%",
              width: "120px",
              height: "70px",
              animationDelay: "0s",
              animationDuration: "7s",
              transform: "rotate(10deg)",
            }}
          ></div>
          <div
            className="floating-cloud absolute z-0"
            style={{
              top: "-15%",
              left: "60%",
              width: "180px",
              height: "100px",
              animationDelay: "3s",
              animationDuration: "6s",
              transform: "rotate(-5deg)",
            }}
          ></div>
          <div
            className="floating-cloud absolute z-0"
            style={{
              top: "-10%",
              left: "75%",
              width: "140px",
              height: "80px",
              animationDelay: "4.5s",
              animationDuration: "8s",
              transform: "rotate(8deg)",
            }}
          ></div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
