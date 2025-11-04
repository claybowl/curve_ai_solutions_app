/**
 * Email Notification Service
 * 
 * Sends email notifications using Resend or SendGrid.
 * Sends to both claydonjon@proton.me and donjon.systems@gmail.com
 */

const NOTIFICATION_EMAILS = [
  'claydonjon@proton.me',
  'donjon.systems@gmail.com'
]

interface EmailOptions {
  subject: string
  html: string
  from?: string
}

/**
 * Send an email notification to the configured recipients
 */
export async function sendNotificationEmail(options: EmailOptions): Promise<void> {
  const { subject, html, from = 'notifications@curveai.com' } = options

  try {
    // Try using Resend API first (preferred)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from,
        to: NOTIFICATION_EMAILS,
        subject,
        html
      })
      
      console.log('✅ Email sent successfully via Resend')
      return
    }
    
    // Fallback to SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = await import('@sendgrid/mail')
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY)
      
      await sgMail.default.send({
        to: NOTIFICATION_EMAILS,
        from,
        subject,
        html
      })
      
      console.log('✅ Email sent successfully via SendGrid')
      return
    }
    
    // If no email service is configured, log a warning
    console.warn('⚠️ No email service configured. Email not sent:', {
      subject,
      recipients: NOTIFICATION_EMAILS
    })
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw error
  }
}

/**
 * Format consultation request email
 */
export function formatConsultationEmail(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  companyName: string
  industry: string
  employeeCount: string
  message: string
  submittedAt: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1A365D 0%, #0076FF 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #1A365D; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e0e0e0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Consultation Request</h1>
          <p>A new consultation request has been submitted</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.firstName} ${data.lastName}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          
          ${data.phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${data.companyName}</div>
          </div>
          
          <div class="field">
            <div class="label">Industry:</div>
            <div class="value">${data.industry}</div>
          </div>
          
          <div class="field">
            <div class="label">Employee Count:</div>
            <div class="value">${data.employeeCount}</div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date(data.submittedAt).toLocaleString()}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from your Curve AI Solutions website</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Format contact form email
 */
export function formatContactEmail(data: {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  submittedAt: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1A365D 0%, #0076FF 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #1A365D; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e0e0e0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 New Contact Form Submission</h1>
          <p>Someone has sent you a message</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          
          ${data.phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          ` : ''}
          
          ${data.company ? `
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${data.subject}</div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date(data.submittedAt).toLocaleString()}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from your Curve AI Solutions contact form</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Format assessment email
 */
export function formatAssessmentEmail(data: {
  userId: string
  title: string
  responses: { [key: string]: string }
  questions: any[]
  overallScore: number
  completionPercentage: number
  submittedAt: string
  userEmail?: string
  userName?: string
}): string {
  // Build response rows
  const responseRows = data.questions
    .map((q) => {
      const response = data.responses[q.id]
      if (!response) return ''
      
      return `
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; background: #f9f9f9;">
            <strong>${q.category}</strong><br>
            ${q.question}
          </td>
          <td style="padding: 12px; border: 1px solid #ddd;">
            ${response}
          </td>
        </tr>
      `
    })
    .filter(row => row !== '')
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1A365D 0%, #0076FF 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .stats { display: flex; gap: 20px; margin-bottom: 30px; }
        .stat-box { flex: 1; background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #0076FF; }
        .stat-value { font-size: 36px; font-weight: bold; color: #0076FF; }
        .stat-label { color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
        th { background: #1A365D; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border: 1px solid #ddd; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 New AI Readiness Assessment</h1>
          <p>${data.title}</p>
        </div>
        <div class="content">
          <h2>Assessment Details</h2>
          <p><strong>User ID:</strong> ${data.userId}</p>
          ${data.userName ? `<p><strong>Name:</strong> ${data.userName}</p>` : ''}
          ${data.userEmail ? `<p><strong>Email:</strong> <a href="mailto:${data.userEmail}">${data.userEmail}</a></p>` : ''}
          <p><strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
          
          <div class="stats">
            <div class="stat-box">
              <div class="stat-value">${data.overallScore.toFixed(1)}/10</div>
              <div class="stat-label">Overall Score</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${data.completionPercentage.toFixed(0)}%</div>
              <div class="stat-label">Completion</div>
            </div>
          </div>
          
          <h2>Assessment Responses</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Question</th>
                <th style="width: 50%;">Response</th>
              </tr>
            </thead>
            <tbody>
              ${responseRows}
            </tbody>
          </table>
        </div>
        <div class="footer">
          <p>This assessment was submitted via your Curve AI Solutions website</p>
        </div>
      </div>
    </body>
    </html>
  `
}

