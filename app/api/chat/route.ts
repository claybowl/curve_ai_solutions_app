// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// N8N Chat Webhook URL
const N8N_CHAT_WEBHOOK_URL = 'https://claydonjon.app.n8n.cloud/webhook/df0bb2a4-cdb1-40ae-a4bd-5401e43164a3/chat'

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

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage?.role === 'user' ? lastMessage.content : ''

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'No user message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Prepare the payload for n8n webhook
    // Format: Include full conversation history or just the latest message
    // Adjust this based on your n8n workflow's expected format
    const n8nPayload = {
      message: userMessage,
      messages: messages,
      conversationHistory: messages.slice(0, -1), // All messages except the last one
      timestamp: new Date().toISOString(),
    }

    // Forward request to n8n webhook
    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('N8N webhook error:', response.status, errorText)
      return new Response(JSON.stringify({ 
        error: 'Failed to get response from chat agent',
        details: `Webhook returned ${response.status}: ${errorText}`
      }), {
        status: response.status || 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if response is streaming (text/stream, text/event-stream, etc.)
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('stream') || contentType.includes('text/event-stream')) {
      // If n8n returns a stream, forward it directly
      return new Response(response.body, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Handle JSON response from n8n
    let responseData
    const responseText = await response.text()
    
    console.log('N8N response text:', responseText.substring(0, 200)) // Log first 200 chars
    
    try {
      responseData = JSON.parse(responseText)
      console.log('N8N parsed response:', typeof responseData, Array.isArray(responseData))
    } catch {
      // If response is not JSON, treat it as plain text
      responseData = responseText
      console.log('N8N response is plain text')
    }
    
    // Extract the message from n8n response - ensure it's always a string
    // Adjust these keys based on your n8n workflow's response structure
    let aiResponse: string
    
    // Check for error responses first
    if (typeof responseData === 'object' && responseData !== null && responseData.error) {
      // n8n returned an error - format it nicely for the user
      const errorMessage = typeof responseData.error === 'string' 
        ? responseData.error 
        : responseData.error.message || JSON.stringify(responseData.error)
      aiResponse = `I encountered an error: ${errorMessage}. Please try again or contact support if the issue persists.`
      console.error('N8N workflow error:', responseData.error)
    } else if (typeof responseData === 'string') {
      aiResponse = responseData
    } else if (Array.isArray(responseData)) {
      // If n8n returns an array, try to extract text from first item or stringify
      const firstItem = responseData[0]
      if (typeof firstItem === 'string') {
        aiResponse = firstItem
      } else if (typeof firstItem === 'object' && firstItem !== null) {
        // Check for error in array item
        if (firstItem.error) {
          const errorMsg = typeof firstItem.error === 'string' ? firstItem.error : firstItem.error.message
          aiResponse = `Error: ${errorMsg}`
        } else {
          aiResponse = firstItem.message || firstItem.text || firstItem.content || JSON.stringify(firstItem)
        }
      } else {
        aiResponse = JSON.stringify(responseData)
      }
    } else if (typeof responseData === 'object' && responseData !== null) {
      // Try common response keys
      aiResponse = responseData.message || 
                  responseData.response || 
                  responseData.text || 
                  responseData.content || 
                  responseData.answer ||
                  responseData.output ||
                  responseData.data?.message ||
                  responseData.data?.text ||
                  responseData.data?.content ||
                  (responseData.data && typeof responseData.data === 'string' ? responseData.data : null) ||
                  null
      
      // If still not found, try to stringify intelligently
      if (!aiResponse) {
        // If there's a data property that's an object, try to extract from it
        if (responseData.data && typeof responseData.data === 'object') {
          aiResponse = responseData.data.message || responseData.data.text || JSON.stringify(responseData.data)
        } else {
          // Last resort: stringify the whole object
          aiResponse = JSON.stringify(responseData)
        }
      }
    } else {
      aiResponse = String(responseData || 'No response from agent')
    }

    // Ensure we have a valid string - this is critical
    if (typeof aiResponse !== 'string') {
      console.warn('aiResponse is not a string:', typeof aiResponse, aiResponse)
      aiResponse = String(aiResponse)
    }
    
    console.log('Final aiResponse type:', typeof aiResponse, 'Length:', aiResponse.length)

    // Format as AI SDK data stream format that useChat expects
    // The AI SDK expects a data stream with format: "0:{"text":"..."}\n"
    // Each chunk must have the format: "<id>:<json>\n"
    const encoder = new TextEncoder()
    
    // Ensure aiResponse is a clean string and handle any special characters
    let cleanResponse = String(aiResponse || '').trim()
    
    // If empty, provide a default message
    if (!cleanResponse) {
      cleanResponse = 'I received your message but got an empty response from the agent.'
    }
    
    // Create the stream with proper AI SDK format
    const stream = new ReadableStream({
      start(controller) {
        try {
          // AI SDK data stream format: "0:{"text":"..."}\n"
          // The "text" property MUST be a string
          const textDelta = { text: String(cleanResponse) }
          const jsonString = JSON.stringify(textDelta)
          const chunk = `0:${jsonString}\n`
          
          // Encode and send
          controller.enqueue(encoder.encode(chunk))
          controller.close()
        } catch (error) {
          console.error('Error encoding stream:', error, 'Response:', cleanResponse)
          // Fallback: manually construct a safe JSON string
          try {
            const safeText = String(cleanResponse)
              .replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r')
              .replace(/\t/g, '\\t')
            
            const safeChunk = `0:{"text":"${safeText}"}\n`
            controller.enqueue(encoder.encode(safeChunk))
          } catch (fallbackError) {
            console.error('Fallback encoding also failed:', fallbackError)
            // Last resort: send a simple error message
            const errorChunk = `0:{"text":"Sorry, there was an error processing the response."}\n`
            controller.enqueue(encoder.encode(errorChunk))
          }
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
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
