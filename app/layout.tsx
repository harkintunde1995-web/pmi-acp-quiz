import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PMI-ACP Quiz Platform',
  description: 'Master the PMI-ACP exam with interactive quizzes, gamification, and detailed domain analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
        <header className="bg-slate-950 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🎯 PMI-ACP Quiz Master
            </h1>
            <p className="text-slate-400 mt-1">Prepare for exam day with data-driven learning</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-slate-950 border-t border-slate-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-slate-500 text-sm">
            <p>PMI-ACP Exam on April 20, 2026 • Study hard, stay focused, crush it 💪</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
