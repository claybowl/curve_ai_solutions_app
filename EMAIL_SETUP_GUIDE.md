# Email Notifications Setup Guide

## Overview

All three forms now send email notifications to both:
- **claydonjon@proton.me**
- **donjon.systems@gmail.com**

Forms that send notifications:
1. ✅ **Consultation Requests** (`/consultation`)
2. ✅ **Contact Form** (`/contact`)
3. ✅ **AI Readiness Assessments** (`/assessments`)

---

## Quick Setup

### Step 1: Choose an Email Service

You need either **Resend** (recommended) or **SendGrid** API key.

#### Option A: Resend (Recommended) ⭐

1. Sign up at https://resend.com
2. Get your API key from https://resend.com/api-keys
3. Add to your `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

**Why Resend?**
- Modern, developer-friendly API
- Generous free tier (100 emails/day)
- Best deliverability
- Easy to set up

#### Option B: SendGrid (Alternative)

1. Sign up at https://sendgrid.com
2. Get your API key from Settings → API Keys
3. Add to your `.env.local`:
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

**Note:** The system will try Resend first, then fall back to SendGrid if Resend is not configured.

---

### Step 2: Verify Sender Domain (Important!)

Both Resend and SendGrid require you to verify your sender domain before sending emails.

#### For Resend:
1. Go to https://resend.com/domains
2. Add your domain (e.g., `curveai.com`)
3. Add the DNS records provided
4. Wait for verification (usually 5-30 minutes)

#### For SendGrid:
1. Go to Settings → Sender Authentication
2. Follow the domain authentication steps
3. Add DNS records to your domain
4. Wait for verification

**Tip:** You can use a subdomain like `mail.curveai.com` if you don't want to verify your main domain.

---

### Step 3: Update Sender Addresses (Optional)

The system uses these default sender addresses:
- Consultations: `consultations@curveai.com`
- Contact Form: `contact@curveai.com`
- Assessments: `assessments@curveai.com`

To change them, edit `lib/email.ts` and update the `from` parameter in each format function.

**Important:** The sender domain must match your verified domain!

---

## Testing

### Test Each Form

1. **Consultation Form** → Go to `/consultation`
   - Fill out the form completely
   - Submit and check both email addresses

2. **Contact Form** → Go to `/contact`
   - Fill out name, email, subject, message
   - Submit and check both email addresses

3. **Assessment Form** → Go to `/assessments`
   - Complete the AI readiness assessment
   - Submit and check both email addresses

### Check Server Logs

Look for these messages in your console:
- ✅ `Email sent successfully via Resend`
- ✅ `Email sent successfully via SendGrid`
- ⚠️ `No email service configured` (if API key is missing)
- ❌ `Error sending email:` (if there's a problem)

---

## Email Content

Each notification includes:

### Consultation Request Email
- Name and contact info
- Company details
- Industry and employee count
- Message
- Submission timestamp

### Contact Form Email
- Name and email
- Phone and company (if provided)
- Subject and message
- Submission timestamp

### Assessment Email
- User ID and email (if logged in)
- Overall score (0-10)
- Completion percentage
- Full table of questions and answers
- Submission timestamp

---

## Troubleshooting

### Problem: No emails being sent

**Solution:**
1. Check that you have either `RESEND_API_KEY` or `SENDGRID_API_KEY` in `.env.local`
2. Restart your development server after adding the key
3. Check server logs for error messages

### Problem: Emails going to spam

**Solution:**
1. Verify your sender domain (most important!)
2. Use a proper "from" address that matches your verified domain
3. Add SPF and DKIM records (provided by Resend/SendGrid)
4. Warm up your domain by sending test emails gradually

### Problem: "Domain not verified" error

**Solution:**
1. Go to your email service dashboard
2. Check domain verification status
3. Ensure all DNS records are properly added
4. Wait up to 48 hours for DNS propagation (usually much faster)

### Problem: Rate limit exceeded

**Solution:**
1. Resend free tier: 100 emails/day
2. SendGrid free tier: 100 emails/day
3. Upgrade to paid plan if needed
4. Emails fail gracefully - form submissions still work

---

## Architecture

### Email Service (`lib/email.ts`)

Central email utility with these functions:

1. **`sendNotificationEmail(options)`**
   - Sends to both Clay's emails
   - Tries Resend first, falls back to SendGrid
   - Logs success/failure messages

2. **`formatConsultationEmail(data)`**
   - Creates HTML email for consultation requests

3. **`formatContactEmail(data)`**
   - Creates HTML email for contact form

4. **`formatAssessmentEmail(data)`**
   - Creates HTML email for assessments with full results

### Integration Points

1. **Consultation:** `app/api/consultation/route.ts`
   - API route handler
   - Sends email on successful submission

2. **Contact:** `app/actions/contact-actions.ts`
   - Server action
   - Sends email before saving to database

3. **Assessment:** `app/actions/assessment-actions.ts`
   - Server action
   - Sends email with full assessment results

---

## Production Checklist

- [ ] Add `RESEND_API_KEY` or `SENDGRID_API_KEY` to production environment
- [ ] Verify sender domain in production
- [ ] Test all three forms in production
- [ ] Monitor email deliverability
- [ ] Set up email forwarding/filters if needed
- [ ] Consider upgrading to paid plan for higher limits

---

## Next Steps

1. **Set up API key** (5 minutes)
2. **Verify domain** (5-30 minutes)
3. **Test all forms** (10 minutes)
4. **Monitor and adjust** (ongoing)

---

## Support

- **Resend Docs:** https://resend.com/docs
- **SendGrid Docs:** https://docs.sendgrid.com
- **Email Testing:** Use https://mailtrap.io for testing in development

---

**Questions?** Check the server logs for detailed error messages. All email failures are logged with clear error messages.

