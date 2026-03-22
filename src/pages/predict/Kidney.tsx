import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { predict, saveRecord } from '../../services/prediction'
import { useToast } from '../../components/Toast'

const schema = z.object({
  age: z.number().min(0).max(120),
  blood_pressure: z.number().min(0).max(200),
  specific_gravity: z.enum(['1.005', '1.010', '1.015', '1.020', '1.025']),
  albumin: z.number().min(0).max(5),
  sugar: z.number().min(0).max(5),
  blood_glucose_random: z.number().min(0),
  blood_urea: z.number().min(0),
  serum_creatinine: z.number().min(0),
  sodium: z.number().min(0),
  potassium: z.number().min(0),
  hemoglobin: z.number().min(0),
  pcv: z.number().min(0),
  wc: z.number().min(0),
  rc: z.number().min(0),
  hypertension: z.enum(['Yes', 'No']),
  diabetes_mellitus: z.enum(['Yes', 'No']),
  cad: z.enum(['Yes', 'No']),
  appetite: z.enum(['Good', 'Poor']),
  pedal_edema: z.enum(['Yes', 'No']),
  anemia: z.enum(['Yes', 'No'])
})

type KidneyForm = z.infer<typeof schema>

export default function Kidney() {
  const [activeTab, setActiveTab] = useState(1)
  const [result, setResult] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { show } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<KidneyForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: 45,
      blood_pressure: 80,
      specific_gravity: '1.020',
      albumin: 1,
      sugar: 0,
      blood_glucose_random: 120,
      blood_urea: 40,
      serum_creatinine: 1.1,
      sodium: 140,
      potassium: 4.5,
      hemoglobin: 13,
      pcv: 42,
      wc: 8500,
      rc: 5,
      hypertension: 'No',
      diabetes_mellitus: 'No',
      cad: 'No',
      appetite: 'Good',
      pedal_edema: 'No',
      anemia: 'No'
    }
  })

  const onSubmit = async (data: KidneyForm) => {
    setIsSubmitting(true)
    try {
      const response = await predict('Kidney', {
        age: data.age,
        blood_urea: data.blood_urea,
        serum_creatinine: data.serum_creatinine,
        sodium: data.sodium,
        potassium: data.potassium,
        hb: data.hemoglobin
      })
      setResult(response)
      saveRecord({ disease: 'Kidney', riskScore: response.riskScore, result: response.result, confidence: response.confidence, details: response.details })
      show('Kidney disease prediction saved', 'success')
    } catch (error) {
      show((error as Error).message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs = ['Basic Info', 'Blood Tests', 'Cell Counts', 'Medical History']

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Chronic Kidney Disease Prediction</h1>
      <div className="flex gap-2 overflow-x-auto rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {tabs.map((tab, index) => (
          <button key={tab} onClick={() => setActiveTab(index + 1)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${activeTab === index + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {activeTab === 1 && (
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: 'Age', name: 'age', type: 'number' },
              { label: 'Blood Pressure', name: 'blood_pressure', type: 'number' }
            ].map((item) => (
              <div key={item.name}>
                <label>{item.label}</label>
                <input type={item.type} {...register(item.name as any, { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" />
                <p className="text-xs text-red-500">{(errors as any)[item.name]?.message}</p>
              </div>
            ))}

            <div>
              <label>Specific Gravity</label>
              <select {...register('specific_gravity')} className="w-full rounded-md border px-2 py-1">
                <option>1.005</option>
                <option>1.010</option>
                <option>1.015</option>
                <option>1.020</option>
                <option>1.025</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Albumin</label>
                <input type="number" {...register('albumin', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" />
              </div>
              <div>
                <label>Sugar</label>
                <input type="number" {...register('sugar', { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid gap-3 md:grid-cols-2">
            {['blood_glucose_random', 'blood_urea', 'serum_creatinine', 'sodium', 'potassium', 'hemoglobin'].map((field) => (
              <div key={field}>
                <label className="capitalize">{field.replace('_', ' ')}</label>
                <input type="number" {...register(field as any, { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 3 && (
          <div className="grid gap-3 md:grid-cols-3">
            {['pcv', 'wc', 'rc'].map((field) => (
              <div key={field}>
                <label>{field.toUpperCase()}</label>
                <input type="number" {...register(field as any, { valueAsNumber: true })} className="w-full rounded-md border px-2 py-1" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 4 && (
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { name: 'hypertension', label: 'Hypertension' },
              { name: 'diabetes_mellitus', label: 'Diabetes Mellitus' },
              { name: 'cad', label: 'Coronary Artery Disease' },
              { name: 'appetite', label: 'Appetite' },
              { name: 'pedal_edema', label: 'Pedal Edema' },
              { name: 'anemia', label: 'Anemia' }
            ].map((item) => (
              <div key={item.name}>
                <label>{item.label}</label>
                <select {...register(item.name as any)} className="w-full rounded-md border px-2 py-1">
                  <option>Yes</option>
                  <option>No</option>
                  {item.name === 'appetite' && <option>Good</option>}
                </select>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            {isSubmitting ? 'Predicting...' : 'Predict Kidney Risk'}
          </button>
        </div>
      </form>

      {result && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Result</h2>
          <p>Risk {result.riskScore}%</p>
          <p>Category {result.result}</p>
          <p>Confidence {result.confidence}%</p>
        </div>
      )}
    </div>
  )
}
