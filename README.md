# PMI-ACP Quiz Master 🎯

A comprehensive, gamified quiz platform for PMI-ACP exam preparation. 420 expertly-crafted questions, real-time scoring, domain analysis, and achievement badges.

## Features

✅ **420 Questions** across 5 assessment types (Mini-Tests, Checkpoints, Cross-Domain, Mock Exams)
✅ **7 Domains** covered with domain-specific scoring
✅ **Real-Time Feedback** with detailed explanations
✅ **Gamification** - XP, levels, streaks, and achievement badges
✅ **Domain Analysis** - See your strengths and weaknesses by PMI-ACP domain
✅ **Timed Assessments** - 1.5 minutes per question
✅ **Progress Tracking** - Built-in score history and analytics

## Exam Info

- **Exam Date**: April 20, 2026
- **Format**: 120 scored questions + 20 pretest (3 hours)
- **Pass Rate**: 80% (96/120)
- **Domains**: 7 PMI-ACP domains (I–VII)

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (for progress tracking)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd pmi-acp-quiz-app

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The app will be live in seconds!

## Architecture

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **State**: React hooks + localStorage (upgradeable to Supabase)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **API**: Supabase RLS policies for data security

### Data
- **Questions**: 420 questions in `/public/pmi_acp_questions.json`
- **Schema**: Tables for quiz attempts, domain scores, user progress, badges, gamification

## Assessment Types

| Type | Questions | Time |
|------|-----------|------|
| Mini-Test | 20 | 30 min |
| Checkpoint | 60 | 90 min |
| Cross-Domain | 40 | 120 min |
| Mock Exam 1 (Boss Round 1) | 120 | 180 min |
| Mock Exam 2 (Boss Round 2 Final) | 120 | 180 min |

## Domains Covered

| Domain | Weight | Topics |
|--------|--------|--------|
| I | 16% | Agile Principles & Mindset (Shu-Ha-Ri, Cynefin, Stacey, etc.) |
| II | 20% | Value-Driven Delivery (Prioritisation, Iterative development) |
| III | 17% | Stakeholder Engagement (Collaboration, communication) |
| IV | 16% | Team Performance (Tuckman, psychological safety) |
| V | 12% | Adaptive Planning (Estimation, backlog management) |
| VI | 10% | Problem Detection & Resolution (Root cause, continuous improvement) |
| VII | 9% | Continuous Improvement (Metrics, optimization) |

## Gamification System

### XP System
- Correct answer: 10–40 XP (based on difficulty)
- Bronze: 10 XP
- Silver: 15 XP
- Gold: 25 XP
- Platinum: 40 XP
- Streak bonus: +5 XP

### Levels (1–15)
1. Agile Apprentice
2. Agile Practitioner
3. Agile Specialist
...
15. PMI-ACP Champion

### Badges (19 achievements)
- First Step
- Domain Masters (×7)
- Perfect Score
- Speed Demon
- Persistent Learner
- Exam Ready

### Streaks
- Maintain consecutive study days
- Longest streak tracking
- Milestone bonuses

## File Structure

```
pmi-acp-quiz-app/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── quiz/[assessmentType]/page.tsx  # Quiz interface
│   └── globals.css          # Global styles
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── supabase.ts         # Supabase client & functions
│   └── gamification.ts     # XP, level, badge logic
├── public/
│   └── pmi_acp_questions.json  # 420 questions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

1. **Select Assessment Type** - Choose from Mini-Test, Checkpoint, or Mock Exam
2. **Answer Questions** - One at a time with 1.5 min per question
3. **View Feedback** - See if you're correct + detailed explanation
4. **Get Score Report** - Domain breakdown, percentages, XP earned
5. **Track Progress** - View all attempts, streaks, badges, and level

## Future Enhancements

- [ ] Supabase integration for persistent progress tracking
- [ ] User authentication (email/OAuth)
- [ ] Customizable quizzes (filter by domain, difficulty)
- [ ] Detailed analytics dashboard
- [ ] Mobile app version
- [ ] Spaced repetition system
- [ ] Collaborative study groups
- [ ] Study reminders (email/SMS)

## Support

For issues, questions, or suggestions, open an issue on GitHub.

## License

MIT

---

**Built for PMI-ACP candidates. Study hard, stay focused, crush the exam! 💪**
