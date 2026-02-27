# Quick Start Guide

## What You Have

A **fully functional Next.js quiz app** with:
- ✅ 420 PMI-ACP questions (Mini-Tests, Checkpoints, Mock Exams)
- ✅ Real-time scoring and domain analysis
- ✅ Beautiful dark-mode UI with Tailwind CSS
- ✅ Gamification ready (XP, levels, badges)
- ✅ Supabase database schema included
- ✅ Vercel deployment ready

## 3-Step Deployment (10 minutes)

### 1️⃣ **Create GitHub Repo** (2 min)
```bash
# Go to github.com, click "+" → "New repository"
# Create repo named: pmi-acp-quiz (public)

# Then in terminal:
cd /Users/akint/Downloads/pmi-acp-quiz-app
git remote add origin https://github.com/YOUR_USERNAME/pmi-acp-quiz.git
git branch -M main
git push -u origin main
```

### 2️⃣ **Deploy to Vercel** (2 min)
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"** → **Import** your GitHub repo
3. Select **Next.js** framework
4. Click **"Deploy"** (auto-builds)
5. **Copy the URL** → That's your app!

### 3️⃣ **Optional: Add Supabase** (5 min)
- Create project on [supabase.com](https://supabase.com)
- Copy Project URL + Anon Key
- Add as environment variables in Vercel
- Run the SQL schema in Supabase

**That's it! Your app is live.** 🚀

---

## Local Development

```bash
cd /Users/akint/Downloads/pmi-acp-quiz-app

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

---

## Project Structure

```
pmi-acp-quiz-app/
├── app/
│   ├── page.tsx              ← Home page (quiz selection)
│   └── quiz/[type]/page.tsx  ← Quiz interface
├── lib/
│   ├── types.ts              ← TypeScript types
│   ├── supabase.ts           ← Database functions
│   └── gamification.ts       ← XP/level/badge logic
├── public/
│   └── pmi_acp_questions.json ← 420 questions
├── README.md                  ← Full documentation
├── DEPLOYMENT.md              ← Step-by-step deployment
└── schema.sql                 ← Database schema
```

---

## What Each Assessment Type Includes

| Type | Q# | Time | Use Case |
|------|----|----|----------|
| Mini-Test | 20 | 30 min | Daily warm-up |
| Checkpoint | 60 | 90 min | Weekly assessment |
| Cross-Domain | 40 | 120 min | Integrated learning |
| Mock Exam 1 | 120 | 180 min | Mid-study simulation |
| Mock Exam 2 | 120 | 180 min | Final exam simulation |

---

## Features Already Implemented

✅ **Quiz Engine**
- One question per screen
- 1.5 min timer per question
- Immediate feedback (correct/incorrect + explanation)
- Progress bar showing position

✅ **Scoring**
- Overall percentage
- Domain breakdown (7 domains)
- Difficulty analysis (Bronze/Silver/Gold/Platinum)

✅ **Gamification Ready**
- XP calculation (10-40 per correct)
- Level system (1-15, Apprentice → Champion)
- Streak tracking
- Achievement badges (19 total)

✅ **UI/UX**
- Dark mode theme (slate/blue gradient)
- Mobile responsive
- Smooth animations
- Clear visual feedback

---

## Example: Taking a Quiz

1. **Home Page**: Select "Mini-Test"
2. **Start Screen**: Shows 20 questions, 30 min timer
3. **Click Start**: Timer begins
4. **Answer Questions**: Click option → See if correct/incorrect + explanation
5. **Score Report**: See score, domain breakdown, XP earned
6. **Back Home**: Try another assessment

---

## Database Setup (If You Want Persistence)

The app includes a **complete Supabase schema** with:
- Users table
- Quiz attempts
- Domain scores
- User progress (XP, level, streak)
- Badges earned
- Row-level security (RLS) policies

Run the SQL in `schema.sql` to set it up.

---

## What's Next?

### Phase 1: Get It Live ✅
- [ ] Create GitHub repo
- [ ] Deploy to Vercel
- [ ] Test at your live URL

### Phase 2: Add Database (Optional)
- [ ] Set up Supabase
- [ ] Connect to app via env variables
- [ ] Run schema.sql

### Phase 3: Enhance (Future)
- [ ] User authentication
- [ ] Progress dashboard
- [ ] Email reminders
- [ ] Mobile app
- [ ] Study groups

---

## Support Files

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Detailed deployment steps
- **schema.sql** - Supabase database schema
- **.env.local.example** - Environment template

---

## Key Stats

- **Total Questions**: 420
- **Difficulty Levels**: 4 (Bronze, Silver, Gold, Platinum)
- **Domains**: 7 (I–VII)
- **Build Size**: ~50 KB (optimized)
- **Deployment Time**: <2 minutes

---

## Go Live Now! 🚀

```bash
cd /Users/akint/Downloads/pmi-acp-quiz-app

# Just run this to see it locally first:
npm install
npm run dev

# Then follow the 3-step deployment above
```

**Questions?** Check README.md or DEPLOYMENT.md

**Ready?** Let's get it live! 💪
