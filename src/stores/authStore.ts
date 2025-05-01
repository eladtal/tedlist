import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  _id: string
  email: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isInitialized: boolean
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
    (set) => ({
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