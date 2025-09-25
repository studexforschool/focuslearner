import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Demo account check
          if (email === 'demo@focuslearner.com' && password === 'demo123') {
            const user = {
              id: '1',
              email: 'demo@focuslearner.com',
              name: 'Demo User'
            }
            set({ user, isAuthenticated: true, loading: false })
            return
          }
          
          // For demo purposes, accept any valid email/password
          if (email.includes('@') && password.length >= 6) {
            const user = {
              id: Date.now().toString(),
              email,
              name: email.split('@')[0]
            }
            set({ user, isAuthenticated: true, loading: false })
          } else {
            throw new Error('Invalid credentials')
          }
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ loading: true })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const user = {
            id: Date.now().toString(),
            email,
            name
          }
          
          set({ user, isAuthenticated: true, loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
