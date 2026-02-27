'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ASSESSMENT_TYPES, GAMIFICATION } from '@/lib/types'

export default function Home() {
  const [totalStats, setTotalStats] = useState({
    totalQuestions: 420,
    assessments: 5,
    domains: 7,
    badges: GAMIFICATION.BADGES.length,
  })

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
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Master the PMI-ACP Exam</h2>
          <p className="text-lg text-blue-100 mb-6">
            420 expertly-crafted questions, 7 domains, real-time scoring, and gamified learning.
            Your exam is April 20, 2026. Let's crush it. 💪
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl font-bold">{totalStats.totalQuestions}</div>
              <div className="text-blue-100 text-sm">Questions</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl font-bold">{totalStats.assessments}</div>
              <div className="text-blue-100 text-sm">Assessment Types</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl font-bold">{totalStats.domains}</div>
              <div className="text-blue-100 text-sm">Domains</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl font-bold">{totalStats.badges}</div>
              <div className="text-blue-100 text-sm">Achievements</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Stats Bar */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold mb-4">📊 Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-400">{userStats.quizzesCompleted}</div>
            <div className="text-slate-400 text-sm">Quizzes Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{userStats.averageScore}%</div>
            <div className="text-slate-400 text-sm">Average Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">Lvl {userStats.currentLevel}</div>
            <div className="text-slate-400 text-sm">Current Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{userStats.totalXP} XP</div>
            <div className="text-slate-400 text-sm">Total XP</div>
          </div>
        </div>
      </section>

      {/* Quiz Selection */}
      <section>
        <h3 className="text-2xl font-bold mb-6">🎯 Select Assessment Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {ASSESSMENT_TYPES.map((assessment) => (
            <Link
              key={assessment.id}
              href={`/quiz/${assessment.id}`}
              className="group relative bg-slate-800 border-2 border-slate-700 hover:border-blue-500 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity" />
              <div className="relative z-10">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {assessment.id.includes('mini') && '📝'}
                  {assessment.id.includes('checkpoint') && '🏁'}
                  {assessment.id.includes('cross') && '🔄'}
                  {assessment.id.includes('mock-exam-1') && '🥇'}
                  {assessment.id.includes('mock-exam-2') && '🏆'}
                </div>
                <h4 className="font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">{assessment.label}</h4>
                <p className="text-slate-400 text-sm">⏱️ {assessment.time} minutes</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold mb-6">✨ How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-4xl mb-3">🎓</div>
            <h4 className="font-bold mb-2">Learn & Practice</h4>
            <p className="text-slate-400">
              Choose from 5 assessment types with 420 questions covering all 7 PMI-ACP domains.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold mb-2">Get Instant Feedback</h4>
            <p className="text-slate-400">
              See correct answers, detailed explanations, and domain-level breakdowns immediately.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">🎮</div>
            <h4 className="font-bold mb-2">Earn Rewards</h4>
            <p className="text-slate-400">
              Gain XP, level up, unlock badges, and maintain streaks as you master each domain.
            </p>
          </div>
        </div>
      </section>

      {/* Domains Overview */}
      <section>
        <h3 className="text-2xl font-bold mb-6">📚 PMI-ACP Domains</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { code: 'I', name: 'Agile Principles & Mindset', weight: 16 },
            { code: 'II', name: 'Value-Driven Delivery', weight: 20 },
            { code: 'III', name: 'Stakeholder Engagement', weight: 17 },
            { code: 'IV', name: 'Team Performance', weight: 16 },
            { code: 'V', name: 'Adaptive Planning', weight: 12 },
            { code: 'VI', name: 'Problem Detection & Resolution', weight: 10 },
            { code: 'VII', name: 'Continuous Improvement', weight: 9 },
          ].map((domain) => (
            <div key={domain.code} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">Domain {domain.code}</h4>
                <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">{domain.weight}%</span>
              </div>
              <p className="text-slate-400 text-sm">{domain.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-3xl font-bold mb-2">Ready to dominate?</h3>
        <p className="text-lg text-green-100 mb-6">
          Start with a Mini-Test to warm up, or jump straight to a Mock Exam if you're feeling confident.
        </p>
        <Link
          href="/quiz/mini-test"
          className="inline-block bg-white text-green-600 font-bold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
        >
          Start Now →
        </Link>
      </section>
    </div>
  )
}
