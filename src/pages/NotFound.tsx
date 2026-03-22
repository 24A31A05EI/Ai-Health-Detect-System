import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto my-20 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Page not found</p>
      <Link to="/dashboard" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white">Go to Dashboard</Link>
    </div>
  )
}
