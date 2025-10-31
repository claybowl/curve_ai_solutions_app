# Assessment Email Notification Setup

## 📋 Overview

When a user submits an AI Readiness Assessment form, the system now automatically sends an email to `donjon.systems@gmail.com` with all assessment data.

---

## 🔄 Complete Submission Flow

### Step 1: Form Submission
```
User fills out assessment form with 20 questions
↓
Clicks "Submit Assessment" button
↓
Form data collected and sent to submitAssessment() server action
```

### Step 2: Data Processing
```
submitAssessment() receives FormData
↓
Gets current user (if logged in)
↓
Loops through all 20 assessment questions
↓
For each question:
  - Extracts response value
  - Calculates score based on question type
  - Stores response data
↓
Calculates overall statistics:
  - Overall Score (0-10)
  - Completion Percentage (0-100%)
```

### Step 3: Email Notification ⭐ NEW
```
Prepares assessment data
↓
Formats HTML email with:
  - Assessment metadata (user ID, submission time)
  - Statistics (score, completion %)
  - Response table (all questions and answers)
↓
Sends to donjon.systems@gmail.com
↓
Email fails gracefully (won't block form submission)
```

### Step 4: Response
```
Returns success message to user
Database integration: (pending)
```

---

## 📧 Email Service Configuration

### Option A: Using Resend (Recommended)
Resend is a modern email service optimized for transactional emails.

1. **Sign up**: https://resend.com
2. **Get API Key**: Navigate to API Keys section
3. **Add to `.env.local`**:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Option B: Using SendGrid (Fallback)
SendGrid is a reliable email service with a large feature set.

1. **Sign up**: https://sendgrid.com
2. **Get API Key**: Settings → API Keys
3. **Add to `.env.local`**:
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Option C: No Email Service (Development)
If neither service is configured:
- The assessment submission will still succeed
- Assessment data will be logged to console
- No email will be sent (but you'll see warning logs)
- Perfect for development/testing

---

## 📧 Email Content

The email sent to `donjon.systems@gmail.com` includes:

### Header Section
- ✅ Assessment Submitted confirmation
- Assessment title (AI Readiness Assessment)

### Info Box
- Submission timestamp (human-readable format)
- User ID (logged-in user ID or "anonymous")

### Statistics Cards
| Overall Score | Completion % |
|---|---|
| Score out of 10 | Percentage completed |

### Response Table
A detailed table showing:
- **Question** (full question text)
- **Response** (user's answer)

Includes all 20 questions from:
1. Current AI Understanding
2. Business Operations
3. Data & Information
4. Technical Readiness
5. Budget & Investment
6. Team & Culture
7. Customer Experience
8. Priorities & Timeline

### Footer
- Branding and system attribution

---

## 🎯 Question Types & Scoring

The assessment includes multiple question types, each scored differently:

### Scale Questions (1-10)
- **Questions**: AI familiarity, urgency
- **Score**: Direct numeric value × weight
- **Example**: User selects 7 → Score = 7

### Boolean Questions (Yes/No)
- **Questions**: AI tool experience, system connectivity
- **Score**: Yes = 10, No = 5 (× weight)

### Multiple Choice
- **Questions**: Business size, team reaction, etc.
- **Score**: Based on option index (1-10 × weight)

### Text Questions
- **Questions**: Repetitive tasks, biggest change, customer wishes
- **Score**: Based on length (0-5) + complexity (0-5) × weight

---

## 💻 Code Implementation

### Main Functions

**`submitAssessment(formData)`**
- Location: `app/actions/assessment-actions.ts`
- Processes form submission
- Triggers email send
- Returns success/completion data

**`sendAssessmentEmail(data)`**
- Formats assessment data
- Attempts Resend first, then SendGrid
- Gracefully handles failures
- Never blocks form submission

**`formatAssessmentEmailContent(data)`**
- Generates HTML email template
- Creates styled response table
- Includes all statistics

---

## 🔍 Testing the Email

### Test Locally
1. Set up `.env.local` with your email service API key
2. Fill out the assessment form in your browser
3. Submit the form
4. Check your email inbox for the notification

### View Logs
If email fails or no service is configured, check:
```bash
# Terminal/Console output
# Look for "sendAssessmentEmail" warnings or errors
```

### Debug Mode
To test without an email service:
1. Don't set `RESEND_API_KEY` or `SENDGRID_API_KEY`
2. Submit the form
3. Check browser console or server logs for the assessment data dump

---

## 📝 Configuration Checklist

- [ ] Choose email service (Resend or SendGrid)
- [ ] Sign up and get API key
- [ ] Add API key to `.env.local`
- [ ] Restart development server
- [ ] Test form submission
- [ ] Verify email received

---

## 🚀 Production Deployment

### Vercel Environment Variables
1. Go to Vercel Project Settings
2. Add to Environment Variables:
   - `RESEND_API_KEY` OR `SENDGRID_API_KEY`
3. Redeploy the application
4. Test form submission on production

### Email From Address
The email is currently sent from: `assessments@curveai.com`

To change this, update in `app/actions/assessment-actions.ts`:
```typescript
from: 'assessments@curveai.com',  // ← Change here
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| No email received | Check API key in `.env.local` and restart server |
| Email from wrong address | Verify domain is authorized in email service |
| Assessment still submits but no email | Check server logs for email errors |
| "No email service configured" warning | Set up Resend or SendGrid API key |
| Email contains HTML markup | Format is correct; email client may have display issues |

---

## ✅ What Happens Next

- [ ] User sees success message after submission
- [ ] Email delivered to donjon.systems@gmail.com within minutes
- [ ] Email includes all assessment responses and scores
- [ ] Email fails gracefully without blocking user experience
- [ ] Future: Save assessment to database for tracking/analytics

---

## 📚 References

- **Resend Docs**: https://resend.com/docs
- **SendGrid Docs**: https://docs.sendgrid.com
- **Assessment Questions**: `app/actions/assessment-actions.ts` (lines 38-477)
