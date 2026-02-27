# Deployment Guide: PMI-ACP Quiz Platform

## Option 1: Deploy to Vercel (Recommended - 2 minutes)

### Step 1: Push to GitHub

```bash
cd /Users/akint/Downloads/pmi-acp-quiz-app

# Create a new repository on GitHub (github.com/new)
# Copy the HTTPS URL, then:

git remote add origin https://github.com/YOUR_USERNAME/pmi-acp-quiz.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import** your GitHub repository
4. **Framework**: Select "Next.js"
5. **Configure**:
   - Root Directory: `.`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
6. **Environment Variables**: Add these:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
7. Click **"Deploy"**

**Your app is live!** Share the URL with your team.

---

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd /Users/akint/Downloads/pmi-acp-quiz-app

# Deploy
vercel

# Follow the prompts to link your Vercel account
```

---

## Step 3: Set Up Supabase (Database)

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. **Project Name**: `pmi-acp-quiz`
4. **Database Password**: Create a strong password
5. **Region**: Choose closest to you (eu-west-1 for Dublin)
6. Click **"Create new project"** (takes ~2 min)

### 3.2 Get Your Credentials

After creation, go to **Project Settings** → **API**:
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.3 Create Database Tables

1. In Supabase, go to **SQL Editor** → **New Query**
2. Copy the entire contents of `/schema.sql` from the project
3. Paste and run the query
4. **Done!** Tables are created with RLS policies

### 3.4 Update Vercel Environment Variables

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add both credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_key>
   ```
4. Click **"Save"** and your deployment will auto-rebuild

---

## Step 4: Verify It Works

1. Visit your Vercel deployment URL
2. Click **"Start Now"** → Choose **"Mini-Test"**
3. Answer a few questions
4. Check the score report

**If it works, you're done!** 🎉

---

## Troubleshooting

### "Questions not loading"
- Ensure `public/pmi_acp_questions.json` exists (618 KB)
- Check browser console for fetch errors
- Verify the file path is correct

### "Supabase connection failed"
- Verify environment variables are set in Vercel
- Check credentials in Supabase dashboard
- Ensure RLS policies are enabled on tables

### "Build fails on Vercel"
- Check Vercel build logs for TypeScript errors
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

---

## Optional: GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

Get tokens from Vercel dashboard and add as GitHub secrets.

---

## What's Included

✅ **Frontend** - Next.js 14 with Tailwind CSS
✅ **Backend** - Supabase PostgreSQL + RLS
✅ **Questions** - 420 questions JSON
✅ **Gamification** - XP, levels, badges system
✅ **Database Schema** - 7 tables with indexes + RLS policies
✅ **Deployment** - Vercel-ready with environment config

---

## Next Steps After Deployment

1. **Share the URL** - Send to study group/team
2. **Configure Supabase Auth** (optional) - Allow user logins
3. **Set up email alerts** - When milestones are hit
4. **Add payment** (if monetizing) - Stripe integration
5. **Mobile app** - Use React Native or WebView wrapper

---

## Live Example URLs

Your app will be deployed to:
- `https://pmi-acp-quiz.vercel.app` (if custom domain not set)
- `https://your-custom-domain.com` (if you add a domain)

Share it with your study group! 🚀

---

**Questions? Open an issue on GitHub or check Vercel/Supabase docs.**
