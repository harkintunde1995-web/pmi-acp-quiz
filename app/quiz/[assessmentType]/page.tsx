'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Question, QuizzesData, DOMAINS, ASSESSMENT_TYPES } from '@/lib/types'

export default function QuizPage() {
  const params = useParams()
  const assessmentType = params.assessmentType as string
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [domainScores, setDomainScores] = useState<Record<string, { correct: number; total: number }>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/pmi_acp_questions.json')
        const data: QuizzesData = await response.json()

        const typeMap: Record<string, string> = {
          'mini-test': 'Mini-Test',
          'checkpoint': 'Checkpoint',
          'cross-domain': 'Cross-Domain',
          'mock-exam-1': 'Mock Exam 1',
          'mock-exam-2': 'Mock Exam 2',
        }

        const filtered = data.questions.filter((q) => q.assessment_type === typeMap[assessmentType])
        setQuestions(filtered)

        const timePerQuestion = 1.5 * 60
        setTimeLeft(Math.ceil(filtered.length * timePerQuestion))

        const domainInit: Record<string, { correct: number; total: number }> = {}
        Object.keys(DOMAINS).forEach((domain) => {
          domainInit[domain] = { correct: 0, total: 0 }
        })
        setDomainScores(domainInit)

        setLoading(false)
      } catch (error) {
        console.error('Failed to load questions:', error)
      }
    }

    loadQuestions()
  }, [assessmentType])

  // Timer
  useEffect(() => {
    if (!quizStarted || quizComplete) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setQuizComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, quizComplete])

  const handleStart = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (option: string) => {
    if (!answered) {
      setSelectedAnswer(option)
      setAnswered(true)

      const currentQuestion = questions[currentIndex]
      const isCorrect = option === currentQuestion.correct_answer

      if (isCorrect) {
        setScore((prev) => prev + 1)
      }

      const domain = currentQuestion.domain_code
      setDomainScores((prev) => ({
        ...prev,
        [domain]: {
          ...prev[domain],
          correct: prev[domain].correct + (isCorrect ? 1 : 0),
          total: prev[domain].total + 1,
        },
      }))
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  const toggleFlag = (index: number) => {
    const newFlagged = new Set(flagged)
    if (newFlagged.has(index)) {
      newFlagged.delete(index)
    } else {
      newFlagged.add(index)
    }
    setFlagged(newFlagged)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    const assessment = ASSESSMENT_TYPES.find((a) => a.id === assessmentType)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-icons-round text-4xl text-blue-600 dark:text-blue-400">check_circle</span>
            </div>
            <h2 className="text-4xl font-display font-extrabold">Get Ready!</h2>
            <p className="text-slate-600 dark:text-slate-400">You're about to start the {assessment?.label}</p>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 space-y-4 my-8">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Questions</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Time Limit</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Per Question</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">~{Math.round(timeLeft / questions.length)}s</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleStart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">play_circle</span>
                Start Quiz
              </button>
              <Link
                href="/"
                className="w-full border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-700 dark:text-slate-300 font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">close</span>
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizComplete) {
    const scorePercentage = (score / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 text-center border border-slate-100 dark:border-slate-800 shadow-lg">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-icons-round text-5xl text-emerald-600 dark:text-emerald-400">celebration</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3">
              <span className="material-icons-round">celebration</span>
              <span className="font-bold uppercase tracking-wider text-sm">Quiz Complete</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold mb-2">Excellent Work!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">You have successfully completed the assessment.</p>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="relative flex items-center justify-center">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800"></circle>
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray="502.65"
                      strokeDashoffset={502.65 * (1 - scorePercentage / 100)}
                      strokeLinecap="round"
                      className="text-emerald-500 progress-ring__circle"
                    ></circle>
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-5xl font-display font-black">{scorePercentage.toFixed(0)}%</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block mt-1">Total Score</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                You answered <strong className="text-emerald-600 dark:text-emerald-400">{score} out of {questions.length}</strong> questions correctly.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-2xl font-bold">{score}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mt-1">Correct</p>
                </div>
                <div>
                  <p className="text-red-600 dark:text-red-400 text-2xl font-bold">{questions.length - score}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mt-1">Incorrect</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-2xl font-bold">{formatTime(timeLeft)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mt-1">Time Left</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">home</span>
                Back to Home
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">refresh</span>
                Retake Quiz
              </button>
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
            <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <span className="material-icons-round text-blue-600 dark:text-blue-400">equalizer</span>
              Domain Performance
            </h3>
            <div className="space-y-6">
              {Object.entries(DOMAINS).map(([code, domain]) => {
                const domainScore = domainScores[code]
                const percentage = domainScore.total > 0 ? (domainScore.correct / domainScore.total) * 100 : 0

                let barColor = 'bg-red-500'
                if (percentage >= 80) barColor = 'bg-emerald-500'
                else if (percentage >= 60) barColor = 'bg-amber-500'

                return (
                  <div key={code}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Domain {code}: {domain.name}
                      </span>
                      <span className={`text-sm font-bold ${barColor === 'bg-emerald-500' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {percentage.toFixed(0)}% ({domainScore.correct}/{domainScore.total})
                      </span>
                    </div>
                    <div className="domain-bar">
                      <div className={`domain-bar-fill ${barColor}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg text-white flex items-center justify-center w-10 h-10">
              <span className="material-icons-round">timer</span>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                {ASSESSMENT_TYPES.find((a) => a.id === assessmentType)?.label}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">PMI-ACP Certification Prep</p>
            </div>
          </div>
          <div className="flex-1 max-w-md mx-12 hidden md:block">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Question {currentIndex + 1} <span className="text-slate-400 font-normal">of {questions.length}</span>
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Time Remaining</span>
              <span className={`text-2xl font-display font-bold tabular-nums leading-none ${timeLeft < 300 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center w-10 h-10">
              <span className="material-icons-round text-slate-600 dark:text-slate-300">pause_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex max-w-[1600px] mx-auto w-full p-6 lg:p-10 gap-8 overflow-hidden">
        <div className="flex-1 flex flex-col gap-8">
          {/* Question */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="mb-8">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest inline-block">
                {currentQuestion.domain} (Domain {currentQuestion.domain_code})
              </span>
              <h2 className="text-2xl lg:text-3xl font-display font-bold mt-6 leading-tight text-slate-800 dark:text-slate-100">
                {currentQuestion.stem}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {['A', 'B', 'C', 'D'].map((option) => {
                const isSelected = selectedAnswer === option
                const showFeedback = answered
                const isCorrect = option === currentQuestion.correct_answer

                let optionClass = 'option-card'
                if (isSelected && isAnswerCorrect) optionClass += ' correct'
                if (isSelected && !isAnswerCorrect) optionClass += ' incorrect'
                if (showFeedback && !isSelected && isCorrect) optionClass += ' correct'
                if (isSelected) optionClass += ' selected'

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={answered}
                    className={optionClass}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      {option}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                        {currentQuestion.options[option as keyof typeof currentQuestion.options]}
                      </p>
                    </div>
                    {isSelected && isAnswerCorrect && (
                      <span className="material-icons-round text-emerald-600 dark:text-emerald-400 ml-auto">check_circle</span>
                    )}
                    {isSelected && !isAnswerCorrect && (
                      <span className="material-icons-round text-red-600 dark:text-red-400 ml-auto">cancel</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {answered && (
              <div
                className={`p-5 rounded-2xl border-l-4 ${
                  isAnswerCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-l-emerald-600 dark:border-l-emerald-400'
                    : 'bg-red-50 dark:bg-red-900/10 border-l-red-600 dark:border-l-red-400'
                }`}
              >
                <div className={`flex items-center gap-2 mb-2 ${isAnswerCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                  <span className="material-icons-round text-xl">{isAnswerCorrect ? 'lightbulb' : 'info'}</span>
                  <h4 className="font-bold">{isAnswerCorrect ? 'Correct!' : 'Explanation'}</h4>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3">{currentQuestion.explanation}</p>
                {!isAnswerCorrect && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Correct answer:</strong> {currentQuestion.correct_answer}) {currentQuestion.correct_text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-icons-round">chevron_left</span>
              Previous Question
            </button>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer select-none px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <input
                  type="checkbox"
                  checked={flagged.has(currentIndex)}
                  onChange={() => toggleFlag(currentIndex)}
                  className="hidden peer"
                />
                <span className="material-icons-round text-slate-400 peer-checked:text-amber-500 peer-checked:fill-amber-500">flag</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Flag for Review</span>
              </label>
              <button
                onClick={handleNext}
                disabled={!answered}
                className="flex items-center gap-2 px-10 py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {currentIndex === questions.length - 1 ? 'Finish Attempt' : 'Next Question'}
                <span className="material-icons-round">{currentIndex === questions.length - 1 ? 'send' : 'chevron_right'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Question Navigator */}
        <aside className="w-80 flex flex-col gap-6 hidden lg:flex">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
            <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
              <span className="material-icons-round text-blue-600 dark:text-blue-400">apps</span>
              Question Navigator
            </h3>
            <div className="question-nav-grid flex-1 overflow-y-auto pr-2">
              {questions.map((_, index) => {
                let navButtonClass = 'question-nav-button'
                if (index === currentIndex) navButtonClass += ' current'
                else if (flagged.has(index)) navButtonClass += ' flagged'
                else if (index < currentIndex) navButtonClass += ' answered'
                else navButtonClass += ' unanswered'

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setSelectedAnswer(null)
                      setAnswered(false)
                    }}
                    className={navButtonClass}
                    title={`Question ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span className="w-4 h-4 bg-emerald-500 rounded-sm"></span>
                Answered
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span className="w-4 h-4 bg-blue-600 rounded-sm"></span>
                Current
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span className="w-4 h-4 bg-amber-500 rounded-sm"></span>
                Flagged
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
