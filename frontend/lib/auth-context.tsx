"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type UserRole = "customer" | "regulator" | "partner"

export interface User {
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role?: UserRole) => void
  signup: (name: string, email: string, password: string, role?: UserRole) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_USERS: Record<UserRole, User> = {
  customer: { name: "Alex Customer", email: "alex@aperio.app", role: "customer" },
  regulator: { name: "Jordan Regulator", email: "jordan@epa.gov", role: "regulator" },
  partner: { name: "Sam Partner", email: "sam@greencycle.co", role: "partner" },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback((_email: string, _password: string, role: UserRole = "customer") => {
    setUser(MOCK_USERS[role])
  }, [])

  const signup = useCallback((name: string, email: string, _password: string, role: UserRole = "customer") => {
    setUser({ name, email, role })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const switchRole = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role])
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
