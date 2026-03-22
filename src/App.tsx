import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from './components/Toast'

const Login = lazy(() => import('./pages/auth/Login'))
const SignUp = lazy(() => import('./pages/auth/SignUp'))
const PasswordReset = lazy(() => import('./pages/auth/PasswordReset'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Diabetes = lazy(() => import('./pages/predict/Diabetes'))
const Heart = lazy(() => import('./pages/predict/Heart'))
const Kidney = lazy(() => import('./pages/predict/Kidney'))
const Cancer = lazy(() => import('./pages/predict/Cancer'))
const Records = lazy(() => import('./pages/Records'))
const Research = lazy(() => import('./pages/Research'))
const About = lazy(() => import('./pages/About'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const { theme } = useAuthStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <Navbar />
          <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 p-2 md:p-4 lg:p-6">
          <Sidebar />
          <main className="w-full rounded-2xl bg-white/95 p-4 shadow-soft dark:bg-slate-900/85 md:p-6">
            <Suspense fallback={<div className="p-8 text-center">Loading page...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/password-reset" element={<PasswordReset />} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/predict/diabetes" element={<ProtectedRoute><Diabetes /></ProtectedRoute>} />
                <Route path="/predict/heart" element={<ProtectedRoute><Heart /></ProtectedRoute>} />
                <Route path="/predict/kidney" element={<ProtectedRoute><Kidney /></ProtectedRoute>} />
                <Route path="/predict/cancer" element={<ProtectedRoute><Cancer /></ProtectedRoute>} />
                <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
                <Route path="/research" element={<ProtectedRoute><Research /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
      <Toaster />
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App

