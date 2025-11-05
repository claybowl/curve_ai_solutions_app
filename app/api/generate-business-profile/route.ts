import { NextRequest, NextResponse } from 'next/server'

interface BusinessProfileInputs {
  monthlyBookings: number
  avgJobValue: number
  schedulingTime: number
  hourlyRate: number
  missedCallsPerWeek: number
  noShowRate: number
  conversionRate: number
}

interface BusinessProfileAssumptions {
  callToBookingRate: number
  voicemailCallbackRate: number
  monthlyLeads: number
  targetConversionRate: number
  serviceProCaptureRate: number
  schedulingTimeReduction: number
  targetNoShowRate: number
  conversionLift: number
  afterHoursBookingRate: number
}

interface BusinessProfileResponse {
  inputs: BusinessProfileInputs
  assumptions: BusinessProfileAssumptions
  reasoning?: string
}

export async function POST(request: NextRequest) {
  try {
    const { businessDescription } = await request.json()

    if (!businessDescription || businessDescription.trim().length === 0) {
      return NextResponse.json(
        { error: 'Business description is required' },
        { status: 400 }
      )
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    // Create a detailed prompt for the AI to generate realistic business metrics
    const systemPrompt = `You are a business analyst specializing in service-based businesses. Based on a business description, generate realistic operational metrics and assumptions for a ROI calculator.

You must return ONLY valid JSON in this exact format:
{
  "inputs": {
    "monthlyBookings": <number between 10-375>,
    "avgJobValue": <number between 50-1500>,
    "schedulingTime": <number between 0-30>,
    "hourlyRate": <number between 20-115>,
    "missedCallsPerWeek": <number between 0-75>,
    "noShowRate": <number between 0-40>,
    "conversionRate": <number between 10-100>
  },
  "assumptions": {
    "callToBookingRate": <number between 10-100>,
    "voicemailCallbackRate": <number between 0-100>,
    "monthlyLeads": <number between 20-750>,
    "targetConversionRate": <number between 50-100>,
    "serviceProCaptureRate": <number between 80-100>,
    "schedulingTimeReduction": <number between 50-100>,
    "targetNoShowRate": <number between 0-15>,
    "conversionLift": <number between 5-40>,
    "afterHoursBookingRate": <number between 5-40>
  },
  "reasoning": "<brief explanation of the assumptions>"
}

Consider:
- Business size (small = lower bookings, medium = moderate, large = higher)
- Industry type (auto detailing, HVAC, plumbing, etc.)
- Typical job values for that industry
- Common operational challenges
- Realistic improvement potential with automation

Return ONLY the JSON object, no markdown, no explanations outside the JSON.`

    const userPrompt = `Analyze this business and generate realistic metrics: "${businessDescription}"

Return the JSON object with realistic values based on the business type and size described.`

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'ServicePro ROI Calculator'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5', // Cost-effective and fast
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate business profile' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response (handle markdown code blocks if present)
    let parsed: BusinessProfileResponse
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                        aiResponse.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        parsed = JSON.parse(aiResponse)
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      return NextResponse.json(
        { error: 'Failed to parse AI response', rawResponse: aiResponse },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (!parsed.inputs || !parsed.assumptions) {
      return NextResponse.json(
        { error: 'Invalid response structure from AI' },
        { status: 500 }
      )
    }

    // Validate and clamp values to ensure they're within expected ranges
    const validateAndClamp = (value: number, min: number, max: number): number => {
      if (typeof value !== 'number' || isNaN(value)) {
        return min
      }
      return Math.max(min, Math.min(max, Math.round(value)))
    }

    const validatedProfile: BusinessProfileResponse = {
      inputs: {
        monthlyBookings: validateAndClamp(parsed.inputs.monthlyBookings, 10, 375),
        avgJobValue: validateAndClamp(parsed.inputs.avgJobValue, 50, 1500),
        schedulingTime: validateAndClamp(parsed.inputs.schedulingTime, 0, 30),
        hourlyRate: validateAndClamp(parsed.inputs.hourlyRate, 20, 115),
        missedCallsPerWeek: validateAndClamp(parsed.inputs.missedCallsPerWeek, 0, 75),
        noShowRate: validateAndClamp(parsed.inputs.noShowRate, 0, 40),
        conversionRate: validateAndClamp(parsed.inputs.conversionRate, 10, 100)
      },
      assumptions: {
        callToBookingRate: validateAndClamp(parsed.assumptions.callToBookingRate, 10, 100),
        voicemailCallbackRate: validateAndClamp(parsed.assumptions.voicemailCallbackRate, 0, 100),
        monthlyLeads: validateAndClamp(parsed.assumptions.monthlyLeads, 20, 750),
        targetConversionRate: validateAndClamp(parsed.assumptions.targetConversionRate, 50, 100),
        serviceProCaptureRate: validateAndClamp(parsed.assumptions.serviceProCaptureRate, 80, 100),
        schedulingTimeReduction: validateAndClamp(parsed.assumptions.schedulingTimeReduction, 50, 100),
        targetNoShowRate: validateAndClamp(parsed.assumptions.targetNoShowRate, 0, 15),
        conversionLift: validateAndClamp(parsed.assumptions.conversionLift, 5, 40),
        afterHoursBookingRate: validateAndClamp(parsed.assumptions.afterHoursBookingRate, 5, 40)
      },
      reasoning: parsed.reasoning
    }

    return NextResponse.json(validatedProfile)

  } catch (error) {
    console.error('Error generating business profile:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

