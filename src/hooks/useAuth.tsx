import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import api from '@/lib/api'

interface AuthUser {
  email: string
  role: 'ADMIN' | 'CLIENT'
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [token, setToken]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('bm_token')
    const storedRole  = localStorage.getItem('bm_role') as 'ADMIN' | 'CLIENT' | null
    const storedEmail = localStorage.getItem('bm_email')
    if (storedToken && storedRole && storedEmail) {
      setToken(storedToken)
      setUser({ email: storedEmail, role: storedRole })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password })
    const { token: tk, role, email: em } = res.data
    localStorage.setItem('bm_token', tk)
    localStorage.setItem('bm_role', role)
    localStorage.setItem('bm_email', em)
    setToken(tk)
    setUser({ email: em, role })
  }

  const register = async (email: string, password: string) => {
    const res = await api.post('/api/auth/register', { email, password })
    const { token: tk, role, email: em } = res.data
    localStorage.setItem('bm_token', tk)
    localStorage.setItem('bm_role', role)
    localStorage.setItem('bm_email', em)
    setToken(tk)
    setUser({ email: em, role })
  }

  const logout = () => {
    localStorage.removeItem('bm_token')
    localStorage.removeItem('bm_role')
    localStorage.removeItem('bm_email')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
