"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Recycle, User, Shield, Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const roles: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { value: "customer", label: "Customer", icon: User, description: "Track your recycling journey" },
  { value: "regulator", label: "Regulator", icon: Shield, description: "Full compliance & analytics" },
  { value: "stakeholder", label: "Stakeholder", icon: Handshake, description: "Business insights & KPIs" },
]

export function RoleSelectionModal() {
  const { isRoleUnassigned, switchRole } = useAuth()
  const { user: clerkUser } = useUser()
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer")
  const [loading, setLoading] = useState(false)
  const [closed, setClosed] = useState(false)

  if (!isRoleUnassigned || closed) return null

  const handleSave = async () => {
    setLoading(true)
    try {
      if (clerkUser) {
        await clerkUser.update({
          unsafeMetadata: {
            ...clerkUser.unsafeMetadata,
            role: selectedRole,
          },
        })
        await clerkUser.reload()
      }
      switchRole(selectedRole)
      setClosed(true)
    } catch (e) {
      console.error("Failed to update role", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-md border border-border rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Recycle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Complete Profile</h2>
            <p className="text-sm text-muted-foreground">Select your primary role to continue to the dashboard.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <button
                key={r.value}
                onClick={() => setSelectedRole(r.value)}
                className={cn(
                  "relative flex flex-col items-center text-center gap-2 p-4 rounded-xl border transition-all",
                  selectedRole === r.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium text-sm">{r.label}</span>
              </button>
            )
          })}
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 rounded-xl block"
        >
          {loading ? "Saving Profile..." : "Continue to Dashboard"}
        </Button>
      </motion.div>
    </div>
  )
}
