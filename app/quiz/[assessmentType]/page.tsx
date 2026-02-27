'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Question, QuizzesData, DOMAINS } from '@/lib/types'

export default function QuizPage() {
  const params = useParams()
  const assessmentType = params.assessmentType as string
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 min default
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [domainScores, setDomainScores] = useState<Record<string, { correct: number; total: number }>>({})

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/pmi_acp_questions.json')
        const data: QuizzesData = await response.json()

        // Filter by assessment type
        const typeMap: Record<string, string> = {
          'mini-test': 'Mini-Test',
          'checkpoint': 'Checkpoint',
          'cross-domain': 'Cross-Domain',
          'mock-exam-1': 'Mock Exam 1',
          'mock-exam-2': 'Mock Exam 2',
        }

        const filtered = data.questions.filter(
          (q) => q.assessment_type === typeMap[assessmentType]
        )

        setQuestions(filtered)

        // Set timer based on question count
        const timePerQuestion = 1.5 * 60 // 1.5 minutes per question
        setTimeLeft(Math.ceil(filtered.length * timePerQuestion))

        // Initialize domain scores
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
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, quizComplete])

  const handleTimeUp = () => {
    setQuizComplete(true)
  }

  const handleStart = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (option: string) => {
    if (!answered) {
      setSelectedAnswer(option)
      setAnswered(true)

      // Update scores
      const currentQuestion = questions[currentIndex]
      const isCorrect = option === currentQuestion.correct_answer

      if (isCorrect) {
        setScore((prev) => prev + 1)
      }

      // Update domain scores
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
    return <div className="text-center py-20">Loading questions...</div>
  }

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Ready!</h2>
          <div className="space-y-4 mb-8">
            <p className="text-xl">
              <strong>{questions.length}</strong> questions
            </p>
            <p className="text-xl">
              <strong>{formatTime(timeLeft)}</strong> total time
            </p>
            <p className="text-slate-400">
              1.5 minutes per question • You can review flagged questions • Read carefully!
            </p>
          </div>
          <button
            onClick={handleStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    )
  }

  if (quizComplete) {
    const scorePercentage = (score / questions.length) * 100

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-lg p-8 border border-green-700 text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Quiz Complete! 🎉</h2>
          <div className="text-6xl font-bold text-green-300 mb-4">{scorePercentage.toFixed(1)}%</div>
          <p className="text-xl mb-2">
            You scored <strong>{score} out of {questions.length}</strong>
          </p>
          <p className="text-green-200">
            {scorePercentage >= 80 ? '✨ Excellent work!' : scorePercentage >= 70 ? '👍 Good effort!' : '📚 Keep practicing!'}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h3 className="text-2xl font-bold mb-6">Domain Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(DOMAINS).map(([code, domain]) => {
              const domainScore = domainScores[code]
              const percentage = domainScore.total > 0 ? (domainScore.correct / domainScore.total) * 100 : 0

              return (
                <div key={code}>
                  <div className="flex justify-between mb-2">
                    <span>
                      Domain {code}: {domain.name}
                    </span>
                    <span className={percentage >= 80 ? 'text-green-400 font-bold' : 'text-orange-400'}>
                      {percentage.toFixed(0)}% ({domainScore.correct}/{domainScore.total})
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div>
          <div className="text-sm text-slate-400">Question {currentIndex + 1} of {questions.length}</div>
          <div className="w-64 bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-orange-400' : 'text-slate-200'}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-6">
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-900 text-blue-200 text-sm font-bold">
              Domain {currentQuestion.domain_code}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              currentQuestion.difficulty === 'Bronze'
                ? 'bg-amber-900 text-amber-200'
                : currentQuestion.difficulty === 'Silver'
                ? 'bg-gray-600 text-gray-200'
                : currentQuestion.difficulty === 'Gold'
                ? 'bg-yellow-900 text-yellow-200'
                : 'bg-purple-900 text-purple-200'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-6">{currentQuestion.stem}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {['A', 'B', 'C', 'D'].map((option) => {
            const isSelected = selectedAnswer === option
            const showFeedback = answered

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? isAnswerCorrect
                      ? 'border-green-500 bg-green-900 bg-opacity-30'
                      : 'border-red-500 bg-red-900 bg-opacity-30'
                    : showFeedback && option === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-900 bg-opacity-30'
                    : 'border-slate-600 hover:border-blue-500 hover:bg-slate-700'
                }`}
              >
                <div className="flex gap-4">
                  <span className="font-bold text-lg">{option})</span>
                  <span>{currentQuestion.options[option as keyof typeof currentQuestion.options]}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className={`p-4 rounded-lg border-2 ${
              isAnswerCorrect
                ? 'border-green-500 bg-green-900 bg-opacity-30'
                : 'border-red-500 bg-red-900 bg-opacity-30'
            }`}
          >
            <div className={`font-bold mb-2 ${isAnswerCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isAnswerCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            <p className="text-sm mb-3">{currentQuestion.explanation}</p>
            {!isAnswerCorrect && (
              <p className="text-sm">
                <strong>Correct answer:</strong> {currentQuestion.correct_answer}) {currentQuestion.correct_text}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1))
            setSelectedAnswer(null)
            setAnswered(false)
          }}
          disabled={currentIndex === 0}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          ← Previous
        </button>

        <div className="text-slate-400">
          {answered && `Score: ${score}/${currentIndex + 1}`}
        </div>

        <button
          onClick={handleNext}
          disabled={!answered}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          {currentIndex === questions.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
