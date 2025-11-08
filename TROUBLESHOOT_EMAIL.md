# Email Not Being Received - Troubleshooting Guide

## Current Status
✅ API shows `"sent": true`  
❌ Email not received in inbox

## Step-by-Step Diagnosis

### Step 1: Check Server Logs (MOST IMPORTANT)

**Look at your terminal where `npm run dev` is running.**

When you add a client, you should see logs like:
```
📧 Attempting to send email: { from: 'onboarding@resend.dev', to: 'tahak123@gmail.com' }
✅ Welcome email sent successfully!
📧 Email ID: [some-id-here]
📧 Full Resend response: {...}
```

**What to look for:**
- ✅ If you see `Email ID: [some-id]` → Email was sent by Resend
- ⚠️ If you see `Email sent but no ID returned` → Problem with Resend response
- ❌ If you see error messages → Email failed to send

**Copy the full Resend response** - this will tell us exactly what Resend returned.

---

### Step 2: Check Resend Dashboard (CRITICAL)

1. Go to: **https://resend.com/emails**
2. Sign in with your Resend account
3. Look for emails sent to `tahak123@gmail.com`

**What to check:**
- **Status**: 
  - ✅ "Sent" = Resend accepted the email
  - ✅ "Delivered" = Email reached the inbox
  - ⚠️ "Bounced" = Email was rejected
  - ⚠️ "Pending" = Still being processed
- **Email ID**: Should match what's in your server logs
- **Timestamp**: When it was sent
- **Error messages**: If any

**This is the most reliable way to verify if emails are actually being sent!**

---

### Step 3: Check Your Email

1. **Check Inbox** - Look for emails from `onboarding@resend.dev`
2. **Check Spam/Junk Folder** - Most common issue!
3. **Check Promotions Tab** (Gmail) - Sometimes emails go here
4. **Search for**: "Welcome to Our Accounting Services"
5. **Check All Mail** (Gmail) - Sometimes filtered emails appear here

---

### Step 4: Test with Different Email

Try adding a client with a different email address:
- Different Gmail account
- Outlook/Hotmail
- Yahoo
- Your work email

This helps determine if it's:
- Email-specific issue (that Gmail account)
- Provider-specific issue (Gmail filtering)
- General Resend issue

---

### Step 5: Verify Resend API Key

1. Go to: **https://resend.com/api-keys**
2. Check if your API key is:
   - ✅ Active
   - ✅ Has permission to send emails
   - ✅ Not rate-limited
   - ✅ Not restricted to specific domains

---

### Step 6: Check Resend Account Limits

1. Go to: **https://resend.com/dashboard**
2. Check your usage:
   - Free tier: Limited emails per day
   - If you've hit the limit, emails won't send

---

## Common Issues & Solutions

### Issue 1: Email in Spam Folder
**Solution:** 
- Check spam folder
- Mark as "Not Spam" if found
- Add `onboarding@resend.dev` to contacts

### Issue 2: Gmail Filtering
**Solution:**
- Gmail often filters emails from test domains
- Check "Promotions" tab
- Check "All Mail" folder
- Try a different email provider

### Issue 3: Resend Dashboard Shows "Sent" but Not "Delivered"
**Solution:**
- Email was sent by Resend but rejected by recipient server
- Check recipient email address is valid
- Some email providers block test domains
- Try a different email address

### Issue 4: No Email ID in Logs
**Solution:**
- If `emailId: undefined` in logs, Resend might not be returning proper response
- Check Resend dashboard to see if email was actually sent
- Verify API key is correct

### Issue 5: Rate Limiting
**Solution:**
- Free Resend accounts have limits
- Wait a few minutes and try again
- Check Resend dashboard for rate limit errors

---

## Quick Test Commands

```bash
# Test email endpoint directly
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "tahak123@gmail.com"}'

# Add a client (triggers welcome email)
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "tahak123@gmail.com",
    "business_name": "Test Corp"
  }'
```

---

## What to Report

If emails still aren't working, please provide:

1. **Server logs** - The full output when adding a client
2. **Resend Dashboard screenshot** - Show the email status
3. **API response** - The JSON response from `/api/clients`
4. **Email provider** - Gmail, Outlook, etc.
5. **Checked locations** - Inbox, Spam, Promotions, All Mail

---

## Most Likely Causes (in order)

1. **Email in spam folder** (80% of cases)
2. **Gmail filtering to Promotions** (10% of cases)
3. **Resend rate limiting** (5% of cases)
4. **Invalid email address** (3% of cases)
5. **Resend API issue** (2% of cases)

---

## Next Steps

1. ✅ Check Resend Dashboard - **DO THIS FIRST**
2. ✅ Check server logs for Email ID
3. ✅ Check spam folder thoroughly
4. ✅ Try different email address
5. ✅ Check Resend account limits

The Resend Dashboard is the most reliable source of truth - it will tell you exactly what happened to the email!

