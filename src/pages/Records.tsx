import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getRecords, deleteRecord } from '../services/prediction'
import { useToast } from '../components/Toast'
import type { DiseaseType, PredictionRecord } from '../types'

const diseaseOptions: DiseaseType[] = ['Diabetes', 'Heart', 'Kidney', 'Cancer']

const toCSV = (records: PredictionRecord[]) => {
  const header = ['date,disease,riskScore,result,confidence,details']
  const rows = records.map((r) => [r.date, r.disease, r.riskScore, r.result, r.confidence, r.details].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
  return [...header, ...rows].join('\n')
}

export default function Records() {
  const [filter, setFilter] = useState<'All' | DiseaseType>('All')
  const [records, setRecords] = useState(() => getRecords())
  const { show } = useToast()

  const filtered = useMemo(() => {
    if (filter === 'All') return records
    return records.filter((r) => r.disease === filter)
  }, [records, filter])

  const trendData = useMemo(() => {
    const grouped: Record<string, number[]> = {}
    records.slice().reverse().forEach((item) => {
      const date = new Date(item.date).toLocaleDateString()
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(item.riskScore)
    })
    return Object.entries(grouped).map(([date, values]) => ({ date, risk: Math.round(values.reduce((a, b) => a + b, 0) / values.length) }))
  }, [records])

  const onExport = () => {
    const csv = toCSV(filtered)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'health-records.csv'
    a.click()
    URL.revokeObjectURL(url)
    show('Records exported', 'success')
  }

  const remove = (id: string) => {
    const updated = deleteRecord(id)
    setRecords(updated)
    show('Record deleted', 'info')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Health Records</h1>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <select className="rounded-lg border px-3 py-2" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="All">All Diseases</option>
          {diseaseOptions.map((d) => <option value={d} key={d}>{d}</option>)}
        </select>
        <button onClick={onExport} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Export CSV</button>
      </div>

      <div className="h-80 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="risk" stroke="#0ea5e9" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-auto rounded-xl border border-slate-200 bg-white text-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full">
          <thead className="bg-slate-100 text-left font-semibold dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Disease</th>
              <th className="px-3 py-2">Risk</th>
              <th className="px-3 py-2">Result</th>
              <th className="px-3 py-2">Confidence</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? filtered.map((rec) => (
              <tr key={rec.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-2">{new Date(rec.date).toLocaleString()}</td>
                <td className="p-2">{rec.disease}</td>
                <td className="p-2">{rec.riskScore}%</td>
                <td className="p-2">{rec.result}</td>
                <td className="p-2">{rec.confidence}%</td>
                <td className="p-2"><button onClick={() => remove(rec.id)} className="rounded bg-red-500 px-2 py-1 text-white">Delete</button></td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-4 text-center text-slate-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
