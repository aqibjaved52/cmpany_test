# Deployment Guide

## Deploy to Vercel

### Step 1: Prepare Your Code

✅ All test files are excluded via `.vercelignore`  
✅ Test endpoints have been removed  
✅ Code is production-ready

### Step 2: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

4. Select **All environments** (Production, Preview, Development)
5. Click **Save**

### Step 3: Deploy

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js
4. Click **Deploy**

### Step 4: Verify

1. Visit your deployed URL
2. Test adding a client
3. Verify the client appears in the list
4. Check if welcome email is sent

## Important Notes

- **Resend Free Tier**: You can only send emails to your verified email address. To send to any email, verify a domain in Resend.
- **Environment Variables**: Make sure all variables are set in Vercel before deploying
- **Database**: Ensure your Supabase database is accessible from Vercel (it should be by default)

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel
2. Verify all environment variables are set
3. Ensure database schema is created in Supabase
4. Check Resend API key is valid

