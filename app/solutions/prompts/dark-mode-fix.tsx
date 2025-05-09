"use client"

import { useEffect } from "react"

export function DarkModeFix() {
  useEffect(() => {
    // Apply dark mode fixes for prompt cards
    const applyDarkModeStyles = () => {
      const isDarkMode = document.documentElement.classList.contains("dark")

      // Get all prompt cards
      const promptCards = document.querySelectorAll(".prompt-card")
      promptCards.forEach((card) => {
        const title = card.querySelector("h3")
        const description = card.querySelector("p")

        if (isDarkMode) {
          if (title) title.style.color = "white"
          if (description) description.style.color = "#cbd5e1"
        } else {
          if (title) title.style.color = ""
          if (description) description.style.color = ""
        }
      })

      // Get all agent cards
      const agentCards = document.querySelectorAll(".agent-card")
      agentCards.forEach((card) => {
        const title = card.querySelector("h3, .card-title")
        const description = card.querySelector("p")

        if (isDarkMode) {
          card.style.backgroundColor = "#1e293b"
          if (title) title.style.color = "white"
          if (description) description.style.color = "#cbd5e1"
        } else {
          card.style.backgroundColor = ""
          if (title) title.style.color = ""
          if (description) description.style.color = ""
        }
      })
    }

    // Apply immediately
    applyDarkModeStyles()

    // Set up observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          applyDarkModeStyles()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  return null
}
