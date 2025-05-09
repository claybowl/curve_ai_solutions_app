;(() => {
  // Configuration
  const WEBHOOK_URL = "https://your-website.com/api/embed-chat" // We'll use our proxy endpoint
  const COMPANY_NAME = "Clean Machine"
  const PRIMARY_COLOR = "#0F2C52" // Navy dark color from your theme
  const ACCENT_COLOR = "#BFA36F" // Gold color from your theme

  // Create and inject CSS
  const style = document.createElement("style")
  style.innerHTML = `
    .cm-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    .cm-chat-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${PRIMARY_COLOR};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    .cm-chat-button:hover {
      transform: scale(1.05);
    }
    .cm-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
    .cm-chat-window.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    .cm-chat-header {
      background-color: ${PRIMARY_COLOR};
      color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cm-chat-title {
      font-weight: 600;
      font-size: 16px;
    }
    .cm-chat-close {
      cursor: pointer;
      font-size: 18px;
    }
    .cm-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .cm-message {
      max-width: 80%;
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.4;
    }
    .cm-bot-message {
      background-color: #f0f0f0;
      align-self: flex-start;
      border-bottom-left-radius: 0;
    }
    .cm-user-message {
      background-color: ${PRIMARY_COLOR};
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 0;
    }
    .cm-chat-input-container {
      padding: 15px;
      border-top: 1px solid #eaeaea;
      display: flex;
      gap: 10px;
    }
    .cm-chat-input {
      flex: 1;
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
      font-size: 14px;
    }
    .cm-chat-input:focus {
      border-color: ${PRIMARY_COLOR};
    }
    .cm-send-button {
      background-color: ${PRIMARY_COLOR};
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .cm-send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .cm-loading {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 10px;
      align-self: flex-start;
      font-size: 14px;
    }
    .cm-dot {
      width: 8px;
      height: 8px;
      background-color: #666;
      border-radius: 50%;
      animation: cm-pulse 1.5s infinite;
    }
    .cm-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .cm-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes cm-pulse {
      0%, 100% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
    }
    .cm-message-icon {
      display: inline-flex;
      align-items: center;
      margin-right: 5px;
    }
    .cm-message-icon svg {
      width: 16px;
      height: 16px;
      fill: ${ACCENT_COLOR};
      stroke: ${ACCENT_COLOR};
    }
    .cm-message-type {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      color: ${ACCENT_COLOR};
      margin-bottom: 5px;
      display: flex;
      align-items: center;
    }
    .cm-error-message {
      background-color: #FEE2E2;
      border: 1px solid #FECACA;
      color: #B91C1C;
    }
    .cm-powered-by {
      font-size: 10px;
      text-align: center;
      color: #999;
      padding: 5px 0;
    }
  `
  document.head.appendChild(style)

  // Create chat widget HTML
  const chatWidgetHTML = `
    <div class="cm-chat-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div class="cm-chat-window">
      <div class="cm-chat-header">
        <div class="cm-chat-title">${COMPANY_NAME} Virtual Concierge</div>
        <div class="cm-chat-close">×</div>
      </div>
      <div class="cm-chat-messages"></div>
      <div class="cm-chat-input-container">
        <input type="text" class="cm-chat-input" placeholder="Type your message...">
        <button class="cm-send-button" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <div class="cm-powered-by">Powered by Clean Machine</div>
    </div>
  `

  // Create widget container
  const widgetContainer = document.createElement("div")
  widgetContainer.className = "cm-chat-widget"
  widgetContainer.innerHTML = chatWidgetHTML
  document.body.appendChild(widgetContainer)

  // Get elements
  const chatButton = widgetContainer.querySelector(".cm-chat-button")
  const chatWindow = widgetContainer.querySelector(".cm-chat-window")
  const chatClose = widgetContainer.querySelector(".cm-chat-close")
  const messagesContainer = widgetContainer.querySelector(".cm-chat-messages")
  const chatInput = widgetContainer.querySelector(".cm-chat-input")
  const sendButton = widgetContainer.querySelector(".cm-send-button")

  // Chat state
  let isOpen = false
  let isLoading = false
  const conversationHistory = []

  // Icons for message types
  const icons = {
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    appointment: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    service: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    payment: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    welcome: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  }

  // Add welcome message
  function addWelcomeMessage() {
    const welcomeMessage = document.createElement("div")
    welcomeMessage.className = "cm-message cm-bot-message"
    welcomeMessage.innerHTML = `
      <div class="cm-message-type">
        ${icons.welcome}
        <span>Welcome</span>
      </div>
      <div>Welcome to Clean Machine Virtual Concierge. How may I help you today?</div>
    `
    messagesContainer.appendChild(welcomeMessage)
    conversationHistory.push("Bot: Welcome to Clean Machine Virtual Concierge. How may I help you today?")
  }

  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen
    chatWindow.classList.toggle("active", isOpen)

    if (isOpen && messagesContainer.children.length === 0) {
      addWelcomeMessage()
    }
  }

  // Determine message type based on content
  function getMessageType(content) {
    const lowerContent = content.toLowerCase()

    if (
      lowerContent.includes("location") ||
      lowerContent.includes("area") ||
      lowerContent.includes("service radius") ||
      lowerContent.includes("address")
    ) {
      return "location"
    } else if (
      lowerContent.includes("appointment") ||
      lowerContent.includes("schedule") ||
      lowerContent.includes("booking") ||
      lowerContent.includes("availability")
    ) {
      return "appointment"
    } else if (
      lowerContent.includes("service") ||
      lowerContent.includes("package") ||
      lowerContent.includes("detail") ||
      lowerContent.includes("price") ||
      lowerContent.includes("cost")
    ) {
      return "service"
    } else if (
      lowerContent.includes("payment") ||
      lowerContent.includes("paid") ||
      lowerContent.includes("transaction") ||
      lowerContent.includes("credit card") ||
      lowerContent.includes("pay")
    ) {
      return "payment"
    }

    return "standard"
  }

  // Add message to chat
  function addMessage(text, isUser, type = "standard") {
    const message = document.createElement("div")
    message.className = `cm-message ${isUser ? "cm-user-message" : "cm-bot-message"}`

    if (!isUser && type !== "standard") {
      const typeLabel =
        type === "location"
          ? "Service Area"
          : type === "appointment"
            ? "Scheduling"
            : type === "service"
              ? "Services"
              : type === "payment"
                ? "Payment"
                : type === "error"
                  ? "Connection Issue"
                  : ""

      message.innerHTML = `
        <div class="cm-message-type">
          ${icons[type] || ""}
          <span>${typeLabel}</span>
        </div>
        <div>${text}</div>
      `
    } else {
      message.textContent = text
    }

    messagesContainer.appendChild(message)
    messagesContainer.scrollTop = messagesContainer.scrollHeight

    if (isUser) {
      conversationHistory.push(`User: ${text}`)
    } else {
      conversationHistory.push(`Bot: ${text}`)
    }
  }

  // Show loading indicator
  function showLoading() {
    isLoading = true
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "cm-loading"
    loadingIndicator.innerHTML = `
      <div class="cm-dot"></div>
      <div class="cm-dot"></div>
      <div class="cm-dot"></div>
    `
    messagesContainer.appendChild(loadingIndicator)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    return loadingIndicator
  }

  // Send message to webhook
  async function sendMessage(text) {
    if (!text.trim()) return

    // Add user message to chat
    addMessage(text, true)

    // Clear input
    chatInput.value = ""
    sendButton.disabled = true

    // Show loading indicator
    const loadingIndicator = showLoading()

    try {
      // Generate or retrieve a session ID
      let sessionId = localStorage.getItem("chatSessionId")
      if (!sessionId) {
        sessionId = `embed_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        localStorage.setItem("chatSessionId", sessionId)
      }

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          phoneNumber: sessionId, // This is what n8n expects for session tracking
          message: text.trim(), // Use 'message' instead of 'prompt'
          history: conversationHistory.slice(-5), // Send last 5 messages for context
        }),
      })

      const data = await response.json()

      // Remove loading indicator
      loadingIndicator.remove()
      isLoading = false

      // Add bot response to chat
      const botResponse =
        data.response || data.message || data.text || data.content || "I'm sorry, I couldn't process your request."
      const messageType = getMessageType(botResponse)
      addMessage(botResponse, false, messageType)
    } catch (error) {
      console.error("Error sending message:", error)

      // Remove loading indicator
      loadingIndicator.remove()
      isLoading = false

      // Add error message
      addMessage(
        "I apologize, but I'm having trouble connecting to our systems. Please try again later or contact us directly.",
        false,
        "error",
      )
    }
  }

  // Event listeners
  chatButton.addEventListener("click", toggleChat)
  chatClose.addEventListener("click", () => {
    isOpen = false
    chatWindow.classList.remove("active")
  })

  chatInput.addEventListener("input", () => {
    sendButton.disabled = !chatInput.value.trim() || isLoading
  })

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !sendButton.disabled) {
      sendMessage(chatInput.value)
    }
  })

  sendButton.addEventListener("click", () => {
    if (!sendButton.disabled) {
      sendMessage(chatInput.value)
    }
  })
})()
