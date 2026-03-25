"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Factory,
  Leaf,
  User,
  Recycle,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/batches", label: "Batches", icon: Package },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/vendors", label: "Vendors", icon: Factory },
  { href: "/carbon", label: "Carbon", icon: Leaf },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] bg-tf-bg-primary border-r border-tf-border flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-tf-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-tf-accent-green/20 flex items-center justify-center">
            <Recycle className="w-6 h-6 text-tf-accent-green" />
          </div>
          <div>
            <span className="text-tf-text-primary font-semibold text-lg">Aperio</span>
            <span className="text-tf-accent-green font-mono text-xs ml-2">v2.0</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    className={cn(
                      "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "text-tf-text-primary"
                        : "text-tf-text-secondary hover:text-tf-text-primary hover:bg-tf-bg-secondary"
                    )}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-tf-accent-green/20 rounded-lg border border-tf-accent-green/30"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("w-5 h-5 relative z-10", isActive && "text-tf-accent-green")} />
                    <span className="relative z-10 font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-tf-border space-y-4">
        {/* AI Status */}
        <div className="px-3 py-2 rounded-lg bg-tf-bg-secondary">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-pulse" />
            <span className="text-tf-text-secondary font-mono text-xs">
              Featherless AI · Online
            </span>
          </div>
          <p className="text-tf-text-muted text-xs mt-1 font-mono">
            14 batches · 91.4% complete
          </p>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-tf-bg-tertiary flex items-center justify-center">
            <User className="w-4 h-4 text-tf-text-secondary" />
          </div>
          <span className="text-tf-text-secondary text-sm">Demo User</span>
        </div>
      </div>
    </aside>
  )
}
