"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useUser, useClerk } from "@clerk/nextjs"

export type UserRole = "customer" | "regulator" | "stakeholder"

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
  login: () => void
  signup: () => void
  logout: () => void
  switchRole: (role: UserRole) => void
  isRoleUnassigned: boolean
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
      const storedRole = clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role
      const clerkRole = (storedRole as UserRole) || role
      setUser({
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        role: clerkRole,
        avatar: clerkUser.imageUrl,
        clerkId: clerkUser.id,
      })
    } else if (isLoaded && !isSignedIn) {
      setUser(null)
    }
  }, [isLoaded, isSignedIn, clerkUser, role])

  // Simple single-step authentication redirects
  const login = useCallback(() => {
    window.location.href = "/sign-in"
  }, [])

  const signup = useCallback(() => {
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

  const isRoleUnassigned = !!(isLoaded && isSignedIn && clerkUser && !clerkUser.publicMetadata?.role && !clerkUser.unsafeMetadata?.role)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, switchRole, isRoleUnassigned }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
