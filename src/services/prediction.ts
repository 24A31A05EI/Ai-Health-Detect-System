import { v4 as uuidv4 } from 'uuid'
import type { DiseaseType, PredictionRecord } from '../types'

const STORAGE_KEY = 'health-detect-records'

const flush = (records: PredictionRecord[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(records))

export const getRecords = (): PredictionRecord[] => {
  const raw = localStorage.getItem(STORAGE_KEY) || '[]'
  try {
    return JSON.parse(raw) as PredictionRecord[]
  } catch {
    return []
  }
}

export const saveRecord = (record: Omit<PredictionRecord, 'id' | 'date'>) => {
  const existing = getRecords()
  const entry: PredictionRecord = {
    id: uuidv4(),
    date: new Date().toISOString(),
    ...record
  }
  const updated = [entry, ...existing]
  flush(updated)
  return entry
}

export const deleteRecord = (id: string) => {
  const updated = getRecords().filter((r) => r.id !== id)
  flush(updated)
  return updated
}

export const predict = async (disease: DiseaseType, values: Record<string, number | string | boolean>) => {
  await new Promise((resolve) => setTimeout(resolve, 950 + Math.random() * 800))

  let risk = 0

  if (disease === 'Diabetes') {
    risk =
      (Number(values.glucose || 100) / 150) * 0.35 +
      (Number(values.bp || 80) / 120) * 0.2 +
      (Number(values.bmi || 25) / 50) * 0.2 +
      (Number(values.pedigree || 0.5) / 2.5) * 0.25
  }

  if (disease === 'Heart') {
    risk =
      (Number(values.cholesterol || 200) / 300) * 0.3 +
      (Number(values.bp || 120) / 200) * 0.25 +
      (Number(values.max_hR || 140) / 220) * 0.2 +
      (Number(values.st_depression || 1.0) / 5.0) * 0.25
  }

  if (disease === 'Kidney') {
    risk =
      (Number(values.blood_urea || 40) / 100) * 0.25 +
      (Number(values.serum_creatinine || 1.0) / 5) * 0.25 +
      (Number(values.sodium || 140) / 160) * 0.15 +
      (Number(values.potassium || 4) / 6) * 0.15 +
      (Number(values.hb || 13) / 18) * 0.2
  }

  if (disease === 'Cancer') {
    risk =
      (Number(values.age || 50) / 100) * 0.2 +
      (Number(values.bmi || 25) / 50) * 0.1 +
      (values.family_history === 'Yes' ? 0.2 : 0) +
      (values.smoking_status === 'Current' ? 0.2 : values.smoking_status === 'Heavy' ? 0.25 : 0) +
      (values.genetic_risk === 'High' ? 0.2 : values.genetic_risk === 'Medium' ? 0.12 : 0.04) +
      (values.alcohol === 'Heavy' ? 0.1 : values.alcohol === 'Moderate' ? 0.06 : 0.03)
  }

  const normalized = Math.min(1, Math.max(0, risk))
  const score = Math.round(normalized * 100)
  const confidence = 70 + Math.round(Math.random() * 30)

  let result: PredictionRecord['result'] = 'Low'
  if (score > 70) result = 'High'
  else if (score > 40) result = 'Moderate'

  const message = `Based on the submitted ailment info, risk is ${score}% and classified as ${result}.`

  return {
    disease,
    riskScore: score,
    confidence,
    result,
    details: message
  }
}
