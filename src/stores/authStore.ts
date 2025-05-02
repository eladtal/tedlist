import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_BASE_URL } from '../config'

interface User {
  _id: string
  email: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
  isAdmin: boolean
  adminPrivileges: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isInitialized: boolean
  validateToken: () => Promise<boolean>
}

// Try to get initial state from localStorage
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    console.log('Initial auth state:', { hasUser: !!storedUser, hasToken: !!storedToken })
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken,
      isInitialized: true
    }
  } catch (error) {
    console.error('Failed to get stored auth state:', error)
    return {
      user: null,
      token: null,
      isInitialized: true
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      login: (token: string, user: User) => {
        console.log('Logging in, setting auth state')
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ token, user })
      },
      logout: () => {
        console.log('Logging out, clearing auth state')
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
      validateToken: async () => {
        const token = get().token
        if (!token) return false

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          const data = await response.json()
          
          if (!response.ok) {
            console.error('Token validation failed:', data)
            if (response.status === 401 || data.message === 'User not found' || data.message === 'Invalid token') {
              get().logout()
              return false
            }
          }

          // Update user data if validation successful
          if (data.user) {
            set({ user: data.user })
          }
          
          return true
        } catch (error) {
          console.error('Token verification error:', error)
          get().logout()
          return false
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated auth state:', {
          hasUser: !!state?.user,
          hasToken: !!state?.token
        })
      }
    }
  )
) 