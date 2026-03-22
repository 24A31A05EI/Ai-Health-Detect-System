import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuthStore } from '../../store/useAuthStore'
import { login, demoLogin, getAllUsers } from '../../services/auth'
import { useToast } from '../../components/Toast'
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react'

type LoginForm = {
  identifier: string
  password: string
  remember: boolean
}

const schema = z.object({
  identifier: z.string().min(3, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional()
})

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/dashboard'
  const { login: setLogin } = useAuthStore()
  const { show } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: { identifier: '', password: '', remember: false }
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await login(data.identifier, data.password)
      setLogin(user, user.token)
      show('Logged in successfully! A notification has been sent to your email.', 'success')
      navigate(from, { replace: true })
    } catch (error) {
      show((error as Error).message, 'error')
    }
  }

  const handleDemo = async () => {
    try {
      const user = await demoLogin()
      setLogin(user, user.token)
      show('Demo login successful! A notification has been sent to your email.', 'success')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      show('Demo login failed', 'error')
    }
  }

  const showDebugInfo = () => {
    const users = getAllUsers()
    const userInfo = users.map(u => `${u.fullName} (${u.email})`).join('\n')
    alert(`Existing Accounts:\n${userInfo || 'No accounts found'}\n\nDemo: demo@example.com / demo123`)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-2xl dark:border-blue-800 dark:bg-slate-900">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-4">
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
          
          <h1 className="mb-2 text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Health AI</h1>
          <p className="mb-6 text-center text-slate-600 dark:text-slate-400">Your AI-powered chronic disease prediction system</p>
          
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-slate-800 dark:text-slate-200">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input {...register('identifier')} aria-label="Email or Username" placeholder="Enter your email or username" className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-blue-500 dark:focus:ring-blue-600/30" />
              </div>
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.identifier?.message}</p>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-800 dark:text-slate-200">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type="password" {...register('password')} aria-label="Password" placeholder="Enter your password" className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-blue-500 dark:focus:ring-blue-600/30" />
              </div>
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.password?.message}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('remember')} className="h-4 w-4 rounded border-2 border-blue-300 accent-blue-600" />
                <span className="text-slate-700 dark:text-slate-300">Remember me</span>
              </label>
              <Link to="/password-reset" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isSubmitting} className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60">
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                {!isSubmitting && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              </span>
            </button>

            <button type="button" onClick={handleDemo} className="w-full rounded-xl border-2 border-blue-400 bg-blue-50 py-3 font-bold text-blue-600 transition-all hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
              🎯 Demo Login (Test Now)
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 border-t-2 border-slate-200 dark:border-slate-700"></div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">OR</span>
            <div className="flex-1 border-t-2 border-slate-200 dark:border-slate-700"></div>
          </div>

        <p className="mt-6 text-center">
          <span className="text-slate-700 dark:text-slate-300">Don't have an account? </span>
          <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Create Free Account</Link>
        </p>

        <div className="mt-4 flex justify-center">
          <button
            onClick={showDebugInfo}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline"
            type="button"
          >
            🔍 View Existing Accounts
          </button>
        </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
          Demo Email: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">demo@example.com</span> • Password: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">demo123</span>
        </p>
      </div>
    </div>
  )
}
