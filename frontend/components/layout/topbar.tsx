"use client"

import { useEffect, useState } from "react"
import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-tf-bg-primary/80 backdrop-blur-sm border-b border-tf-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-tf-text-primary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-tf-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Time */}
          <span className="text-tf-text-secondary font-mono text-sm hidden sm:block">
            {currentTime}
          </span>

          {/* Hackniche Badge */}
          <span className="px-3 py-1 rounded-full bg-tf-accent-amber/20 text-tf-accent-amber text-xs font-medium">
            Hackniche 4.0 Demo
          </span>

          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="text-tf-text-secondary hover:text-tf-text-primary hover:bg-tf-bg-secondary"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-tf-text-secondary hover:text-tf-text-primary hover:bg-tf-bg-secondary"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tf-accent-red" />
          </Button>
        </div>
      </div>
    </header>
  )
}
