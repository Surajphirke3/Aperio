"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, MessageCircle, X, AlertTriangle, AlertCircle, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { batches, vendors, anomalies } from "@/lib/mockData"
import { AnimatePresence, motion } from "framer-motion"

interface TopBarProps {
  title: string
  subtitle?: string
}

const roleColors = {
  customer: "bg-blue-500/15 text-blue-500",
  regulator: "bg-purple-500/15 text-purple-500",
  stakeholder: "bg-amber-500/15 text-amber-500",
}

/* ── Notification data ── */
const notifications = [
  {
    id: "n1",
    type: "critical" as const,
    title: "Processing Loss Alert",
    message: "Batch B-2024-089 PET processing loss at 34.2% — exceeds 20% threshold.",
    time: "2 hours ago",
    read: false,
    link: "/batches/B-2024-089",
  },
  {
    id: "n2",
    type: "warning" as const,
    title: "Delivery Gap",
    message: "GreenCycle Industries: No delivery recorded in 8 days.",
    time: "4 hours ago",
    read: false,
    link: "/vendors",
  },
  {
    id: "n3",
    type: "warning" as const,
    title: "Incomplete Data",
    message: "Batch B-2024-091 completeness at 67%. Missing stage data.",
    time: "6 hours ago",
    read: false,
    link: "/batches/B-2024-091",
  },
  {
    id: "n4",
    type: "info" as const,
    title: "Weekly Dispatch Down",
    message: "HDPE dispatch volume down 15% vs 4-week average.",
    time: "8 hours ago",
    read: true,
  },
  {
    id: "n5",
    type: "info" as const,
    title: "Carbon Target On Track",
    message: "CO₂ savings on track to exceed monthly target by 12%.",
    time: "1 day ago",
    read: true,
  },
]

/* ── Search index (batches + vendors) ── */
type SearchResult = {
  id: string
  label: string
  sublabel: string
  type: "batch" | "vendor"
  link: string
}

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []
  batches.forEach((b) => {
    results.push({
      id: b.id,
      label: b.id,
      sublabel: `${b.material} · ${b.vendor} · ${b.status}`,
      type: "batch",
      link: `/batches/${b.id}`,
    })
  })
  vendors.forEach((v) => {
    results.push({
      id: `vendor-${v.id}`,
      label: v.name,
      sublabel: `${v.materials.join(", ")} · Score: ${v.score}`,
      type: "vendor",
      link: `/vendors`,
    })
  })
  return results
}

const searchIndex = buildSearchIndex()

/* ── Notification icon helper ── */
function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case "critical":
      return <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
    case "warning":
      return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
    default:
      return <Info className="w-4 h-4 text-blue-500 shrink-0" />
  }
}

/* ═══════════════════════════════════════
   TOP BAR
═══════════════════════════════════════ */
export function TopBar({ title, subtitle }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const { user } = useAuth()
  const router = useRouter()

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifList, setNotifList] = useState(notifications)
  const notifRef = useRef<HTMLDivElement>(null)

  // Search state
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifList.filter((n) => !n.read).length

  // Time
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

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  // Search logic
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim().length === 0) {
      setSearchResults([])
      return
    }
    const q = query.toLowerCase()
    const results = searchIndex.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel.toLowerCase().includes(q)
    )
    setSearchResults(results)
  }, [])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Mark all as read
  const markAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })))
  }

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

          {/* ── Search ── */}
          <div ref={searchRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => {
                setShowSearch(!showSearch)
                setShowNotifications(false)
              }}
            >
              <Search className="w-5 h-5" />
            </Button>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-[380px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Search input */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search batches, vendors..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
                    />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(""); setSearchResults([]) }}>
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Results */}
                  <div className="max-h-[320px] overflow-y-auto">
                    {searchQuery.trim().length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        Type to search batches, vendors, or materials...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        No results for &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            router.push(result.link)
                            setShowSearch(false)
                            setSearchQuery("")
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-b border-border/50 last:border-0"
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                            result.type === "batch"
                              ? "bg-primary/15 text-primary"
                              : "bg-amber-500/15 text-amber-500"
                          )}>
                            {result.type === "batch" ? "B" : "V"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {result.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {result.sublabel}
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Notifications ── */}
          <div ref={notifRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowSearch(false)
              }}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-[400px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification list */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifList.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id)
                          if (notif.link) {
                            router.push(notif.link)
                            setShowNotifications(false)
                          }
                        }}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors text-left border-b border-border/50 last:border-0",
                          !notif.read && "bg-primary/[0.03]"
                        )}
                      >
                        <div className="mt-0.5">
                          <NotifIcon type={notif.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "text-sm truncate",
                              notif.read ? "text-muted-foreground" : "text-foreground font-medium"
                            )}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1 font-mono">
                            {notif.time}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
