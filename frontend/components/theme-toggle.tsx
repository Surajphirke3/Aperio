"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className={`w-9 h-9 ${className}`} />

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: [1, 0.8, 1] }}
        transition={{ duration: 0.4 }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-300" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </motion.div>
    </button>
  )
}
