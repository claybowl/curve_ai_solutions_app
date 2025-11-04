import { NextResponse } from "next/server"
import { sendNotificationEmail, formatConsultationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, companyName, industry, employeeCount, message } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !companyName || !industry || !employeeCount || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Send notification email
    try {
      const emailHtml = formatConsultationEmail({
        firstName,
        lastName,
        email,
        phone,
        companyName,
        industry,
        employeeCount,
        message,
        submittedAt: new Date().toISOString()
      })

      await sendNotificationEmail({
        subject: `New Consultation Request from ${firstName} ${lastName}`,
        html: emailHtml,
        from: 'consultations@curveai.com'
      })

      console.log('✅ Consultation notification email sent successfully')
    } catch (emailError) {
      console.error('❌ Error sending consultation email:', emailError)
      // Don't fail the entire request if email fails
    }

    // TODO: Store in database when ready
    // const result = await sql`
    //   INSERT INTO consultation_requests (
    //     first_name,
    //     last_name,
    //     email,
    //     phone,
    //     company_name,
    //     industry,
    //     employee_count,
    //     message,
    //     status
    //   )
    //   VALUES (
    //     ${firstName},
    //     ${lastName},
    //     ${email},
    //     ${phone},
    //     ${companyName},
    //     ${industry},
    //     ${employeeCount},
    //     ${message},
    //     'pending'
    //   )
    //   RETURNING id
    // `

    return NextResponse.json({
      success: true,
      message: "Consultation request submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting consultation request:", error)
    return NextResponse.json({ success: false, message: "Failed to submit request" }, { status: 500 })
  }
}
