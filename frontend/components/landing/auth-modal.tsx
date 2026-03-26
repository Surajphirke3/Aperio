"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Recycle, User, Shield, Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

const roles: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { value: "customer", label: "Customer", icon: User, description: "Track your recycling journey" },
  { value: "regulator", label: "Regulator", icon: Shield, description: "Full compliance & analytics" },
  { value: "partner", label: "Partner", icon: Handshake, description: "Business insights & KPIs" },
]

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const { login, signup } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "login") {
      login(email, password, selectedRole)
    } else {
      signup(name, email, password, selectedRole)
    }
    onClose()
    router.push("/dashboard")
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {mode === "login" ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {mode === "login"
                        ? "Sign in to your Aperio account"
                        : "Join the recycling revolution"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Role Selector */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Select your role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((role) => {
                      const Icon = role.icon
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={cn(
                            "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all",
                            selectedRole === role.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium text-xs">{role.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Name (signup only) */}
                {mode === "signup" && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 rounded-xl"
                >
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Button>

                {/* Toggle mode */}
                <p className="text-center text-sm text-muted-foreground">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
