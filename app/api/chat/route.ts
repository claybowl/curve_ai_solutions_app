import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Extract the messages from the body of the request
    const { messages } = await req.json()

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if XAI API key is configured
    if (!process.env.XAI_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'XAI API key not configured. Please add XAI_API_KEY to your environment variables.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Call the Grok model
    const result = await streamText({
      model: xai("grok-beta"),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Respond with the stream
    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
