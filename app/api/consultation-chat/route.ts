/**
 * Context-Aware AI Chatbot API for Consultations
 * 
 * This endpoint provides AI assistance during consultation sessions.
 * It injects relevant context from:
 * - Consultation details (subject, type, industry)
 * - Recent chat messages between participants
 * - Sandbox output (if active)
 * - Shared files
 * - User assessment scores
 */

import { getCurrentUserServer } from "@/lib/supabase-server"
import { sql } from "@/lib/db"

export const maxDuration = 60

// Types for context building
interface ConsultationContext {
  consultation: {
    id: string
    subject: string
    description: string
    type: string
    urgency: string
    industry?: string
    current_ai_usage?: string
    specific_challenges?: string
    status: string
  }
  messages: Array<{
    sender_name: string
    content: string
    type: string
    created_at: string
  }>
  sandbox?: {
    status: string
    output?: string
  }
  files: Array<{
    filename: string
    mime_type: string
  }>
  user_assessment?: {
    total_score: number
    ai_readiness: string
    strengths?: string[]
    areas_for_improvement?: string[]
  }
}

/**
 * Build context from consultation data
 */
async function buildConsultationContext(
  consultationId: string,
  userId: string
): Promise<ConsultationContext | null> {
  try {
    // Get consultation details
    const consultationResult = await sql.query(
      `SELECT 
        c.id, c.subject, c.description, c.consultation_type, c.urgency,
        c.industry, c.current_ai_usage, c.specific_challenges, c.status,
        c.user_id, c.assigned_consultant_id
       FROM consultations c
       WHERE c.id = $1`,
      [consultationId]
    )

    if (consultationResult.rows.length === 0) {
      return null
    }

    const consultation = consultationResult.rows[0]

    // Verify user has access
    const hasAccess =
      consultation.user_id === userId ||
      consultation.assigned_consultant_id === userId

    if (!hasAccess) {
      return null
    }

    // Get recent messages (last 20)
    const messagesResult = await sql.query(
      `SELECT 
        cm.content, cm.message_type, cm.created_at,
        p.first_name, p.last_name
       FROM consultation_messages cm
       LEFT JOIN profiles p ON cm.sender_id = p.id
       WHERE cm.consultation_id = $1
       ORDER BY cm.created_at DESC
       LIMIT 20`,
      [consultationId]
    )

    const messages = messagesResult.rows.map((m: { content: string; message_type: string; created_at: string; first_name?: string; last_name?: string }) => ({
      sender_name: m.first_name && m.last_name 
        ? `${m.first_name} ${m.last_name}` 
        : "Participant",
      content: m.content,
      type: m.message_type,
      created_at: m.created_at,
    })).reverse() // Oldest first

    // Get sandbox status if exists
    let sandbox: ConsultationContext["sandbox"] | undefined
    const sandboxResult = await sql.query(
      `SELECT status, error_message 
       FROM sandbox_sessions 
       WHERE consultation_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [consultationId]
    )
    if (sandboxResult.rows.length > 0) {
      sandbox = {
        status: sandboxResult.rows[0].status,
        output: sandboxResult.rows[0].error_message,
      }
    }

    // Get shared files
    const filesResult = await sql.query(
      `SELECT filename, mime_type 
       FROM consultation_files 
       WHERE consultation_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [consultationId]
    )
    const files = filesResult.rows.map((f: { filename: string; mime_type: string }) => ({
      filename: f.filename,
      mime_type: f.mime_type,
    }))

    // Get user assessment (if this is the client)
    let userAssessment: ConsultationContext["user_assessment"] | undefined
    const assessmentResult = await sql.query(
      `SELECT 
        total_score, ai_readiness_level,
        strategic_strengths, improvement_priorities
       FROM assessments 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [consultation.user_id]
    )
    if (assessmentResult.rows.length > 0) {
      const a = assessmentResult.rows[0]
      userAssessment = {
        total_score: a.total_score,
        ai_readiness: a.ai_readiness_level,
        strengths: a.strategic_strengths,
        areas_for_improvement: a.improvement_priorities,
      }
    }

    return {
      consultation: {
        id: consultation.id,
        subject: consultation.subject,
        description: consultation.description,
        type: consultation.consultation_type || "general",
        urgency: consultation.urgency,
        industry: consultation.industry,
        current_ai_usage: consultation.current_ai_usage,
        specific_challenges: consultation.specific_challenges,
        status: consultation.status,
      },
      messages,
      sandbox,
      files,
      user_assessment: userAssessment,
    }
  } catch (error) {
    console.error("Error building consultation context:", error)
    return null
  }
}

/**
 * Build the system prompt with consultation context
 */
function buildSystemPrompt(context: ConsultationContext): string {
  const parts: string[] = [
    "You are an AI assistant helping during a consultation session at Donjon Intelligence Systems.",
    "Your role is to provide helpful, accurate information to support the conversation between the consultant and client.",
    "Be professional, concise, and focus on actionable insights.",
    "",
    "## Current Consultation Context",
    `- **Subject**: ${context.consultation.subject}`,
    `- **Type**: ${context.consultation.type}`,
    `- **Urgency**: ${context.consultation.urgency}`,
    `- **Status**: ${context.consultation.status}`,
  ]

  if (context.consultation.description) {
    parts.push(`- **Description**: ${context.consultation.description}`)
  }

  if (context.consultation.industry) {
    parts.push(`- **Industry**: ${context.consultation.industry}`)
  }

  if (context.consultation.current_ai_usage) {
    parts.push(`- **Current AI Usage**: ${context.consultation.current_ai_usage}`)
  }

  if (context.consultation.specific_challenges) {
    parts.push(`- **Specific Challenges**: ${context.consultation.specific_challenges}`)
  }

  // Add assessment context
  if (context.user_assessment) {
    parts.push(
      "",
      "## Client's AI Readiness Assessment",
      `- **Total Score**: ${context.user_assessment.total_score}/100`,
      `- **Readiness Level**: ${context.user_assessment.ai_readiness}`
    )
    if (context.user_assessment.strengths?.length) {
      parts.push(`- **Strengths**: ${context.user_assessment.strengths.join(", ")}`)
    }
    if (context.user_assessment.areas_for_improvement?.length) {
      parts.push(`- **Areas for Improvement**: ${context.user_assessment.areas_for_improvement.join(", ")}`)
    }
  }

  // Add recent conversation context
  if (context.messages.length > 0) {
    parts.push(
      "",
      "## Recent Conversation (for context only - do not repeat):",
      ...context.messages.slice(-10).map(
        (m) => `[${m.sender_name}]: ${m.content.substring(0, 200)}${m.content.length > 200 ? "..." : ""}`
      )
    )
  }

  // Add sandbox context
  if (context.sandbox) {
    parts.push(
      "",
      "## Sandbox Status",
      `The coding sandbox is currently: ${context.sandbox.status}`,
      context.sandbox.output ? `Recent output: ${context.sandbox.output}` : ""
    )
  }

  // Add files context
  if (context.files.length > 0) {
    parts.push(
      "",
      "## Shared Files",
      ...context.files.map((f) => `- ${f.filename} (${f.mime_type})`)
    )
  }

  // Guidelines
  parts.push(
    "",
    "## Guidelines",
    "1. You are visible to both parties but should NOT interrupt their conversation",
    "2. Only respond when directly asked a question",
    "3. Base your responses on the context provided",
    "4. If asked about something outside your knowledge, say so clearly",
    "5. Keep responses concise unless detail is specifically requested",
    "6. Do not share sensitive information or make promises on behalf of Donjon",
    "7. If code examples are needed, provide them formatted with proper syntax highlighting markers"
  )

  return parts.filter(Boolean).join("\n")
}

// N8N Chat Webhook URL (reusing existing infrastructure)
const N8N_CHAT_WEBHOOK_URL = process.env.N8N_CONSULTATION_CHAT_WEBHOOK || 
  'https://claydonjon.app.n8n.cloud/webhook/df0bb2a4-cdb1-40ae-a4bd-5401e43164a3/chat'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const body = await req.json()
    const { messages, consultationId } = body

    // Validate
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!consultationId) {
      return new Response(JSON.stringify({ error: "consultationId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Build context
    const context = await buildConsultationContext(consultationId, user.id)
    if (!context) {
      return new Response(JSON.stringify({ error: "Consultation not found or access denied" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context)

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage?.role === "user" ? lastMessage.content : ""

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "No user message provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Prepare payload for n8n webhook with context
    const n8nPayload = {
      message: userMessage,
      messages: messages,
      conversationHistory: messages.slice(0, -1),
      timestamp: new Date().toISOString(),
      systemPrompt: systemPrompt,
      consultationId: consultationId,
      userId: user.id,
      context: {
        subject: context.consultation.subject,
        type: context.consultation.type,
        industry: context.consultation.industry,
      },
    }

    // Forward to n8n webhook
    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(n8nPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("N8N webhook error:", response.status, errorText)
      return new Response(
        JSON.stringify({
          error: "Failed to get response from AI assistant",
          details: `Webhook returned ${response.status}`,
        }),
        {
          status: response.status || 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Handle streaming response
    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("stream") || contentType.includes("text/event-stream")) {
      return new Response(response.body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    // Handle JSON response
    let responseData
    const responseText = await response.text()

    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = responseText
    }

    // Extract AI response
    let aiResponse: string
    if (typeof responseData === "object" && responseData !== null && responseData.error) {
      aiResponse = `I encountered an error processing your request. Please try rephrasing your question.`
    } else if (typeof responseData === "string") {
      aiResponse = responseData
    } else if (Array.isArray(responseData)) {
      const firstItem = responseData[0]
      aiResponse =
        typeof firstItem === "string"
          ? firstItem
          : firstItem?.message || firstItem?.text || firstItem?.content || JSON.stringify(firstItem)
    } else if (typeof responseData === "object" && responseData !== null) {
      aiResponse =
        responseData.message ||
        responseData.response ||
        responseData.text ||
        responseData.content ||
        responseData.answer ||
        responseData.output ||
        JSON.stringify(responseData)
    } else {
      aiResponse = String(responseData || "No response from AI assistant")
    }

    // Format as AI SDK stream
    const encoder = new TextEncoder()
    const cleanResponse = String(aiResponse || "").trim() || "I received your message but couldn't generate a response."

    const stream = new ReadableStream({
      start(controller) {
        try {
          const textDelta = { text: cleanResponse }
          const jsonString = JSON.stringify(textDelta)
          const chunk = `0:${jsonString}\n`
          controller.enqueue(encoder.encode(chunk))
          controller.close()
        } catch (error) {
          console.error("Error encoding stream:", error)
          const errorChunk = `0:{"text":"Sorry, there was an error processing the response."}\n`
          controller.enqueue(encoder.encode(errorChunk))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Consultation Chat API Error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
