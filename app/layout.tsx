import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PMI-ACP Quiz Master',
  description: 'Master the PMI-ACP exam with 420 questions, 7 domains, and gamified learning',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col fixed h-full left-0 top-0 z-40">
            <div className="p-6 flex items-center gap-3">
              <div className="bg-blue-600 dark:bg-blue-600 p-2 rounded-lg text-white flex items-center justify-center w-10 h-10">
                <span className="material-icons-round">darts</span>
              </div>
              <h1 className="font-display text-lg font-extrabold tracking-tight text-blue-600 dark:text-blue-400">Quiz Master</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1">
              <a className="flex items-center gap-3 px-4 py-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl font-semibold transition-colors" href="/">
                <span className="material-icons-round text-xl">dashboard</span>
                Dashboard
              </a>
              <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl" href="#assessments">
                <span className="material-icons-round text-xl">assignment</span>
                Assessments
              </a>
              <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl" href="#stats">
                <span className="material-icons-round text-xl">bar_chart</span>
                Statistics
              </a>
              <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl" href="#achievements">
                <span className="material-icons-round text-xl">emoji_events</span>
                Achievements
              </a>
            </nav>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                  <span className="material-icons-round text-slate-400">account_circle</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Student</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Learning</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                <span className="material-icons-round text-lg">dark_mode</span>
                Toggle Theme
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto lg:ml-64">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
