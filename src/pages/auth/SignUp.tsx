import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { register as registerUser, login as authLogin, validateEmail } from '../../services/auth'
import { useAuthStore } from '../../store/useAuthStore'
import { useToast } from '../../components/Toast'

type SignUpForm = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  age: number
  gender: string
  agree: boolean
}

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address').refine(validateEmail, 'Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  age: z.number().min(1, 'Age required').max(120, 'Enter a valid age'),
  gender: z.enum(['Male', 'Female', 'Other']),
  agree: z.boolean()
}).superRefine((values, ctx) => {
  if (values.confirmPassword !== values.password) {
    ctx.addIssue({ path: ['confirmPassword'], code: z.ZodIssueCode.custom, message: 'Passwords must match' })
  }
  if (!values.agree) {
    ctx.addIssue({ path: ['agree'], code: z.ZodIssueCode.custom, message: 'You must agree to terms' })
  }
})

export default function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { show } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 25,
      gender: 'Male',
      agree: false
    }
  })

  const onSubmit = async (data: SignUpForm) => {
    try {
      registerUser({ fullName: data.fullName, email: data.email, password: data.password })
      const authResult = await authLogin(data.email, data.password)
      login(authResult, authResult.token)
      show('Account created successfully! Welcome to Health AI.', 'success')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      show((error as Error).message, 'error')
    }
  }

  return (
    <div className="mx-auto my-12 max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-3 text-center text-2xl font-bold">Create an Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input {...register('fullName')} className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700" />
          <p className="text-xs text-red-500">{errors.fullName?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" {...register('email')} className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700" />
          <p className="text-xs text-red-500">{errors.email?.message}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" {...register('password')} className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700" />
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm password</label>
            <input type="password" {...register('confirmPassword')} className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700" />
            <p className="text-xs text-red-500">{errors.confirmPassword?.message}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Age</label>
            <input type="number" {...register('age', { valueAsNumber: true })} className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700" min={1} max={120} />
            <p className="text-xs text-red-500">{errors.age?.message as string}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select {...register('gender')} className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <p className="text-xs text-red-500">{errors.gender?.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('agree')} className="h-4 w-4" />
          <span>I agree to the terms and conditions</span>
        </div>
        <p className="text-xs text-red-500">{errors.agree?.message}</p>

        <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-70">
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-3 text-center text-sm">
        Already have an account? <Link to="/login" className="font-semibold text-blue-600">Login</Link>
      </p>
    </div>
  )
}
