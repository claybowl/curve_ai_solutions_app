# Implementation Details - Assessment Email Notifications

## 📄 Files Modified

### 1. `components/assessment-form.tsx`
**Change**: Fixed rating button highlighting (peer-checked styles)

**Location**: Lines 172-192 (Rating/Scale question type)

**Before**:
```typescript
<input type="radio" className="sr-only" />
<span className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200...">
```

**After**:
```typescript
<input type="radio" className="sr-only peer" />
<span className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200... peer-checked:bg-[#0076FF] peer-checked:text-white peer-checked:border-[#0076FF]">
```

**Why**: The `peer` class on the radio input allows its sibling span to know when it's checked, and the `peer-checked:*` styles make those changes visible.

---

### 2. `app/actions/assessment-actions.ts`
**Changes**: Added email sending functionality

#### Change A: Collect Responses (Lines 625-643)
```typescript
// NEW: Store responses while processing
const responses: { [key: string]: string } = {}

for (const question of questions) {
  const response = formData.get(`question_${question.id}`) as string
  
  if (response) {
    const score = calculateQuestionScore(response, question)
    totalScore += score
    validResponses++
    responses[question.id] = response  // ← NEW: Store response
  }
}
```

#### Change B: Send Email (Lines 655-663)
```typescript
// Send email notification
try {
  await sendAssessmentEmail({
    userId,
    title,
    responses,
    questions,
    overallScore,
    completionPercentage,
    submittedAt: new Date().toISOString()
  })
} catch (emailError) {
  console.error("Error sending assessment email:", emailError)
  // Don't fail the submission if email fails
}
```

#### Change C: New sendAssessmentEmail Function (Lines 1008-1055)
```typescript
async function sendAssessmentEmail(data: {
  userId: string
  title: string
  responses: { [key: string]: string }
  questions: any[]
  overallScore: number
  completionPercentage: number
  submittedAt: string
}) {
  try {
    // Format the assessment data for email
    const emailContent = formatAssessmentEmailContent(data)
    
    // Try using Resend API first (preferred)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from: 'assessments@curveai.com',
        to: 'donjon.systems@gmail.com',
        subject: `New Assessment Submitted: ${data.title}`,
        html: emailContent
      })
      return
    }
    
    // Fallback to SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = await import('@sendgrid/mail')
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY)
      
      await sgMail.default.send({
        to: 'donjon.systems@gmail.com',
        from: 'assessments@curveai.com',
        subject: `New Assessment Submitted: ${data.title}`,
        html: emailContent
      })
      return
    }
    
    // If no email service is configured, log a warning
    console.warn("No email service configured. Assessment data:", {
      userId: data.userId,
      title: data.title,
      score: data.overallScore,
      completionPercentage: data.completionPercentage
    })
  } catch (error) {
    console.error("Error in sendAssessmentEmail:", error)
    throw error
  }
}
```

