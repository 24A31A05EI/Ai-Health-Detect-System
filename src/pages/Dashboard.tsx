import { useMemo } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { getRecords } from '../services/prediction'
import { useNavigate } from 'react-router-dom'
import { Activity, Heart, TrendingUp, Award } from 'lucide-react'

const quotes = [
  'Preventive healthcare is the best medicine.',
  'Early detection saves lives, stay proactive.',
  'Healthy habits build strong futures.'
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const records = getRecords()

  const stats = useMemo(() => {
    const totalPredictions = records.length
    const recent = records.slice(0, 5)
    const healthScore = totalPredictions ? Math.round(records.reduce((acc, r) => acc + (100 - r.riskScore), 0) / totalPredictions) : 100
    return { totalPredictions, recent, healthScore }
  }, [records])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">
        <h2 className="text-4xl font-bold">Welcome back, {user?.fullName || 'User'}!</h2>
        <p className="mt-3 text-lg opacity-90">Your health insights dashboard is ready. Let's keep you healthy and strong.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-md hover:shadow-lg transition-all dark:border-blue-800 dark:from-blue-900/40 dark:to-cyan-900/40">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-200 p-3 dark:bg-blue-800">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Total Predictions</h3>
              <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPredictions}</p>
            </div>
          </div>
        </article>
        <article className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-md hover:shadow-lg transition-all dark:border-orange-800 dark:from-orange-900/40 dark:to-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-200 p-3 dark:bg-orange-800">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Recent Assessments</h3>
              <p className="mt-1 text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.recent.length}</p>
            </div>
          </div>
        </article>
        <article className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-md hover:shadow-lg transition-all dark:border-green-800 dark:from-green-900/40 dark:to-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-200 p-3 dark:bg-green-800">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Health Score</h3>
              <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">{stats.healthScore}%</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-lg dark:border-blue-800 dark:bg-slate-900">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          Quick Disease Assessment
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: '💉 Diabetes', route: '/predict/diabetes', color: 'blue' },
            { title: '❤️ Heart Disease', route: '/predict/heart', color: 'red' },
            { title: '💧 Kidney Disease', route: '/predict/kidney', color: 'purple' },
            { title: '🛡️ Cancer Risk', route: '/predict/cancer', color: 'orange' }
          ].map((item) => (
            <button key={item.title} onClick={() => navigate(item.route)} className={`rounded-xl border-2 border-${item.color}-200 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 p-5 text-left font-semibold text-${item.color}-700 hover:shadow-lg transition-all dark:border-${item.color}-800 dark:from-${item.color}-900/40 dark:to-${item.color}-900/50 dark:text-${item.color}-400`}>
              <h4 className="text-lg">{item.title}</h4>
              <p className="text-xs opacity-75 mt-1">Get risk estimate</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Recent Activity
          </h3>
          {stats.recent.length ? (
            <ul className="space-y-3">
              {stats.recent.map((item) => (
                <li key={item.id} className="rounded-lg border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent p-4 dark:from-blue-900/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{item.disease}</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className={`font-bold ${item.riskScore > 60 ? 'text-red-600 dark:text-red-400' : item.riskScore > 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>Risk: {item.riskScore}%</span>
                    <span className="ml-2">• {item.result}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-6 text-slate-500 dark:text-slate-400">No assessment history yet. Start with a quick prediction!</p>
          )}
        </article>

        <article className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg dark:border-purple-800 dark:from-purple-900/30 dark:to-pink-900/30">
          <h3 className="mb-4 text-lg font-bold text-purple-900 dark:text-purple-200">💡 Daily Wellness Tip</h3>
          <p className="text-lg text-purple-800 dark:text-purple-100 italic">"{quotes[Math.floor(Math.random() * quotes.length)]}"</p>
          <div className="mt-6 rounded-lg bg-white/50 p-4 dark:bg-slate-900/50">
            <p className="text-sm text-slate-700 dark:text-slate-300">Remember: Consistent preventive care is your best investment in long-term health. Schedule regular checkups and maintain healthy habits.</p>
          </div>
        </article>
      </section>
    </div>
  )
}
