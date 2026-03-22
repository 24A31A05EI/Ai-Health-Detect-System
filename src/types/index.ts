export type Gender = 'Male' | 'Female' | 'Other'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  age: number
  gender: Gender
  bloodGroup: string
  contact: string
  allergies: string
  conditions: string
  medications: string
  emergencyContact: string
}

export type DiseaseType = 'Diabetes' | 'Heart' | 'Kidney' | 'Cancer'

export interface PredictionRecord {
  id: string
  date: string
  disease: DiseaseType
  riskScore: number
  result: 'Low' | 'Moderate' | 'High'
  confidence: number
  details: string
}
