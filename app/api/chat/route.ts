import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    console.log("Request body:", JSON.stringify(body))

    // Check if we have a message in any expected format
    const userMessage = body.prompt || body.message || body.text || body.content || ""

    if (!userMessage) {
      console.error("No message content found in request body")
      return NextResponse.json(
        {
          response: "I'm sorry, I couldn't understand your message. Could you please try again?",
          error: "No message content specified",
        },
        { status: 400 },
      )
    }

    console.log("Processing message:", userMessage)

    // Simple keyword-based responses - these will work even if the external API fails
    if (userMessage.toLowerCase().includes("service area") || userMessage.toLowerCase().includes("location")) {
      return NextResponse.json({
        response:
          "Clean Machine serves Tulsa and surrounding areas within a 25-mile radius. May I verify your address to confirm you're within our service area?",
      })
    } else if (userMessage.toLowerCase().includes("appointment") || userMessage.toLowerCase().includes("schedule")) {
      return NextResponse.json({
        response:
          "I'd be happy to help you schedule an appointment. We currently have availability this week on Thursday and Friday. What day works best for you?",
      })
    } else if (userMessage.toLowerCase().includes("price") || userMessage.toLowerCase().includes("cost")) {
      return NextResponse.json({
        response:
          "Our premium detailing packages start at $150 for our basic service. For a full vehicle detail including interior and exterior, prices range from $225-300 depending on vehicle size.",
      })
    }

    // Get the session ID from the request or generate a new one
    const sessionId = body.sessionId || `web_user_${Date.now()}`

    // Format the request according to what n8n expects
    const webhookPayload = {
      phoneNumber: sessionId, // This is what n8n uses for session tracking
      message: userMessage, // Use 'message' instead of 'prompt'
      history: body.history || [],
    }

    console.log("Sending to webhook:", JSON.stringify(webhookPayload))

    // Call the webhook with the correct format
    try {
      const response = await fetch(
        "https://claydonjon.app.n8n.cloud/webhook/226821eb-fb06-4837-a708-36d2166f5d29/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        },
      )

      if (response.ok) {
        const data = await response.json()
        console.log("Webhook response:", data)
        return NextResponse.json(data)
      } else {
        const errorText = await response.text()
        console.error("Webhook error:", errorText)
        throw new Error(`Webhook error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("Webhook call failed:", error)
      // Fall through to default response
    }

    // Default fallback response
    return NextResponse.json({
      response: "I'm here to assist with all your premium mobile detailing needs. How may I help you today?",
    })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        response:
          "I apologize, but I'm having trouble processing your request. Please try again or contact us directly.",
        error: "Failed to process your request",
      },
      { status: 500 },
    )
  }
}
