"use client"

import { useEffect, useRef } from "react"

export default function DonjonLogoVisualization() {
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

    // Donjon brand colors
    const donjonGraphite = "#2C2C2E"
    const donjonIndigo = "#4169E1"
    const donjonSilver = "#C0C0C0"
    const donjonEmber = "#FF6B35"
    const donjonPlatinum = "#E5E4E2"

    // Draw the Donjon tower/keep
    const drawDonjonTower = (x: number, y: number, size: number, time: number) => {
      ctx.save()
      ctx.translate(x, y)

      // Add very subtle floating animation
      const floatY = Math.sin(time * 0.3) * 1

      // Tower dimensions - MUCH TALLER
      const baseWidth = size * 0.8
      const baseHeight = size * 0.3
      const towerWidth = size * 0.6
      const towerHeight = size * 2.0  // Increased from 1.2 to 2.0 for height

      // Draw tower shadow
      ctx.beginPath()
      ctx.ellipse(0, baseHeight + 5, baseWidth * 0.8, baseHeight * 0.2, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fill()

      // Draw tower base with gradient for depth
      ctx.beginPath()
      ctx.moveTo(-baseWidth / 2, floatY)
      ctx.lineTo(-towerWidth / 2, baseHeight + floatY)
      ctx.lineTo(towerWidth / 2, baseHeight + floatY)
      ctx.lineTo(baseWidth / 2, floatY)
      ctx.closePath()
      const baseGradient = ctx.createLinearGradient(-baseWidth / 2, 0, baseWidth / 2, 0)
      baseGradient.addColorStop(0, "#1a1a1a")
      baseGradient.addColorStop(0.5, donjonGraphite)
      baseGradient.addColorStop(1, "#1a1a1a")
      ctx.fillStyle = baseGradient
      ctx.fill()
      ctx.strokeStyle = donjonSilver
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw main tower body with gradient for 3D depth
      ctx.beginPath()
      ctx.rect(-towerWidth / 2, baseHeight + floatY, towerWidth, towerHeight)
      const towerGradient = ctx.createLinearGradient(-towerWidth / 2, 0, towerWidth / 2, 0)
      towerGradient.addColorStop(0, "#1a1a1a")
      towerGradient.addColorStop(0.3, donjonGraphite)
      towerGradient.addColorStop(0.7, donjonGraphite)
      towerGradient.addColorStop(1, "#1a1a1a")
      ctx.fillStyle = towerGradient
      ctx.fill()
      ctx.strokeStyle = donjonSilver
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw arched doorway
      const doorWidth = towerWidth * 0.3
      const doorHeight = towerHeight * 0.4
      const doorX = -doorWidth / 2
      const doorY = baseHeight + towerHeight - doorHeight + floatY

      ctx.beginPath()
      ctx.rect(doorX, doorY, doorWidth, doorHeight * 0.7)
      ctx.fillStyle = donjonIndigo
      ctx.fill()

      // Draw arch
      ctx.beginPath()
      ctx.arc(0, doorY, doorWidth / 2, 0, Math.PI, true)
      ctx.fillStyle = donjonIndigo
      ctx.fill()

      // Draw door frame
      ctx.strokeStyle = donjonSilver
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw battlements (merlons and crenels)
      const battlementHeight = towerHeight * 0.15
      const battlementWidth = towerWidth * 0.15
      const battlementY = baseHeight + towerHeight - battlementHeight + floatY

      // Draw battlements
      for (let i = 0; i < 3; i++) {
        const x = -towerWidth / 2 + (i + 0.5) * (towerWidth / 3)

        // Merlon (solid part)
        ctx.beginPath()
        ctx.rect(x - battlementWidth / 2, battlementY, battlementWidth, battlementHeight)
        ctx.fillStyle = donjonGraphite
        ctx.fill()
        ctx.strokeStyle = donjonSilver
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw side battlements (partial)
      const sideBattlementWidth = towerWidth * 0.1
      const sideBattlementHeight = battlementHeight * 0.7

      // Left side
      ctx.beginPath()
      ctx.rect(-towerWidth / 2 - sideBattlementWidth / 2, battlementY + battlementHeight * 0.3, sideBattlementWidth, sideBattlementHeight)
      ctx.fillStyle = donjonGraphite
      ctx.fill()
      ctx.strokeStyle = donjonSilver
      ctx.lineWidth = 1
      ctx.stroke()

      // Right side
      ctx.beginPath()
      ctx.rect(towerWidth / 2 - sideBattlementWidth / 2, battlementY + battlementHeight * 0.3, sideBattlementWidth, sideBattlementHeight)
      ctx.fillStyle = donjonGraphite
      ctx.fill()
      ctx.strokeStyle = donjonSilver
      ctx.lineWidth = 1
      ctx.stroke()

      // Add enhanced glowing effect around the tower
      const glowGradient = ctx.createRadialGradient(0, baseHeight + towerHeight / 2 + floatY, 0, 0, baseHeight + towerHeight / 2 + floatY, size * 2.5)
      glowGradient.addColorStop(0, `rgba(65, 105, 225, 0.25)`)
      glowGradient.addColorStop(0.3, `rgba(65, 105, 225, 0.15)`)
      glowGradient.addColorStop(0.6, `rgba(255, 107, 53, 0.1)`)
      glowGradient.addColorStop(1, "rgba(65, 105, 225, 0)")

      ctx.beginPath()
      ctx.arc(0, baseHeight + towerHeight / 2 + floatY, size * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = glowGradient
      ctx.fill()

      // FLAGS REMOVED - keeping the tower simple

      // Draw foundation stones with texture
      for (let i = 0; i < 5; i++) {
        const stoneX = -baseWidth / 2 + (i + 0.5) * (baseWidth / 5)
        const stoneY = floatY - 5
        const stoneWidth = baseWidth / 6
        const stoneHeight = 8

        // Add gradient to stone for depth
        const stoneGradient = ctx.createLinearGradient(
          stoneX - stoneWidth / 2,
          stoneY,
          stoneX + stoneWidth / 2,
          stoneY
        )
        stoneGradient.addColorStop(0, "#A0A0A0")
        stoneGradient.addColorStop(0.5, donjonSilver)
        stoneGradient.addColorStop(1, "#A0A0A0")

        ctx.beginPath()
        ctx.rect(stoneX - stoneWidth / 2, stoneY, stoneWidth, stoneHeight)
        ctx.fillStyle = stoneGradient
        ctx.fill()
        ctx.strokeStyle = donjonGraphite
        ctx.lineWidth = 1
        ctx.stroke()

        // Add mortar lines for texture
        ctx.strokeStyle = "#1a1a1a"
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(stoneX - stoneWidth / 2, stoneY + stoneHeight / 2)
        ctx.lineTo(stoneX + stoneWidth / 2, stoneY + stoneHeight / 2)
        ctx.stroke()
      }

      // Draw multiple levels of windows for more geometric interest
      const windowLevels = 5  // More windows up the tower
      for (let level = 0; level < windowLevels; level++) {
        for (let i = 0; i < 2; i++) {
          const windowX = -towerWidth / 4 + i * (towerWidth / 2)
          const windowY = baseHeight + towerHeight * (0.15 + level * 0.15) + floatY
          const windowSize = 8

          // Draw glowing aura around window
          const windowGlow = ctx.createRadialGradient(windowX, windowY, 0, windowX, windowY, windowSize * 2)
          windowGlow.addColorStop(0, "rgba(65, 105, 225, 0.8)")
          windowGlow.addColorStop(0.5, "rgba(65, 105, 225, 0.4)")
          windowGlow.addColorStop(1, "rgba(65, 105, 225, 0)")
          ctx.fillStyle = windowGlow
          ctx.beginPath()
          ctx.arc(windowX, windowY, windowSize * 2, 0, Math.PI * 2)
          ctx.fill()

          // Draw window itself
          ctx.beginPath()
          ctx.rect(windowX - windowSize / 2, windowY - windowSize / 2, windowSize, windowSize)
          ctx.fillStyle = donjonIndigo
          ctx.fill()
          ctx.strokeStyle = donjonSilver
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Add corner turrets for geometric interest
      const turretWidth = towerWidth * 0.12
      const turretHeight = towerHeight * 0.25

      // Left turret
      ctx.beginPath()
      ctx.rect(-towerWidth / 2 - turretWidth / 2, baseHeight + floatY, turretWidth, turretHeight)
      ctx.fillStyle = donjonGraphite
      ctx.fill()
      ctx.strokeStyle = donjonPlatinum
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Right turret
      ctx.beginPath()
      ctx.rect(towerWidth / 2 - turretWidth / 2, baseHeight + floatY, turretWidth, turretHeight)
      ctx.fillStyle = donjonGraphite
      ctx.fill()
      ctx.strokeStyle = donjonPlatinum
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Add turret battlements
      const turretBattlementWidth = turretWidth * 0.3
      const turretBattlementHeight = turretHeight * 0.15

      // Left turret battlements
      for (let i = 0; i < 2; i++) {
        const tx = -towerWidth / 2 - turretWidth / 2 + (i + 0.5) * (turretWidth / 2)
        ctx.beginPath()
        ctx.rect(tx - turretBattlementWidth / 2, baseHeight + floatY - turretBattlementHeight, turretBattlementWidth, turretBattlementHeight)
        ctx.fillStyle = donjonGraphite
        ctx.fill()
        ctx.strokeStyle = donjonPlatinum
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Right turret battlements
      for (let i = 0; i < 2; i++) {
        const tx = towerWidth / 2 - turretWidth / 2 + (i + 0.5) * (turretWidth / 2)
        ctx.beginPath()
        ctx.rect(tx - turretBattlementWidth / 2, baseHeight + floatY - turretBattlementHeight, turretBattlementWidth, turretBattlementHeight)
        ctx.fillStyle = donjonGraphite
        ctx.fill()
        ctx.strokeStyle = donjonPlatinum
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Add vertical buttresses for geometric detail
      const buttressCount = 3
      for (let i = 0; i < buttressCount; i++) {
        const buttressX = -towerWidth / 3 + i * (towerWidth / 3)
        ctx.beginPath()
        ctx.moveTo(buttressX, baseHeight + floatY)
        ctx.lineTo(buttressX, baseHeight + towerHeight + floatY)
        ctx.strokeStyle = "rgba(192, 192, 192, 0.3)"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.restore()
    }

    // Draw DNA helix patterns
    const drawDNAHelix = (time: number) => {
      const helixCount = 2
      const particlesPerHelix = 15
      
      for (let h = 0; h < helixCount; h++) {
        const helixX = centerX + (h - 0.5) * 180
        const helixY = centerY - 20
        const helixHeight = 150
        const helixWidth = 50
        
        // Draw DNA backbone strands
        for (let i = 0; i < particlesPerHelix; i++) {
          const t = i / (particlesPerHelix - 1)
          const y = helixY + t * helixHeight
          
          // Left strand
          const leftX = helixX - helixWidth / 2 + Math.sin(t * Math.PI * 4 + time * 0.5) * 5
          const leftSize = 3 + Math.sin(time * 1 + i) * 0.5
          const leftOpacity = 0.7 + Math.sin(time * 0.8 + i) * 0.2
          
          ctx.beginPath()
          ctx.arc(leftX, y, leftSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(65, 105, 225, ${leftOpacity})`
          ctx.fill()
          
          // Add glow to DNA particles
          ctx.beginPath()
          ctx.arc(leftX, y, leftSize * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(65, 105, 225, ${leftOpacity * 0.3})`
          ctx.fill()
          
          // Right strand
          const rightX = helixX + helixWidth / 2 + Math.sin(t * Math.PI * 4 + time * 0.5 + Math.PI) * 5
          const rightSize = 3 + Math.sin(time * 1 + i + 10) * 0.5
          const rightOpacity = 0.7 + Math.sin(time * 0.8 + i + 10) * 0.2
          
          ctx.beginPath()
          ctx.arc(rightX, y, rightSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 107, 53, ${rightOpacity})`
          ctx.fill()
          
          // Add glow to DNA particles
          ctx.beginPath()
          ctx.arc(rightX, y, rightSize * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 107, 53, ${rightOpacity * 0.3})`
          ctx.fill()
          
          // Draw connecting bonds with enhanced visibility
          if (i % 3 === 0) {
            ctx.beginPath()
            ctx.moveTo(leftX, y)
            ctx.lineTo(rightX, y)
            ctx.strokeStyle = `rgba(192, 192, 192, ${0.4 + Math.sin(time * 0.5 + i) * 0.2})`
            ctx.lineWidth = 2
            ctx.stroke()
          }
        }
      }
    }

    // Draw neural network connections
    const drawNeuralNetwork = (time: number) => {
      const nodeCount = 12
      const nodes: { x: number; y: number; connections: number[] }[] = []
      
      // Create nodes in a network pattern around the tower
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2
        const radius = 100 + Math.sin(time * 0.2 + i) * 8
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        nodes.push({
          x,
          y,
          connections: []
        })
      }
      
      // Connect nodes to form a network
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.sqrt(
            Math.pow(nodes[i].x - nodes[j].x, 2) + 
            Math.pow(nodes[i].y - nodes[j].y, 2)
          )
          
          // Connect nearby nodes
          if (distance < 100 && Math.random() > 0.7) {
            nodes[i].connections.push(j)
          }
        }
      }
      
      // Draw connections with enhanced visibility
      for (let i = 0; i < nodes.length; i++) {
        for (const connectionIndex of nodes[i].connections) {
          const connection = nodes[connectionIndex]
          const pulse = Math.sin(time * 1 + i) * 0.3 + 0.5
          
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(connection.x, connection.y)
          ctx.strokeStyle = `rgba(65, 105, 225, ${0.3 + pulse * 0.3})`
          ctx.lineWidth = 2
          ctx.stroke()
          
          // Add glow to connections
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(connection.x, connection.y)
          ctx.strokeStyle = `rgba(65, 105, 225, ${0.1 + pulse * 0.1})`
          ctx.lineWidth = 4
          ctx.stroke()
        }
      }
      
      // Draw nodes with enhanced visibility
      for (let i = 0; i < nodes.length; i++) {
        const pulse = Math.sin(time * 0.8 + i) * 0.2 + 0.8
        const size = 4 + Math.sin(time * 1.5 + i) * 0.8
        
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 107, 53, ${pulse})`
        ctx.fill()
        
        // Add enhanced glow effect
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 107, 53, ${pulse * 0.2})`
        ctx.fill()
        
        // Add outer glow
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 107, 53, ${pulse * 0.05})`
        ctx.fill()
      }
    }

    // Draw data flow streams
    const drawDataStreams = (time: number) => {
      const streamCount = 2
      
      for (let s = 0; s < streamCount; s++) {
        const startX = (s - 0.5) * width * 0.8 + centerX
        const startY = height + 30
        const endX = centerX + (s - 0.5) * 80
        const endY = centerY - 60
        
        // Draw flowing data particles with enhanced visibility
        for (let i = 0; i < 8; i++) {
          const t = (time * 0.15 + i * 0.15) % 1
          const x = startX + (endX - startX) * t
          const y = startY + (endY - startY) * t
          
          const size = 2.5 + Math.sin(time * 1.5 + i) * 0.5
          const opacity = 0.7 + Math.sin(time * 1.2 + i) * 0.2
          
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(192, 192, 192, ${opacity})`
          ctx.fill()
          
          // Add glow to data particles
          ctx.beginPath()
          ctx.arc(x, y, size * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(192, 192, 192, ${opacity * 0.3})`
          ctx.fill()
          
          // Add trail effect
          for (let j = 1; j <= 3; j++) {
            const trailT = (t - j * 0.05 + 1) % 1
            const trailX = startX + (endX - startX) * trailT
            const trailY = startY + (endY - startY) * trailT
            const trailSize = size * (1 - j * 0.2)
            const trailOpacity = opacity * (1 - j * 0.3)
            
            ctx.beginPath()
            ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(192, 192, 192, ${trailOpacity})`
            ctx.fill()
          }
        }
      }
    }

    // Draw the company name
    const drawCompanyName = (time: number) => {
      const yOffset = Math.sin(time * 0.2) * 1

      // Draw "DONJON" in bold serif (larger) with glow effect
      ctx.font = "bold 40px serif"
      ctx.textAlign = "center"

      // Add glow effect
      ctx.shadowColor = donjonIndigo
      ctx.shadowBlur = 10
      ctx.fillStyle = "#FFFFFF"
      ctx.fillText("DONJON", centerX, centerY + 190 + yOffset)

      // Reset shadow
      ctx.shadowBlur = 0

      // Draw "INTELLIGENCE SYSTEMS" in sans-serif with glow
      ctx.font = "22px sans-serif"
      ctx.shadowColor = donjonEmber
      ctx.shadowBlur = 8
      ctx.fillStyle = donjonSilver
      ctx.fillText("INTELLIGENCE SYSTEMS", centerX, centerY + 220 + yOffset)

      // Reset shadow
      ctx.shadowBlur = 0
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return

      // Clear canvas with a clean, minimal gradient background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2)
      gradient.addColorStop(0, "#1a1a1a") // Deep graphite center
      gradient.addColorStop(0.5, "#2C2C2E") // Donjon graphite
      gradient.addColorStop(1, "#0a0a0a") // Deep black edges

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw the TALL Donjon tower - positioned higher since it's much taller now
      drawDonjonTower(centerX, centerY - 60, 200, time)

      // Draw company name on top with better contrast
      drawCompanyName(time)

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
      className="w-full h-full min-h-[500px] rounded-lg"
      style={{
        background: "transparent",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
        border: "2px solid #4169E1",
        borderRadius: "12px",
        transform: "scale(0.95)",
        margin: "2% auto",
      }}
    />
  )
}
