"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useUser, useClerk } from "@clerk/nextjs"

export type UserRole = "customer" | "regulator" | "partner"

export interface User {
  name: string
  email: string
  role: UserRole
  avatar?: string
  clerkId?: string
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [role, setRole] = useState<UserRole>("customer")
  const [user, setUser] = useState<User | null>(null)

  // Sync Clerk user state into our auth context
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      setUser({
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        role: role,
        avatar: clerkUser.imageUrl,
        clerkId: clerkUser.id,
      })
    } else if (isLoaded && !isSignedIn) {
      setUser(null)
    }
  }, [isLoaded, isSignedIn, clerkUser, role])

  // Legacy login — redirect to Clerk sign-in
  const login = useCallback((_email: string, _password: string, loginRole: UserRole = "customer") => {
    setRole(loginRole)
    // Clerk handles actual authentication — this is for role selection
    window.location.href = "/sign-in"
  }, [])

  // Legacy signup — redirect to Clerk sign-up
  const signup = useCallback((_name: string, _email: string, _password: string, signupRole: UserRole = "customer") => {
    setRole(signupRole)
    window.location.href = "/sign-up"
  }, [])

  // Logout via Clerk
  const logout = useCallback(async () => {
    setUser(null)
    await signOut()
  }, [signOut])

  // Role switching still works the same
  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole)
    if (user) {
      setUser((prev) => prev ? { ...prev, role: newRole } : null)
    }
  }, [user])

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
