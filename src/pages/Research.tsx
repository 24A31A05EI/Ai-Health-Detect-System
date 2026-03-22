import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

const algorithms = [
  { key: 'Random Forest', auc: 0.88 },
  { key: 'XGBoost', auc: 0.91 },
  { key: 'Deep Learning', auc: 0.93 },
  { key: 'SVM', auc: 0.84 },
  { key: 'Logistic Regression', auc: 0.78 }
]

const globalStats = [
  { label: 'Adults with chronic disease', value: 2750 },
  { label: 'Preventable deaths/year', value: 580 },
  { label: 'Access to screenings', value: 82 }
]

const performance = [
  { name: 'Traditional', value: 75 },
  { name: 'AI Model', value: 90 }
]

export default function Research() {
  const pie = useMemo(() => algorithms, [])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Research & Methodology</h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Abstract</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          This study by M. Ratna Sahithi et al. presents an AI based chronic disease prediction system focused on early detection and preventive care. The proposed model integrates multi-disease risk factors and machine learning algorithms for improved accuracy and clinical value.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">AI Methodology</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Includes algorithm comparison, AUC scores, and validated results from literature.</p>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Algorithm</th>
                  <th className="p-2">AUC</th>
                </tr>
              </thead>
              <tbody>
                {algorithms.map((algo) => (
                  <tr key={algo.key} className="border-b">
                    <td className="p-2">{algo.key}</td>
                    <td className="p-2">{algo.auc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">AI vs Traditional Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Integrated Preventive Intelligence (IPI) Framework</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {['Data Acquisition', 'Model Training', 'Risk Assessment', 'Actionable Alerts'].map((part) => (
            <article key={part} className="rounded-xl border p-4 dark:border-slate-700">
              <h4 className="font-semibold">{part}</h4>
              <p className="text-sm text-slate-500">Details on the {part.toLowerCase()} component for chronic disease detection.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 text-lg font-semibold">Global Burden Statistics</h3>
          <div className="grid gap-2">
            {globalStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 text-lg font-semibold">Algorithms AUC Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pie}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="auc" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">References</h2>
        <p className="text-sm text-slate-500 mt-2">Sahithi, M. R., Venkata Manikanta, M., Mahesh, P., & Durga Prasad, K. (Year). AI-based Chronic Disease Prediction System. Pragati Engineering College, Andhra Pradesh.</p>
      </section>
    </div>
  )
}
