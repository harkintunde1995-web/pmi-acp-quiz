# Supabase Setup Guide

Complete guide to set up Supabase for progress tracking and user authentication.

## What Supabase Provides

✅ User authentication (email/password)
✅ Quiz attempt history
✅ Domain-by-domain score tracking
✅ User progress stats (XP, levels, streaks)
✅ Achievement badges
✅ Data persistence across sessions
✅ Secure data isolation (Row Level Security)

---

## Setup Steps

### 1. Create Supabase Project

1. Go to **[supabase.com](https://supabase.com)**
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `pmi-acp-quiz`
   - **Database Password**: Create strong password
   - **Region**: eu-west-1 (or closest to you)
5. Click **"Create new project"** (waits ~2 min)

### 2. Get API Credentials

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc... (long string)
   ```

### 3. Create Database Tables

1. In Supabase, go to **SQL Editor** → **New Query**
2. Paste the entire SQL schema from `schema.sql`
3. Click **"Run"**
4. Verify: Go to **Table Editor** — you should see 7 tables:
   - `users`
   - `quiz_attempts`
   - `domain_scores`
   - `user_progress`
   - `question_attempts`
   - `badges_earned`
   - `domain_mastery`

### 4. Enable Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (default)
3. Go to **URL Configuration**
4. Set:
   - **Site URL**: `https://your-vercel-url.vercel.app`
   - **Redirect URLs**:
     ```
     https://your-vercel-url.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     ```

### 5. Add Environment Variables to Vercel

1. Go to **Vercel Dashboard** → Your project
2. Go to **Settings** → **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = (your URL from step 2)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (your key from step 2)
   ```
4. Click **"Save"** — Vercel auto-rebuilds

### 6. Update Local .env.local

In your project folder:

```bash
# Edit .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 7. Test Locally

```bash
npm run dev
# Visit http://localhost:3000
# Sign up → Take a quiz → Progress should save!
```

---

## Tables Explained

### `users`
- Stores user account info
- Auto-created when user signs up
- Fields: id, email, full_name, created_at

### `quiz_attempts`
- Each row = one completed quiz
- Fields: assessment_type, total_questions, correct_answers, score_percentage, time_taken_seconds

### `domain_scores`
- Score breakdown per domain per quiz
- 7 rows per quiz attempt (one per domain)
- Fields: domain_code, total_questions, correct_answers, score_percentage

### `user_progress`
- Cumulative user stats
- One row per user
- Fields: total_attempts, total_correct, overall_percentage, current_xp, current_level, current_streak, longest_streak

### `question_attempts`
- Each question answered
- Logs: question_id, user_answer, correct_answer, is_correct, domain_code

### `badges_earned`
- Achievement tracking
- Unique per user + badge name
- Fields: badge_name, badge_icon, earned_at

### `domain_mastery`
- Per-domain progress
- 7 rows per user (one per domain)
- Fields: domain_code, average_percentage, status (NOT_STARTED, IN_PROGRESS, MASTERED)

---

## Row Level Security (RLS) Explained

All tables have RLS enabled. This means:
- ✅ Users can only see their own data
- ✅ Users can only insert their own quiz attempts
- ✅ Data is secure and isolated
- ✅ No user can access another user's data

RLS policies are in `schema.sql` and auto-enabled when you run it.

---

## Using Supabase Data

### Save Quiz Result (Backend)

```typescript
await saveQuizAttempt(
  userId,
  assessmentType,
  totalQuestions,
  correctAnswers,
  timeSeconds,
  domainScores
)
```

### Get User Progress

```typescript
const progress = await getUserProgress(userId)
// Returns: total_attempts, overall_percentage, current_xp, current_level, etc.
```

### Get Quiz History

```typescript
const attempts = await getQuizAttempts(userId)
// Returns all quiz attempts for this user
```

### Get Domain Scores

```typescript
const scores = await getDomainScores(quizAttemptId)
// Returns breakdown for each domain
```

All functions are in `/lib/supabase.ts`

---

## Troubleshooting

### "Failed to connect to Supabase"
- Check env variables in Vercel are correct
- Verify Supabase project is not paused
- Check firewall isn't blocking requests

### "RLS policy violation"
- User is authenticated but can't access data
- Check RLS policies are created in schema.sql
- Verify tables have RLS enabled

### "Email already exists"
- User tried to sign up with existing email
- Ask them to sign in instead of sign up

### Tables not showing in Table Editor
- The SQL query didn't run successfully
- Try running the schema again
- Check for error messages in SQL Editor

---

## Next Steps

1. ✅ Set up Supabase
2. ✅ Add credentials to Vercel
3. Test: Visit your live URL → Sign up → Take quiz → Check Supabase
4. (Optional) Add more gamification features
5. Share with study group!

---

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Community: https://supabase.com/discord
- Check console for errors: Vercel → Deployments → Build Logs

---

**Once set up, all user progress is saved to Supabase!** 🎉
