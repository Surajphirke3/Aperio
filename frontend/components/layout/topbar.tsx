"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface TopBarProps {
  title: string
  subtitle?: string
}

const roleColors = {
  customer: "bg-blue-500/15 text-blue-500",
  regulator: "bg-purple-500/15 text-purple-500",
  partner: "bg-amber-500/15 text-amber-500",
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const { user } = useAuth()
  const router = useRouter()

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
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Time */}
          <span className="text-muted-foreground font-mono text-sm hidden sm:block">
            {currentTime}
          </span>

          {/* Role Badge */}
          {user && (
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium capitalize",
                roleColors[user.role]
              )}
            >
              {user.role}
            </span>
          )}

          {/* Chat shortcut */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={() => router.push("/chat")}
            title="AI Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>

          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
          </Button>
        </div>
      </div>
    </header>
  )
}
