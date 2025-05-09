"use client"

import { useEffect, useRef } from "react"

export default function DataVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      return { width: rect.width, height: rect.height }
    }

    const { width, height } = setCanvasDimensions()

    // Animation variables
    let animationFrameId: number
    let time = 0
    const centerX = width / 2
    const centerY = height / 2

    // Colors
    const darkBlue = "#0A1929"
    const mediumBlue = "#13315C"
    const lightBlue = "#134074"
    const accentBlue = "#0076FF"
    const white = "#FFFFFF"
    const gold = "#D4AF37"
    const teal = "#00CCCC"

    // Particle system for anti-gravity effect
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      trail: { x: number; y: number }[]
      trailLength: number
      type: string

      constructor(x: number, y: number, type: string) {
        this.x = x
        this.y = y
        this.type = type

        if (type === "rocket") {
          this.size = Math.random() * 3 + 2
          this.speedX = (Math.random() - 0.5) * 0.5
          this.speedY = -Math.random() * 3 - 2
          this.color = Math.random() > 0.7 ? gold : teal
          this.opacity = Math.random() * 0.7 + 0.3
          this.trail = []
          this.trailLength = Math.floor(Math.random() * 10) + 5
        } else if (type === "star") {
          this.size = Math.random() * 2 + 0.5
          this.speedX = (Math.random() - 0.5) * 0.2
          this.speedY = -Math.random() * 0.5 - 0.1
          this.color = white
          this.opacity = Math.random() * 0.5 + 0.3
          this.trail = []
          this.trailLength = 0
        } else if (type === "floater") {
          this.size = Math.random() * 15 + 10
          this.speedX = (Math.random() - 0.5) * 0.3
          this.speedY = -Math.random() * 0.4 - 0.2
          this.color = accentBlue
          this.opacity = Math.random() * 0.2 + 0.1
          this.trail = []
          this.trailLength = 0
        }
      }

      update() {
        // Add current position to trail
        if (this.trailLength > 0) {
          this.trail.push({ x: this.x, y: this.y })
          if (this.trail.length > this.trailLength) {
            this.trail.shift()
          }
        }

        // Update position
        this.x += this.speedX
        this.y += this.speedY

        // Accelerate upward for rocket particles to simulate takeoff
        if (this.type === "rocket") {
          this.speedY -= 0.01
        }

        // Reset if off screen
        if (this.y < -50 || this.x < -50 || this.x > width + 50) {
          if (this.type === "rocket") {
            this.x = Math.random() * width
            this.y = height + 10
            this.speedY = -Math.random() * 3 - 2
            this.trail = []
          } else if (this.type === "star") {
            this.x = Math.random() * width
            this.y = height + 10
            this.speedY = -Math.random() * 0.5 - 0.1
          } else if (this.type === "floater") {
            this.x = Math.random() * width
            this.y = height + 20
            this.speedY = -Math.random() * 0.4 - 0.2
          }
        }
      }

      draw() {
        // Draw trail
        if (this.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(this.trail[0].x, this.trail[0].y)

          for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y)
          }

          ctx.strokeStyle = `rgba(${this.color === gold ? "212, 175, 55" : "0, 204, 204"}, ${this.opacity * 0.5})`
          ctx.lineWidth = this.size / 2
          ctx.stroke()
        }

        // Draw particle
        if (this.type === "floater") {
          // Draw circular gradient for floaters
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
          gradient.addColorStop(0, `rgba(0, 118, 255, ${this.opacity + 0.1})`)
          gradient.addColorStop(1, `rgba(0, 118, 255, 0)`)

          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        } else {
          // Draw regular particles
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

          if (this.type === "star") {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
          } else {
            ctx.fillStyle =
              this.color === gold ? `rgba(212, 175, 55, ${this.opacity})` : `rgba(0, 204, 204, ${this.opacity})`
          }

          ctx.fill()
        }
      }
    }

    // Create particles
    const particles: Particle[] = []

    // Rocket trail particles
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(Math.random() * width, height + Math.random() * 50, "rocket"))
    }

    // Background stars
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height, "star"))
    }

    // Floating elements
    for (let i = 0; i < 15; i++) {
      particles.push(new Particle(Math.random() * width, height + Math.random() * 50 + i * 20, "floater"))
    }

    // Draw UFO with programmer inside
    const drawUFO = (x: number, y: number, size: number, time: number) => {
      const ufoWidth = size * 4
      const ufoHeight = size * 2
      const domeHeight = size * 1.2

      // Save context
      ctx.save()
      ctx.translate(x, y)

      // Add slight oscillation
      ctx.rotate(Math.sin(time * 0.5) * 0.05)

      // Draw wormhole above the UFO
      const wormholeY = -height * 0.3
      const wormholeSize = size * 6
      const wormholeGradient = ctx.createRadialGradient(0, wormholeY, 0, 0, wormholeY, wormholeSize)
      wormholeGradient.addColorStop(0, "rgba(100, 200, 255, 0.8)")
      wormholeGradient.addColorStop(0.3, "rgba(50, 100, 255, 0.6)")
      wormholeGradient.addColorStop(0.6, "rgba(100, 50, 255, 0.4)")
      wormholeGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.beginPath()
      ctx.arc(0, wormholeY, wormholeSize, 0, Math.PI * 2)
      ctx.fillStyle = wormholeGradient
      ctx.fill()

      // Add swirling effect to wormhole
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(0, wormholeY, wormholeSize * (0.3 + i * 0.2), 0 + time * (1 + i * 0.2), Math.PI + time * (1 + i * 0.2))
        ctx.strokeStyle = `rgba(150, 200, 255, ${0.7 - i * 0.2})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw atmosphere the UFO is blasting through
      const atmosphereGradient = ctx.createLinearGradient(0, -ufoHeight * 2, 0, ufoHeight * 3)
      atmosphereGradient.addColorStop(0, "rgba(0, 0, 50, 0)")
      atmosphereGradient.addColorStop(0.5, "rgba(50, 100, 200, 0.2)")
      atmosphereGradient.addColorStop(1, "rgba(100, 200, 255, 0.1)")

      ctx.beginPath()
      ctx.fillStyle = atmosphereGradient
      ctx.fillRect(-width / 2, -ufoHeight * 2, width, height)

      // UFO body (saucer shape)
      const bodyGradient = ctx.createLinearGradient(0, -ufoHeight / 2, 0, ufoHeight / 2)
      bodyGradient.addColorStop(0, "#DDDDDD")
      bodyGradient.addColorStop(0.5, "#AAAAAA")
      bodyGradient.addColorStop(1, "#888888")

      // Bottom part of saucer
      ctx.beginPath()
      ctx.ellipse(0, 0, ufoWidth / 2, ufoHeight / 2, 0, 0, Math.PI * 2)
      ctx.fillStyle = bodyGradient
      ctx.fill()
      ctx.strokeStyle = "#666666"
      ctx.lineWidth = 1
      ctx.stroke()

      // Top dome (transparent)
      const domeGradient = ctx.createLinearGradient(0, -domeHeight, 0, 0)
      domeGradient.addColorStop(0, "rgba(150, 200, 255, 0.8)")
      domeGradient.addColorStop(1, "rgba(150, 200, 255, 0.4)")

      ctx.beginPath()
      ctx.ellipse(0, -ufoHeight / 4, ufoWidth / 3, domeHeight, 0, Math.PI, 0, true)
      ctx.fillStyle = domeGradient
      ctx.fill()
      ctx.strokeStyle = "#0076FF"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw programmer inside the dome
      drawProgrammer(0, -ufoHeight / 4, size * 0.6)

      // Draw lights around the UFO
      const lightCount = 8
      for (let i = 0; i < lightCount; i++) {
        const angle = (i / lightCount) * Math.PI * 2
        const lightX = Math.cos(angle) * (ufoWidth / 2 - 5)
        const lightY = Math.sin(angle) * (ufoHeight / 2 - 5)

        const lightColor = i % 2 === 0 ? "#0076FF" : "#FF7F00"
        const lightSize = (Math.sin(time * 5 + i) + 1) * 3 + 2

        ctx.beginPath()
        ctx.arc(lightX, lightY, lightSize, 0, Math.PI * 2)
        ctx.fillStyle = lightColor
        ctx.fill()
      }

      // UFO beam
      const beamGradient = ctx.createLinearGradient(0, 0, 0, ufoHeight * 2)
      beamGradient.addColorStop(0, "rgba(150, 200, 255, 0.8)")
      beamGradient.addColorStop(1, "rgba(150, 200, 255, 0)")

      ctx.beginPath()
      ctx.moveTo(-ufoWidth / 4, 0)
      ctx.lineTo(ufoWidth / 4, 0)
      ctx.lineTo(ufoWidth / 2, ufoHeight * 2)
      ctx.lineTo(-ufoWidth / 2, ufoHeight * 2)
      ctx.closePath()
      ctx.fillStyle = beamGradient
      ctx.fill()

      // Restore context
      ctx.restore()
    }

    // Draw programmer inside the UFO
    const drawProgrammer = (x: number, y: number, size: number) => {
      // Head
      ctx.beginPath()
      ctx.arc(x, y - size / 2, size / 3, 0, Math.PI * 2)
      ctx.fillStyle = "#FFD8B4"
      ctx.fill()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.stroke()

      // Eyes (glasses)
      ctx.beginPath()
      ctx.arc(x - size / 8, y - size / 2, size / 10, 0, Math.PI * 2)
      ctx.arc(x + size / 8, y - size / 2, size / 10, 0, Math.PI * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.stroke()

      // Laptop
      ctx.beginPath()
      ctx.rect(x - size / 2, y, size, size / 3)
      ctx.fillStyle = "#333333"
      ctx.fill()

      // Screen
      ctx.beginPath()
      ctx.rect(x - size / 2 + size / 10, y + size / 20, size - size / 5, size / 5)
      ctx.fillStyle = "#00FF00"
      ctx.fill()

      // Code on screen (simplified)
      ctx.fillStyle = "#000000"
      ctx.font = `${size / 10}px monospace`
      ctx.fillText("while(true){code();}", x - size / 3, y + size / 6)
    }

    // Draw floating text
    const drawText = () => {
      // Calculate vertical position with smooth oscillation
      const yOffset = Math.sin(time * 0.5) * 10

      // Add text shadow for better readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      // Draw main title
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.fillStyle = white
      ctx.fillText("TAKEOFF WITH CURVE AI SOLUTIONS", centerX, centerY - 60 + yOffset)

      // Draw subtitle
      ctx.font = "bold 18px Arial" // Added bold
      ctx.fillStyle = "#2B9AFF" // Brighter blue
      ctx.fillText("THE ANTI-GRAVITY FOR BUSINESS", centerX, centerY - 30 + yOffset)

      // Draw tagline
      ctx.font = "bold 16px Arial" // Added bold
      ctx.fillStyle = "#00FFFF" // Brighter teal
      ctx.fillText("BREAKAWAY WITH NO RESISTANCE", centerX, centerY + yOffset)

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    // Draw curved path
    const drawCurvedPath = () => {
      const pathWidth = width * 0.8
      const pathHeight = height * 0.6
      const pathX = width * 0.1
      const pathY = height * 0.3

      // Draw curved path
      ctx.beginPath()
      ctx.moveTo(pathX, pathY + pathHeight)

      // Create a curved path that goes up
      ctx.bezierCurveTo(
        pathX + pathWidth * 0.3,
        pathY + pathHeight * 0.8,
        pathX + pathWidth * 0.7,
        pathY + pathHeight * 0.3,
        pathX + pathWidth,
        pathY,
      )

      // Style the path
      ctx.strokeStyle = `rgba(212, 175, 55, ${0.3 + Math.sin(time) * 0.1})`
      ctx.lineWidth = 2
      ctx.stroke()

      // Add dots along the path
      const dotCount = 12
      for (let i = 0; i < dotCount; i++) {
        const t = i / (dotCount - 1)

        // Parametric bezier curve formula
        const u = 1 - t
        const x =
          u * u * u * pathX +
          3 * u * u * t * (pathX + pathWidth * 0.3) +
          3 * u * t * t * (pathX + pathWidth * 0.7) +
          t * t * t * (pathX + pathWidth)

        const y =
          u * u * u * (pathY + pathHeight) +
          3 * u * u * t * (pathY + pathHeight * 0.8) +
          3 * u * t * t * (pathY + pathHeight * 0.3) +
          t * t * t * pathY

        // Draw dot
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = i % 3 === 0 ? gold : i % 3 === 1 ? teal : white
        ctx.fill()
      }
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, darkBlue)
      gradient.addColorStop(1, "#000000")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw stars (small dots in background)
      for (let i = 0; i < 100; i++) {
        const x = (i * 17) % width
        const y = (i * 23) % height
        const size = Math.sin(time + i) * 0.5 + 1

        ctx.beginPath()
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()
      }

      // Draw curved path
      drawCurvedPath()

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Replace this line in the animate function:
      // drawSpacecraft(centerX, centerY + 50, 20, time);

      // With:
      drawUFO(centerX, centerY + 70, 20, time)

      // Draw text
      drawText()

      // Update time
      time += 0.01

      // Continue animation
      animationFrameId = requestAnimationFrame(animate)
    }

    // Handle window resize
    const handleResize = () => {
      const { width, height } = setCanvasDimensions()
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[332px] rounded-lg"
      style={{
        background: "linear-gradient(135deg, #0A1929 0%, #000000 100%)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        border: "1px solid #0076FF", // Changed from gold to blue to match banner
        transform: "scale(0.94)",
        margin: "3% auto",
      }}
    />
  )
}
