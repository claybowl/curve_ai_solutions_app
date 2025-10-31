# Assessment Form Submission Flow - Quick Reference

## 🎯 When User Clicks "Submit Assessment"

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SUBMITS FORM                            │
│                                                                   │
│  Form contains:                                                  │
│  - 20 assessment questions                                      │
│  - User responses (rating, text, multiple choice)               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              CLIENT-SIDE: handleSubmit() triggered               │
│                                                                   │
│  1. Collects form data into FormData object                     │
│  2. Calls server action: submitAssessment(formData)             │
│  3. Disables submit button (loading state)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│          SERVER-SIDE: submitAssessment() server action           │
│             (app/actions/assessment-actions.ts)                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 1: Get User Info                                   │   │
│  │ - If logged in: use user ID                             │   │
│  │ - If anonymous: use 'anonymous'                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 2: Process All 20 Questions                        │   │
│  │ For each question:                                      │   │
│  │   1. Extract response value from form data              │   │
│  │   2. Calculate score based on question type             │   │
│  │   3. Store response data                                │   │
│  │                                                          │   │
│  │ Scoring logic:                                          │   │
│  │   - Scale (1-10): Direct value × weight                │   │
│  │   - Boolean (Y/N): Yes=10, No=5 × weight               │   │
│  │   - Multiple choice: Based on option index × weight    │   │
│  │   - Text: Length + complexity scoring × weight         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 3: Calculate Overall Statistics                    │   │
│  │ - Total Score: Sum of all question scores              │   │
│  │ - Overall Score: Average of valid responses            │   │
│  │ - Completion %: (Answered questions / Total) × 100     │   │
│  │ - Valid Responses: Count of non-empty answers          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 4: ⭐ SEND EMAIL (NEW FEATURE)                     │   │
│  │                                                          │   │
│  │ Prepares email data:                                    │   │
│  │   - User ID                                             │   │
│  │   - Assessment title                                    │   │
│  │   - All responses                                       │   │
│  │   - Overall score                                       │   │
│  │   - Completion %                                        │   │
│  │   - Submission timestamp                                │   │
│  │                                                          │   │
│  │ Formats HTML email with:                                │   │
│  │   ✅ Assessment Submitted header                        │   │
│  │   📊 Statistics cards (Score & Completion %)            │   │
│  │   📋 Response table (all Q&A)                           │   │
│  │   ⏰ Submission time                                    │   │
│  │   👤 User ID                                            │   │
│  │                                                          │   │
│  │ SENDS EMAIL TO: donjon.systems@gmail.com               │   │
│  │ FROM: assessments@curveai.com                           │   │
│  │                                                          │   │
│  │ Email Service Priority:                                 │   │
│  │   1. Try Resend (if RESEND_API_KEY set)                │   │
│  │   2. Try SendGrid (if SENDGRID_API_KEY set)            │   │
│  │   3. Log to console (if no service configured)          │   │
│  │                                                          │   │
│  │ NOTE: Errors are logged but DON'T block submission      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 5: Return Success Response                         │   │
│  │ {                                                        │   │
│  │   success: true,                                        │   │
│  │   message: "Assessment submitted successfully!",        │   │
│  │   score: 7.2,                  // out of 10             │   │
│  │   completionPercentage: 95     // percentage            │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         CLIENT-SIDE: Handle Response                             │
│                                                                   │
│  1. Stop loading state                                           │
│  2. Show success toast notification                              │
│  3. Display results to user                                      │
│  4. Future: Redirect to results page                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         EMAIL DELIVERY                                            │
│                                                                   │
│  ✉️  Assessment email delivered to donjon.systems@gmail.com      │
│                                                                   │
│  Email contains:                                                 │
│  ├─ ✅ Assessment Submitted Header                              │
│  ├─ 📝 User Info (ID, timestamp)                                │
│  ├─ 📊 Statistics (Overall Score, Completion %)                 │
│  └─ 📋 Response Table                                           │
│     ├─ Q1: How familiar are you with AI?                        │
│     │  Response: 7                                               │
│     ├─ Q2: Have you used AI tools before?                       │
│     │  Response: Yes                                             │
│     ├─ ... (18 more questions)                                  │
│     └─ Q20: What's your biggest concern?                        │
│        Response: [User's text response]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📧 Email Service Configuration

### To Make Emails Work:

**Choose ONE email service:**

#### Option 1: Resend (Recommended ⭐)
```bash
# Add to .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
```
- Sign up: https://resend.com
- Copy API key from dashboard
- Restart dev server

#### Option 2: SendGrid
```bash
# Add to .env.local  
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```
- Sign up: https://sendgrid.com
- Copy API key from Settings → API Keys
- Restart dev server

#### Option 3: Development (No Email Needed)
- Leave both API keys unset
- Assessment will still submit successfully
- Check console for assessment data

---

## 🔍 What Actually Happens to Assessment Data

### Current Status:
✅ Form submission works  
✅ Responses are collected  
✅ Score is calculated  
✅ **Email is sent to donjon.systems@gmail.com** ⭐ NEW  
⏳ Database storage (in progress)  
⏳ User results page (pending)  

### Assessment Data Flow:
```
Form Data
   ↓
Responses collected & scored
   ↓
Email formatted with stats & responses
   ↓
Email sent to donjon.systems@gmail.com ← YOU
   ↓
User sees success message
   ↓
(Future) Stored in database
   ↓
(Future) User can view results/history
```

---

## ⚡ Quick Setup

1. **Choose email service** (Resend recommended)
2. **Get API key**
3. **Add to `.env.local`**:
   ```
   RESEND_API_KEY=your_key_here
   ```
4. **Restart dev server**: `pnpm dev`
5. **Test**: Fill form → Submit → Check email

---

## 🐛 If Email Doesn't Work

**Check in this order:**

1. ✅ Did you add API key to `.env.local`?
2. ✅ Did you restart dev server?
3. ✅ Is the email address correct? (donjon.systems@gmail.com)
4. ✅ Check spam folder
5. ✅ Check server console for errors

**For debugging:**
- Remove the API key to test console logs
- Check server output for "sendAssessmentEmail" messages
- Verify API key is correct and active

---

## 📚 Code Files Modified

| File | Changes |
|------|---------|
| `app/actions/assessment-actions.ts` | ✅ Added email sending on submission |
| `components/assessment-form.tsx` | ✅ Fixed rating button highlighting |

---

## 🚀 Next Steps

1. [ ] Set up email service (Resend or SendGrid)
2. [ ] Add API key to `.env.local`
3. [ ] Test form submission
4. [ ] Verify email received at donjon.systems@gmail.com
5. [ ] Deploy to production with email configured
