"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Factory,
  Leaf,
  User,
  Recycle,
  Shield,
  LogOut,
  ChevronDown,
  LogIn,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["customer", "regulator", "partner"] as UserRole[] },
  { href: "/batches", label: "Batches", icon: Package, roles: ["customer", "regulator", "partner"] as UserRole[] },
  { href: "/chat", label: "AI Chat", icon: MessageSquare, roles: ["customer", "regulator", "partner"] as UserRole[] },
  { href: "/vendors", label: "Vendors", icon: Factory, roles: ["regulator", "partner"] as UserRole[] },
  { href: "/carbon", label: "Carbon", icon: Leaf, roles: ["regulator", "partner"] as UserRole[] },
]

const roleConfig: Record<UserRole, { label: string; color: string; icon: typeof User }> = {
  customer: { label: "Customer", color: "text-blue-500 bg-blue-500/10", icon: User },
  regulator: { label: "Regulator", color: "text-purple-500 bg-purple-500/10", icon: Shield },
  partner: { label: "Partner", color: "text-amber-500 bg-amber-500/10", icon: Factory },
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, switchRole, logout } = useAuth()
  const { isSignedIn, user: clerkUser } = useUser()
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)

  const userRole = user?.role || "customer"
  const config = roleConfig[userRole]
  const filteredNav = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] bg-card border-r border-border flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Recycle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-foreground font-semibold text-lg">Aperio</span>
            <span className="text-primary font-mono text-xs ml-2">v2.0</span>
          </div>
        </Link>
      </div>

      {/* Role Badge */}
      {(isAuthenticated || isSignedIn) && (
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                config.color
              )}
            >
              <config.icon className="w-4 h-4" />
              {config.label} View
              <ChevronDown className={cn("w-3 h-3 ml-auto transition-transform", roleDropdownOpen && "rotate-180")} />
            </button>

            {roleDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden"
              >
                {(["customer", "regulator", "partner"] as UserRole[]).map((role) => {
                  const rc = roleConfig[role]
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role)
                        setRoleDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent transition-colors",
                        userRole === role ? "bg-accent font-medium" : "text-muted-foreground"
                      )}
                    >
                      <rc.icon className="w-4 h-4" />
                      {rc.label}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    className={cn(
                      "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-primary/15 rounded-lg border border-primary/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("w-5 h-5 relative z-10", isActive && "text-primary")} />
                    <span className="relative z-10 font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-muted-foreground text-xs">Theme</span>
          <ThemeToggle />
        </div>

        {/* AI Status */}
        <div className="px-3 py-2 rounded-lg bg-secondary">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground font-mono text-xs">
              Featherless AI · Online
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-1 font-mono">
            14 batches · 91.4% complete
          </p>
        </div>

        {/* User — Clerk UserButton or Sign In */}
        {isSignedIn ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <span className="text-foreground text-sm font-medium truncate block">
                {clerkUser?.fullName || clerkUser?.firstName || "User"}
              </span>
              <span className="text-muted-foreground text-xs truncate block">
                {clerkUser?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        ) : (
          <SignInButton mode="modal">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <LogIn className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Sign In</span>
            </button>
          </SignInButton>
        )}
      </div>
    </aside>
  )
}
