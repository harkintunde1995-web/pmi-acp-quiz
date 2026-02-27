'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ASSESSMENT_TYPES, GAMIFICATION } from '@/lib/types'

export default function Home() {
  const totalStats = {
    totalQuestions: 420,
    assessments: 5,
    domains: 7,
    badges: GAMIFICATION.BADGES.length,
  }

  const [userStats, setUserStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    currentLevel: 1,
    totalXP: 0,
  })

  useEffect(() => {
    // Load user stats from localStorage (will be replaced with Supabase)
    const stats = localStorage.getItem('userStats')
    if (stats) {
      setUserStats(JSON.parse(stats))
    }
  }, [])

  return (
    <div className="space-y-8 p-6 lg:p-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-600 dark:bg-blue-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="max-w-xl">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Certification Prep</span>
            <h2 className="text-3xl lg:text-5xl font-display font-extrabold mb-4 leading-tight">Master the PMI-ACP Exam</h2>
            <p className="text-blue-100 text-lg opacity-90 mb-0">420 expertly-crafted questions, 7 domains, real-time scoring. Prepare for exam day with data-driven learning.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Exam Countdown</p>
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <span className="text-3xl font-display font-extrabold block">April 20</span>
                <span className="text-xs font-medium text-blue-100">2026</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="material-icons-round text-2xl">fitness_center</span>
                <span className="text-xs font-bold">Let's crush it!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <span className="material-icons-round">quiz</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Questions</p>
            <h3 className="text-2xl font-display font-bold">{totalStats.totalQuestions}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
            <span className="material-icons-round">category</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Assessments</p>
            <h3 className="text-2xl font-display font-bold">{totalStats.assessments}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <span className="material-icons-round">account_tree</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Domains</p>
            <h3 className="text-2xl font-display font-bold">{totalStats.domains}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
            <span className="material-icons-round">military_tech</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Achievements</p>
            <h3 className="text-2xl font-display font-bold">{totalStats.badges}</h3>
          </div>
        </div>
      </section>

      {/* Progress Section & Assessment Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <span className="material-icons-round text-blue-600 dark:text-blue-400">analytics</span>
              Your Progress
            </h3>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Weekly Goal</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-3">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-24 h-24">
                  <circle className="text-slate-100 dark:text-slate-800" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-blue-600 dark:text-blue-400 progress-ring__circle" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="251.2" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <span className="absolute text-xl font-display font-bold">{userStats.averageScore}%</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quizzes Completed</p>
            </div>
            <div className="text-center space-y-3">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-24 h-24">
                  <circle className="text-slate-100 dark:text-slate-800" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-emerald-500 progress-ring__circle" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="251.2" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <span className="absolute text-xl font-display font-bold">{userStats.averageScore}%</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Score</p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Level</p>
                <h4 className="text-2xl font-display font-extrabold text-blue-600 dark:text-blue-400">Level {userStats.currentLevel}</h4>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total XP</p>
                <h4 className="text-2xl font-display font-extrabold">{userStats.totalXP}</h4>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[5%]" style={{ transition: 'width 1s ease-in-out' }}></div>
            </div>
            <p className="text-[10px] mt-2 text-slate-400 font-medium text-center italic">1,000 XP more to reach Level 2</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <span className="material-icons-round text-blue-600 dark:text-blue-400">rocket_launch</span>
              Select Assessment Type
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASSESSMENT_TYPES.map((assessment) => {
              const getIcon = (id: string) => {
                if (id.includes('mini')) return 'timer'
                if (id.includes('checkpoint')) return 'grid_view'
                if (id.includes('cross')) return 'shuffle'
                if (id.includes('mock-exam-1')) return 'military_tech'
                return 'emoji_events'
              }

              const getIconBg = (id: string) => {
                if (id.includes('mini')) return 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'
                if (id.includes('checkpoint')) return 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                if (id.includes('cross')) return 'bg-purple-50 dark:bg-purple-900/20 text-purple-500'
                if (id.includes('mock-exam')) return 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'
                return 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'
              }

              const getLabel = (id: string) => {
                if (id.includes('mini')) return 'QUICK SESSION'
                if (id.includes('checkpoint')) return 'MID-LENGTH'
                if (id.includes('cross')) return 'MIXED DOMAINS'
                if (id.includes('mock-exam-1')) return 'BOSS ROUND'
                return 'BOSS ROUND'
              }

              return (
                <Link
                  key={assessment.id}
                  href={`/quiz/${assessment.id}`}
                  className="assessment-card"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 ${getIconBg(assessment.id)} rounded-2xl flex items-center justify-center`}>
                      <span className="material-icons-round">{getIcon(assessment.id)}</span>
                    </div>
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400">{getLabel(assessment.id)}</span>
                  </div>
                  <h4 className="text-xl font-display font-bold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{assessment.label}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1">
                    <span className="material-icons-round text-sm">schedule</span> {assessment.time} minutes
                  </p>
                  <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                    {assessment.id.includes('mock-exam-1') ? 'Enter Boss Arena' : 'Start Test'}
                    <span className="material-icons-round text-lg">{assessment.id.includes('mock-exam-1') ? 'bolt' : 'arrow_forward'}</span>
                  </button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="bg-slate-100 dark:bg-slate-800/40 p-10 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-icons-round text-amber-500 text-3xl">auto_awesome</span>
          <h3 className="text-2xl font-display font-extrabold">How It Works</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center font-extrabold text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700">1</div>
            <h5 className="text-lg font-bold">Learn & Practice</h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Engage with 420 questions covering all 7 PMI-ACP domains with instant feedback.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center font-extrabold text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700">2</div>
            <h5 className="text-lg font-bold">Track & Analyze</h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Watch your level rise as you earn XP. Identify weak areas with detailed performance metrics.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center font-extrabold text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700">3</div>
            <h5 className="text-lg font-bold">Crush the Exam</h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Conquer the BOSS rounds to simulate exam-day pressure and build unshakeable confidence.</p>
          </div>
        </div>
      </section>

      <footer className="pt-10 pb-2 text-center">
        <p className="text-sm text-slate-400">© 2024 PMI-ACP Quiz Master. Designed for focused learning.</p>
      </footer>
    </div>
  )
}