#### Change D: New formatAssessmentEmailContent Function (Lines 1057-1142)
```typescript
function formatAssessmentEmailContent(data: {
  userId: string
  title: string
  responses: { [key: string]: string }
  questions: any[]
  overallScore: number
  completionPercentage: number
  submittedAt: string
}): string {
  const questionsMap = new Map(data.questions.map(q => [q.id, q]))
  
  let responsesHtml = `
    <h3>Assessment Responses:</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead style="background-color: #f5f5f5;">
        <tr>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Question</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Response</th>
        </tr>
      </thead>
      <tbody>
  `
  
  for (const [questionId, response] of Object.entries(data.responses)) {
    const question = questionsMap.get(questionId)
    const questionText = question?.question_text || questionId
    responsesHtml += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top;"><strong>${questionText}</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${response}</td>
      </tr>
    `
  }
  
  responsesHtml += `
      </tbody>
    </table>
  `
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0076FF; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h1 { margin: 0; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .stat-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0076FF; border-radius: 3px; }
          .stat-box h3 { margin: 0 0 10px 0; color: #0076FF; }
          .stat-box p { margin: 0; font-size: 24px; font-weight: bold; }
          .info-box { background-color: #f0f0f0; padding: 15px; border-radius: 3px; margin-bottom: 20px; }
          .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Assessment Submitted</h1>
            <p>${data.title}</p>
          </div>
          
          <div class="info-box">
            <p><strong>Submission Time:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
            <p><strong>User ID:</strong> ${data.userId}</p>
          </div>
          
          <div class="stats">
            <div class="stat-box">
              <h3>Overall Score</h3>
              <p>${data.overallScore.toFixed(1)}/10</p>
            </div>
            <div class="stat-box">
              <h3>Completion</h3>
              <p>${data.completionPercentage.toFixed(0)}%</p>
            </div>
          </div>
          
          ${responsesHtml}
          
          <div class="footer">
            <p>This assessment was submitted through the Curve AI Solutions assessment system.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
```

---

## 🔄 Data Flow Diagram

```
┌──────────────────┐
│  User Submits    │
│  Assessment      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ submitAssessment(formData)               │
│                                          │
│ 1. Get user ID (or 'anonymous')         │
│ 2. Loop through questions:              │
│    - Extract response                   │
│    - Calculate score                    │
│    - Store in responses {} object  ◄────┼─ NEW: Track responses
│                                          │
│ 3. Calculate stats:                     │
│    - overallScore                       │
│    - completionPercentage               │
│                                          │
│ 4. Prepare email data                   │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ sendAssessmentEmail(data)                │
│                                          │
│ 1. Format email HTML                    │
│ 2. Try RESEND_API_KEY                   │
│ 3. Fallback to SENDGRID_API_KEY         │
│ 4. Log if no service configured         │
│ 5. Catch errors (don't block)           │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ formatAssessmentEmailContent()           │
│                                          │
│ Creates HTML with:                      │
│ - Header with title & checkmark         │
│ - User info & timestamp                 │
│ - Stats cards (score, completion %)     │
│ - Response table (all Q&A)              │
│ - Footer                                │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Email Sent to                            │
│ donjon.systems@gmail.com                 │
│                                          │
│ From: assessments@curveai.com            │
│ Subject: New Assessment Submitted...     │
└──────────────────────────────────────────┘
```

---

## 🔑 Key Design Decisions

### 1. **Email Service Priority**
```
Resend → SendGrid → Console logging
```
- Resend has the cleanest API
- SendGrid as fallback for existing deployments
- Console logging for development without service

### 2. **Error Handling**
```typescript
try {
  await sendAssessmentEmail(...)
} catch (emailError) {
  console.error("...")
  // DON'T throw - allow form submission to succeed
}
```
- Email failures don't block user submission
- Errors are logged for debugging
- User always gets success response

### 3. **Response Tracking**
```typescript
const responses: { [key: string]: string } = {}

// In loop:
responses[question.id] = response

// In email:
for (const [questionId, response] of Object.entries(data.responses))
```
- Responses stored separately from scoring
- Enables detailed email content
- Available for future database storage

### 4. **HTML Email Template**
```
- Styled inline (works in all email clients)
- Responsive layout
- Color-coded sections
- Clean, professional appearance
```

---

## 🧪 Testing the Implementation

### Test Case 1: With Email Service
```
Setup: RESEND_API_KEY=re_xxxxx in .env.local
Action: Fill form → Submit
Expected:
  ✅ Form submits successfully
  ✅ Email received at donjon.systems@gmail.com
  ✅ Email contains all responses & scores
```

### Test Case 2: Without Email Service
```
Setup: No API keys configured
Action: Fill form → Submit
Expected:
  ✅ Form submits successfully
  ✅ Console shows "No email service configured"
  ✅ Assessment data logged to console
```

### Test Case 3: Invalid Email Service
```
Setup: Invalid/expired RESEND_API_KEY
Action: Fill form → Submit
Expected:
  ✅ Form submits successfully (email fails gracefully)
  ✅ Error logged to console
  ✅ User sees success message anyway
```

---

## 📦 Dependencies

The implementation uses dynamic imports to avoid build-time errors:

```typescript
const { Resend } = await import('resend')
const sgMail = await import('@sendgrid/mail')
```

This means you don't need to install these packages until you actually use them. Install when ready:

```bash
# For Resend:
pnpm add resend

# For SendGrid:
pnpm add @sendgrid/mail
```

---

## 🔐 Environment Variables

Required for email (choose ONE):
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```
OR
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

Both are optional. The system works without them (logs to console).

---

## ✨ Future Enhancements

1. **Database Storage**
   - Save assessments and responses to database
   - Enable user to view history

2. **Results Page**
   - Redirect user to personalized results
   - Show recommendations by category

3. **Admin Dashboard**
   - View all submitted assessments
   - Filter and search responses
   - Export data as CSV

4. **Email Customization**
   - Personalized recommendations in email
   - Custom subject line based on score
   - Company logo in header

5. **Webhook Integration**
   - Send assessment data to third-party systems
   - Trigger workflows in n8n
   - Auto-create CRM contacts
