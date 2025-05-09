"use server"

// Remove the redirect import
// import { redirect } from "next/navigation"

export async function submitAppointment(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const vehicleMake = formData.get("vehicleMake") as string
    const vehicleModel = formData.get("vehicleModel") as string
    const vehicleYear = formData.get("vehicleYear") as string
    const vehicleColor = formData.get("vehicleColor") as string
    const serviceType = formData.get("serviceType") as string
    const preferredDate = formData.get("preferredDate") as string
    const preferredTime = formData.get("preferredTime") as string
    const specialRequests = formData.get("specialRequests") as string

    // Construct email content
    const emailContent = `
    New Appointment Request:
    
    Customer Information:
    Name: ${firstName} ${lastName}
    Email: ${email}
    Phone: ${phone}
    Service Address: ${address}
    
    Vehicle Information:
    Make: ${vehicleMake}
    Model: ${vehicleModel}
    Year: ${vehicleYear}
    Color: ${vehicleColor}
    
    Service Details:
    Service Type: ${serviceType}
    Preferred Date: ${preferredDate}
    Preferred Time: ${preferredTime}
    
    Special Requests:
    ${specialRequests || "None"}
  `

    // In a production environment, you would use an email service like SendGrid, Nodemailer, etc.
    // For example with SendGrid:
    //
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: 'cleanmachinetulsa@gmail.com' }] }],
    //     from: { email: 'noreply@cleanmachinemobile.com', name: 'Clean Machine Website' },
    //     subject: 'New Appointment Request',
    //     content: [{ type: 'text/plain', value: emailContent }],
    //   }),
    // })

    console.log("Email would be sent to: cleanmachinetulsa@gmail.com")
    console.log("Email content:", emailContent)

    // Return success response with redirect URL instead of using redirect()
    return { success: true, redirectUrl: "/thank-you" }
  } catch (error) {
    console.error("Error submitting appointment:", error)
    return { success: false, message: "There was an error submitting your appointment request. Please try again." }
  }
}
