import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, companyName, industry, employeeCount, message } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !companyName || !industry || !employeeCount || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // In a real implementation, you would store the consultation request in your database
    // For example:
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

    // You might also want to send notification emails
    // await sendNotificationEmail({
    //   to: "team@curveai.com",
    //   subject: "New Consultation Request",
    //   text: `New consultation request from ${firstName} ${lastName} at ${companyName}`
    // });

    // await sendConfirmationEmail({
    //   to: email,
    //   subject: "We've Received Your Consultation Request",
    //   text: `Thank you for your interest in Curve AI Solutions. We'll be in touch shortly.`
    // });

    return NextResponse.json({
      success: true,
      message: "Consultation request submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting consultation request:", error)
    return NextResponse.json({ success: false, message: "Failed to submit request" }, { status: 500 })
  }
}
