import { NextResponse } from "next/server"

// This is a proxy endpoint that forwards requests to the webhook
// It helps with CORS issues and keeps your webhook URL private
export async function POST(request: Request) {
  try {
    // Get the origin of the request for CORS
    const origin = request.headers.get("origin") || "*"

    const body = await request.json()

    // Validate the request
    if (!body.prompt) {
      return new NextResponse(
        JSON.stringify({
          response: "I'm sorry, I couldn't understand your message. Could you please try again?",
          error: "No prompt specified",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }

    // Get or generate a session ID
    const sessionId = body.sessionId || `embed_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Forward the request to the webhook with the correct format
    const response = await fetch("https://claydonjon.app.n8n.cloud/webhook/226821eb-fb06-4837-a708-36d2166f5d29/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: sessionId, // This is what n8n uses for session tracking
        message: body.prompt || body.message, // Use either prompt or message
        history: body.history || [],
      }),
    })

    if (response.ok) {
      const data = await response.json()

      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    } else {
      const errorText = await response.text()
      console.error("Webhook error:", errorText)

      return new NextResponse(
        JSON.stringify({
          response: "I apologize, but I'm having trouble processing your request. Please try again later.",
          error: "Webhook error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }
  } catch (error) {
    console.error("API route error:", error)

    // Get the origin of the request for CORS
    const origin = request.headers.get("origin") || "*"

    return new NextResponse(
      JSON.stringify({
        response: "I apologize, but I'm having trouble processing your request. Please try again later.",
        error: "Failed to process your request",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "*"

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400", // 24 hours
    },
  })
}
