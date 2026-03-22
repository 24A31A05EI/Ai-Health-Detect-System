import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '../../components/Toast'
import { resetPassword, validateEmail } from '../../services/auth'
import { Link } from 'react-router-dom'

type ResetForm = { email: string }

const schema = z.object({
  email: z.string().email('Please enter a valid email').refine(validateEmail, 'Please enter a valid email address')
})

export default function PasswordReset() {
  const { show } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetForm>({ resolver: zodResolver(schema) })

  const onSubmit = (data: ResetForm) => {
    try {
      resetPassword(data.email)
      show('Password reset link sent to your inbox (mock)', 'success')
    } catch (error) {
      show((error as Error).message, 'error')
    }
  }

  return (
    <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-3 text-center text-2xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" {...register('email')} className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700" />
          <p className="text-xs text-red-500">{errors.email?.message}</p>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-70">
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className="mt-3 text-center text-sm">
        Go back to <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  )
}
