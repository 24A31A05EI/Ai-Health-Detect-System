import { createContext, useContext, useMemo, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ show: () => null })

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = (message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const value = useMemo(() => ({ show }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`rounded-xl border p-3 text-sm shadow-lg ${
            toast.type === 'success' ? 'border-green-300 bg-green-50 text-green-800 dark:border-emerald-400 dark:bg-emerald-950/60' :
            toast.type === 'error' ? 'border-red-300 bg-red-50 text-red-800 dark:border-rose-400 dark:bg-rose-950/60' :
            'border-blue-300 bg-blue-50 text-blue-800 dark:border-cyan-400 dark:bg-cyan-950/60'
          }`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const Toaster = () => null
