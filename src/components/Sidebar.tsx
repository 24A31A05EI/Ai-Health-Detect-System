import { Link } from 'react-router-dom'
import { useState } from 'react'
import { BarChart3, Activity, Stethoscope, HeartPulse, Droplet, ShieldOff, FileText } from 'lucide-react'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`sticky top-20 hidden h-[calc(100vh-80px)] w-60 flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:flex ${collapsed ? 'w-16' : 'w-60'}`}>
      <button
        className="mb-4 rounded-lg border px-2 py-1 text-xs font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setCollapsed((cur) => !cur)}
      >
        {collapsed ? 'Expand' : 'Collapse'}
      </button>
      <nav className="flex flex-col gap-2 text-sm">
        <Link to="/dashboard" className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <BarChart3 className="h-4 w-4" />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <div className="text-xs font-semibold uppercase text-slate-400">Prediction Types</div>
        <Link to="/predict/diabetes" className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Stethoscope className="h-4 w-4" />
          {!collapsed && <span>Diabetes</span>}
        </Link>
        <Link to="/predict/heart" className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <HeartPulse className="h-4 w-4" />
          {!collapsed && <span>Heart</span>}
        </Link>
        <Link to="/predict/kidney" className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Droplet className="h-4 w-4" />
          {!collapsed && <span>Kidney</span>}
        </Link>
        <Link to="/predict/cancer" className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <ShieldOff className="h-4 w-4" />
          {!collapsed && <span>Cancer</span>}
        </Link>
        <Link to="/records" className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <FileText className="h-4 w-4" />
          {!collapsed && <span>Records</span>}
        </Link>
        <Link to="/research" className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Activity className="h-4 w-4" />
          {!collapsed && <span>Research</span>}
        </Link>
      </nav>
    </aside>
  )
}
