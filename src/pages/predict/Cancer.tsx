import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { predict, saveRecord } from '../../services/prediction'
import { useToast } from '../../components/Toast'

const schema = z.object({
  age: z.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  family_history: z.enum(['Yes', 'No']),
  smoking_status: z.enum(['Never', 'Former', 'Current', 'Heavy']),
  height: z.number().min(50).max(250),
  weight: z.number().min(20).max(200),
  genetic_risk: z.enum(['Low', 'Medium', 'High']),
  alcohol: z.enum(['None', 'Light', 'Moderate', 'Heavy']),
  activity: z.enum(['Sedentary', 'Light', 'Moderate', 'Active']),
  symptoms: z.array(z.string())
})

type CancerForm = z.infer<typeof schema>

const symptomOptions = ['Unexplained weight loss', 'Persistent fatigue', 'Chronic cough', 'Unusual bleeding', 'Lumps or thickening', 'Changes in bowel/bladder habits']

export default function Cancer() {
  const [result, setResult] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bmi, setBmi] = useState(24)
  const { show } = useToast()

  const { register, handleSubmit, watch } = useForm<CancerForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: 45,
      gender: 'Male',
      family_history: 'No',
      smoking_status: 'Never',
      height: 170,
      weight: 70,
      genetic_risk: 'Medium',
      alcohol: 'Light',
      activity: 'Moderate',
      symptoms: []
    }
  })

  const watchHeight = watch('height')
  const watchWeight = watch('weight')

  useEffect(() => {
    const h = watchHeight || 1
    const w = watchWeight || 0
    const calculated = h > 0 ? w / ((h / 100) * (h / 100)) : 0
    setBmi(Math.round((calculated || 0) * 10) / 10)
  }, [watchHeight, watchWeight])

  const onSubmit = async (data: CancerForm) => {
    setIsSubmitting(true)
    try {
      const response = await predict('Cancer', {
        age: data.age,
        gender: data.gender,
        family_history: data.family_history,
        smoking_status: data.smoking_status,
        bmi,
        genetic_risk: data.genetic_risk,
        alcohol: data.alcohol,
        physical_activity: data.activity,
        symptoms: data.symptoms as any
      })
      setResult(response)
      saveRecord({ disease: 'Cancer', riskScore: response.riskScore, result: response.result, confidence: response.confidence, details: response.details })
      show('Cancer risk assessment saved', 'success')
    } catch (error) {
      show((error as Error).message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cancer Risk Assessment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">Risk Factors</h2>
          <div className="space-y-3">
            <div><label>Age</label><input type="number" {...register('age', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" /></div>
            <div><label>Gender</label><select {...register('gender')} className="w-full rounded-md border px-2 py-1"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label>Family History</label><select {...register('family_history')} className="w-full rounded-md border px-2 py-1"><option>Yes</option><option>No</option></select></div>
            <div><label>Smoking Status</label><select {...register('smoking_status')} className="w-full rounded-md border px-2 py-1"><option>Never</option><option>Former</option><option>Current</option><option>Heavy</option></select></div>
            <div className="grid grid-cols-2 gap-2"><div><label>Height (cm)</label><input type="number" {...register('height', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" /></div><div><label>Weight (kg)</label><input type="number" {...register('weight', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" /></div></div>
            <p className="text-sm font-medium">BMI: {bmi}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">Genetic & Lifestyle</h2>
          <div className="space-y-3">
            <div><label>Genetic Risk</label><select {...register('genetic_risk')} className="w-full rounded-md border px-2 py-1"><option>Low</option><option>Medium</option><option>High</option></select></div>
            <div><label>Alcohol Consumption</label><select {...register('alcohol')} className="w-full rounded-md border px-2 py-1"><option>None</option><option>Light</option><option>Moderate</option><option>Heavy</option></select></div>
            <div><label>Physical Activity</label><select {...register('activity')} className="w-full rounded-md border px-2 py-1"><option>Sedentary</option><option>Light</option><option>Moderate</option><option>Active</option></select></div>
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-3 text-lg font-semibold">Symptoms Checklist</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {symptomOptions.map((symptom) => (
              <label key={symptom} className="flex items-center gap-2 rounded-lg border p-2">
                <input type="checkbox" value={symptom} {...register('symptoms')} className="h-4 w-4" />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-white md:col-span-2" disabled={isSubmitting}>{isSubmitting ? 'Assessing...' : 'Run Assessment'}</button>
      </form>

      {result && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Result</h2>
          <p>Risk = {result.riskScore}%</p>
          <p>Category = {result.result}</p>
          <p>Confidence = {result.confidence}%</p>
        </div>
      )}
    </div>
  )
}
