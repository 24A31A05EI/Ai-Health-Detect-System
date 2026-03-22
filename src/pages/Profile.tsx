import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/Toast'

export default function Profile() {
  const { user } = useAuthStore()
  const { show } = useToast()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male')
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [contact, setContact] = useState('')
  const [allergies, setAllergies] = useState('')
  const [conditions, setConditions] = useState('')
  const [medications, setMedications] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border border-blue-300 bg-blue-100 text-center leading-[4rem] text-2xl">{fullName.charAt(0).toUpperCase()}</div>
          <div>
            <h2 className="text-lg font-semibold">{fullName || 'User Name'}</h2>
            <p className="text-sm text-slate-500">Profile settings and information</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} placeholder="Age" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"><option>Male</option><option>Female</option><option>Other</option></select>
          <input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="Blood Group" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="text-lg font-semibold">Medical Profile</h3>
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Known allergies" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" rows={2} />
            <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Existing conditions" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" rows={2} />
            <textarea value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="Current medications" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" rows={2} />
            <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Emergency contact" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => show('Profile saved', 'success')} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save Changes</button>
          <button onClick={() => show('Account delete requested', 'error')} className="rounded-lg border border-rose-400 px-4 py-2 text-rose-600">Delete Account</button>
        </div>
      </div>
    </div>
  )
}
