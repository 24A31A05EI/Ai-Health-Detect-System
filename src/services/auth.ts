import { v4 as uuidv4 } from 'uuid'

export interface AuthPayload {
  id: string
  fullName: string
  email: string
  password: string
  createdAt: string
  lastLogin?: string
}

const USERS_KEY = 'health-detect-users'

const parseUsers = (): AuthPayload[] => {
  const raw = localStorage.getItem(USERS_KEY) || '[]'
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const saveUsers = (users: AuthPayload[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Email validation function
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Mock email service (in real app, this would send actual emails)
export const sendLoginNotification = async (email: string, fullName: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // In a real app, this would call an email service API
  console.log(`📧 Login notification sent to ${email} for user ${fullName}`)

  // Simulate occasional email delivery failures
  if (Math.random() < 0.05) { // 5% chance of failure
    throw new Error('Email service temporarily unavailable')
  }

  return true
}

export const register = (payload: Omit<AuthPayload, 'id' | 'createdAt'>) => {
  const users = parseUsers()

  // Validate email format
  if (!validateEmail(payload.email)) {
    throw new Error('Invalid email format')
  }

  // Check if email already exists (case insensitive)
  if (users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('Email already registered')
  }

  const user: AuthPayload = {
    ...payload,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    email: payload.email.toLowerCase() // Store emails in lowercase
  }

  users.push(user)
  saveUsers(users)
  return user
}

export const login = async (identifier: string, password: string) => {
  const users = parseUsers()

  // Find user by email or fullName (case insensitive for email)
  const user = users.find((u) =>
    (u.email.toLowerCase() === identifier.toLowerCase() || u.fullName.toLowerCase() === identifier.toLowerCase()) &&
    u.password === password
  )

  if (!user) {
    throw new Error('Invalid credentials')
  }

  // Update last login time
  const updatedUser = { ...user, lastLogin: new Date().toISOString() }
  const userIndex = users.findIndex(u => u.id === user.id)
  users[userIndex] = updatedUser
  saveUsers(users)

  const token = btoa(`${user.id}:${Date.now()}`)

  // Send login notification (don't block login if email fails)
  try {
    await sendLoginNotification(user.email, user.fullName)
  } catch (error) {
    console.warn('Login notification failed:', error)
  }

  return {
    id: updatedUser.id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    token
  }
}

export const demoLogin = async () => {
  const demo = {
    id: 'demo-id',
    fullName: 'Demo User',
    email: 'demo@example.com',
    createdAt: new Date().toISOString()
  }
  const token = btoa('demo:token')

  const users = parseUsers()
  if (!users.find((u) => u.email === demo.email)) {
    users.push({
      ...demo,
      password: 'demo123',
      createdAt: new Date().toISOString()
    })
    saveUsers(users)
  }

  // Send login notification for demo user too
  try {
    await sendLoginNotification(demo.email, demo.fullName)
  } catch (error) {
    console.warn('Demo login notification failed:', error)
  }

  return { ...demo, token }
}

export const resetPassword = (email: string) => {
  const users = parseUsers()

  // Validate email format
  if (!validateEmail(email)) {
    throw new Error('Invalid email format')
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    throw new Error('No account found for this email')
  }
  return true
}

// Get all users (for debugging)
export const getAllUsers = () => {
  return parseUsers()
}
