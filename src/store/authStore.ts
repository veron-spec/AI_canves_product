import { create } from 'zustand'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 1500))
    set({
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
      },
      isAuthenticated: true,
      isLoading: false,
    })
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 1500))
    set({
      user: {
        id: '1',
        email,
        name,
      },
      isAuthenticated: true,
      isLoading: false,
    })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
}))
