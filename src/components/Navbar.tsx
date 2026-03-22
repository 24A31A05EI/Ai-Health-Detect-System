import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, LogOut, User, Heart } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export default function Navbar() {
  const { user, logout, theme, setTheme, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b-2 border-blue-200 bg-gradient-to-r from-white to-blue-50 shadow-lg dark:border-blue-900 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hover:from-blue-700 hover:to-cyan-600 transition-all">
            <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="currentColor" />
            <span>Health AI</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/dashboard" className="font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
          <div className="relative group">
            <button className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Predictions ▼</button>
            <div className="invisible absolute top-full left-0 z-20 mt-2 hidden min-w-[200px] flex-col rounded-xl border-2 border-blue-200 bg-white p-2 shadow-xl group-hover:visible group-hover:flex dark:border-blue-800 dark:bg-slate-900">
              <Link to="/predict/diabetes" className="rounded-lg px-4 py-2.5 font-semibold text-slate-700 hover:bg-blue-100 dark:text-slate-200 dark:hover:bg-blue-900/30 transition-colors">💉 Diabetes</Link>
              <Link to="/predict/heart" className="rounded-lg px-4 py-2.5 font-semibold text-slate-700 hover:bg-blue-100 dark:text-slate-200 dark:hover:bg-blue-900/30 transition-colors">❤️ Heart</Link>
              <Link to="/predict/kidney" className="rounded-lg px-4 py-2.5 font-semibold text-slate-700 hover:bg-blue-100 dark:text-slate-200 dark:hover:bg-blue-900/30 transition-colors">💧 Kidney</Link>
              <Link to="/predict/cancer" className="rounded-lg px-4 py-2.5 font-semibold text-slate-700 hover:bg-blue-100 dark:text-slate-200 dark:hover:bg-blue-900/30 transition-colors">🛡️ Cancer</Link>
            </div>
          </div>
          <Link to="/records" className="font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Records</Link>
          <Link to="/research" className="font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Research</Link>
          <Link to="/about" className="font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button aria-label="Toggle dark mode" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="rounded-full border-2 border-blue-300 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/30 transition-all">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3 rounded-full border-2 border-blue-300 bg-gradient-to-r from-blue-100 to-cyan-100 px-5 py-2.5 dark:border-blue-700 dark:from-blue-900/40 dark:to-cyan-900/40">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.fullName ?? 'User'}</span>
              <button onClick={handleLogout} className="ml-2 rounded-full p-1.5 text-red-600 hover:bg-red-200 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 font-semibold text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all">Sign In</button>
          )}
        </div>
      </div>
    </header>
  )
}
