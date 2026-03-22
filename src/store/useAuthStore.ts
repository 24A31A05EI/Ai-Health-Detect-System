import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthUser {
  id: string
  fullName: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  theme: 'light' | 'dark'
  isAuthenticated: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      theme: 'light',
      isAuthenticated: false,
      login: (user: AuthUser, token: string) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setTheme: (theme: 'light' | 'dark') => set({ theme })
    }),
    {
      name: 'health-detect-auth',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
