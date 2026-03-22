import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { predict, saveRecord } from '../../services/prediction'
import { useToast } from '../../components/Toast'

const schema = z.object({
  age: z.number().min(0).max(120),
  sex: z.enum(['Male', 'Female']),
  chest_pain: z.enum(['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic']),
  resting_bp: z.number().min(0).max(200),
  cholesterol: z.number().min(0).max(500),
  fasting_bs: z.enum(['Yes', 'No']),
  resting_ecg: z.enum(['Normal', 'ST-T Abnormality', 'Left Ventricular Hypertrophy']),
  max_hr: z.number().min(60).max(220),
  exercise_angina: z.enum(['Yes', 'No']),
  st_depression: z.number().min(0).max(10),
  slope: z.enum(['Upsloping', 'Flat', 'Downsloping']),
  major_vessels: z.number().min(0).max(3),
  thalassemia: z.enum(['Normal', 'Fixed Defect', 'Reversible Defect'])
})

type HeartForm = z.infer<typeof schema>

export default function Heart() {
  const [formStep, setFormStep] = useState(1)
  const [outcome, setOutcome] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { show } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<HeartForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: 50,
      sex: 'Male',
      chest_pain: 'Typical Angina',
      resting_bp: 130,
      cholesterol: 210,
      fasting_bs: 'No',
      resting_ecg: 'Normal',
      max_hr: 150,
      exercise_angina: 'No',
      st_depression: 1.0,
      slope: 'Flat',
      major_vessels: 0,
      thalassemia: 'Normal'
    }
  })

  const onSubmit = async (data: HeartForm) => {
    setLoading(true)
    try {
      const response = await predict('Heart', {
        age: data.age,
        sex: data.sex,
        chest_pain: data.chest_pain,
        bp: data.resting_bp,
        cholesterol: data.cholesterol,
        fasting_bs: data.fasting_bs,
        ecg: data.resting_ecg,
        max_hR: data.max_hr,
        exercise_angina: data.exercise_angina,
        st_depression: data.st_depression,
        slope: data.slope,
        major_vessels: data.major_vessels,
        thalassemia: data.thalassemia
      })
      setOutcome(response)
      saveRecord({ disease: 'Heart', riskScore: response.riskScore, result: response.result, confidence: response.confidence, details: response.details })
      show('Heart disease prediction saved', 'success')
    } catch (e) {
      show((e as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    if (formStep === 1) {
      return (
        <div className="space-y-3">
          <div>
            <label>Age</label>
            <input type="number" {...register('age', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" />
            <p className="text-xs text-red-500">{errors.age?.message}</p>
          </div>
          <div>
            <label>Sex</label>
            <select {...register('sex')} className="w-full rounded-md border px-2 py-1">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label>Chest Pain Type</label>
            <select {...register('chest_pain')} className="w-full rounded-md border px-2 py-1">
              <option>Typical Angina</option>
              <option>Atypical Angina</option>
              <option>Non-anginal Pain</option>
              <option>Asymptomatic</option>
            </select>
          </div>
        </div>
      )
    }

    if (formStep === 2) {
      return (
        <div className="space-y-3">
          <div><label>Resting Blood Pressure</label><input type="number" {...register('resting_bp', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" /></div>
          <div><label>Cholesterol</label><input type="number" {...register('cholesterol', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" /></div>
          <div><label>Fasting Blood Sugar &gt; 120 mg/dL</label><select {...register('fasting_bs')} className="w-full rounded-md border px-2 py-1"><option>No</option><option>Yes</option></select></div>
          <div><label>Resting ECG</label><select {...register('resting_ecg')} className="w-full rounded-md border px-2 py-1"><option>Normal</option><option>ST-T Abnormality</option><option>Left Ventricular Hypertrophy</option></select></div>
        </div>
      )
    }

    if (formStep === 3) {
      return (
        <div className="space-y-3">
          <div><label>Max Heart Rate</label><input type="number" {...register('max_hr', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" /></div>
          <div><label>Exercise Induced Angina</label><select {...register('exercise_angina')} className="w-full rounded-md border px-2 py-1"><option>No</option><option>Yes</option></select></div>
          <div><label>ST Depression</label><input type="number" step="0.1" {...register('st_depression', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" /></div>
          <div><label>Slope of ST Segment</label><select {...register('slope')} className="w-full rounded-md border px-2 py-1"><option>Upsloping</option><option>Flat</option><option>Downsloping</option></select></div>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <div><label>Number of Major Vessels</label><input type="number" {...register('major_vessels', { valueAsNumber: true })} min={0} max={3} className="w-full rounded-md border px-2 py-1" /></div>
        <div><label>Thalassemia</label><select {...register('thalassemia')} className="w-full rounded-md border px-2 py-1"><option>Normal</option><option>Fixed Defect</option><option>Reversible Defect</option></select></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Heart Disease Prediction</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-4 text-sm font-semibold">Step {formStep}/4</div>
          {renderStep()}
          <div className="mt-4 flex justify-between">
            <button type="button" disabled={formStep === 1} onClick={() => setFormStep((prev) => Math.max(1, prev - 1))} className="rounded-md border px-4 py-2">Prev</button>
            {formStep < 4 ? (
              <button type="button" onClick={() => setFormStep((prev) => Math.min(4, prev + 1))} className="rounded-md border px-4 py-2">Next</button>
            ) : (
              <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-white">{loading ? 'Predicting...' : 'Submit'}</button>
            )}
          </div>
        </div>
      </form>

      {outcome && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Prediction Result</h2>
          <p>Risk Score: {outcome.riskScore}%</p>
          <p>Risk Category: {outcome.result}</p>
          <p>Confidence: {outcome.confidence}%</p>
        </div>
      )}
    </div>
  )
}
