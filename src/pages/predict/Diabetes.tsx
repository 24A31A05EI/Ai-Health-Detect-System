import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { predict, saveRecord } from '../../services/prediction'
import { useToast } from '../../components/Toast'

const schema = z.object({
  age: z.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  pregnancies: z.number().min(0).max(20),
  glucose: z.number().min(0).max(300),
  bp: z.number().min(0).max(200),
  skinThickness: z.number().min(0).max(100),
  insulin: z.number().min(0).max(500),
  bmi: z.number().min(10).max(50),
  pedigree: z.number().min(0).max(2.5)
})

type FormData = z.infer<typeof schema>

export default function Diabetes() {
  const [result, setResult] = useState<string | null>(null)
  const [riskDetails, setRiskDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { show } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { age: 30, gender: 'Male', pregnancies: 0, glucose: 120, bp: 80, skinThickness: 20, insulin: 85, bmi: 26, pedigree: 0.5 }
  })

  const onSubmit = async (values: FormData) => {
    setLoading(true)
    try {
      const response = await predict('Diabetes', {
        age: values.age,
        gender: values.gender,
        pregnancies: values.pregnancies,
        glucose: values.glucose,
        bp: values.bp,
        skin_thickness: values.skinThickness,
        insulin: values.insulin,
        bmi: values.bmi,
        pedigree: values.pedigree
      })
      const recommendations = response.riskScore > 70
        ? 'Consult a physician and follow a low-sugar diet.'
        : 'Maintain regular exercise and monitor blood sugar.'

      const diagnosis = response.riskScore > 50 ? 'Diabetic' : 'Non-Diabetic'
      setResult(diagnosis)
      setRiskDetails({ ...response, recommendations })
      saveRecord({ disease: 'Diabetes', riskScore: response.riskScore, result: response.result, confidence: response.confidence, details: recommendations })
      show('Diabetes prediction saved', 'success')
    } catch (error) {
      show((error as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Diabetes Prediction</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">Personal Information</h2>
          <div className="space-y-3">
            <label className="block text-sm">Age</label>
            <input type="number" {...register('age', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 dark:bg-slate-800" />
            {errors.age && <span className="text-xs text-red-500">{errors.age.message}</span>}
            <label className="block text-sm">Gender</label>
            <select {...register('gender')} className="w-full rounded-lg border px-3 py-2 dark:bg-slate-800">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">Clinical Measurements</h2>
          <div className="grid gap-3">
            {['pregnancies', 'glucose', 'bp', 'skinThickness', 'insulin', 'bmi', 'pedigree'].map((field) => (
              <div key={field}>
                <label className="block text-sm capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input type={field === 'pedigree' ? 'number' : 'number'} step={field === 'pedigree' ? '0.1' : '1'} {...register(field as any, { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 dark:bg-slate-800" />
                {errors[field as keyof typeof errors] && <span className="text-xs text-red-500">{(errors[field as keyof typeof errors] as any)?.message}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-500" disabled={loading}>
            {loading ? 'Predicting...' : 'Run Diabetes Prediction'}
          </button>
        </div>
      </form>

      {riskDetails && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold">Result</h3>
          <p className="mt-2">Prediction: <strong>{result}</strong></p>
          <p>Risk Score: <strong>{riskDetails.riskScore}%</strong></p>
          <p>Confidence: <strong>{riskDetails.confidence}%</strong></p>
          <p>Severity: <strong>{riskDetails.result}</strong></p>
          <p className="mt-2">Recommendations: {riskDetails.recommendations}</p>
          <div className="mt-4 h-4 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-500" style={{ width: `${Math.min(riskDetails.riskScore, 100)}%` }}></div>
          </div>
        </div>
      )}
    </div>
  )
}
