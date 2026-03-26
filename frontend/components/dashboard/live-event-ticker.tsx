"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

const events = [
  { type: "info", text: "B-2024-090: 120 kg HDPE added to sorting stage", time: "just now" },
  { type: "success", text: "GreenCycle Industries delivery confirmed — 340 kg PET", time: "1m ago" },
  { type: "success", text: "B-2024-088: Processing stage completed (output: 2,325 kg)", time: "3m ago" },
  { type: "warning", text: "AI flagged moisture anomaly in B-2024-091", time: "5m ago" },
  { type: "success", text: "Dispatch confirmed: 180 kg PET granules → Buyer Corp", time: "8m ago" },
  { type: "info", text: "B-2024-090 contaminant scan complete — 98.2% clean", time: "11m ago" },
  { type: "info", text: "New batch B-2024-093 auto-created from chat entry", time: "14m ago" },
  { type: "carbon", text: "Carbon offset updated: +1.2 kg CO₂ avoided", time: "17m ago" },
  { type: "info", text: "Vendor EcoPoly Ltd: quality score recalculated — 88.4", time: "20m ago" },
  { type: "success", text: "Weekly report generated: 18,420 kg tracked this week", time: "23m ago" },
]

const typeColors: Record<string, string> = {
  success: "bg-tf-accent-green",
  warning: "bg-tf-accent-amber",
  info: "bg-tf-accent-blue",
  carbon: "bg-tf-accent-teal",
}

export function LiveEventTicker() {
  const [displayedEvents, setDisplayedEvents] = useState(events.slice(0, 5))
  const [eventIndex, setEventIndex] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedEvents((prev) => {
        const newEvent = events[eventIndex % events.length]
        // Update time to "just now" for new events
        const eventWithUpdatedTime = { ...newEvent, time: "just now" }
        // Update times for existing events
        const updatedPrev = prev.slice(0, 4).map((e, idx) => ({
          ...e,
          time: idx === 0 ? "1m ago" : `${(idx + 1) * 2 + 1}m ago`
        }))
        return [eventWithUpdatedTime, ...updatedPrev]
      })
      setEventIndex((prev) => prev + 1)
    }, 6000)

    return () => clearInterval(interval)
  }, [eventIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-tf-accent-green" />
        <span className="text-tf-text-primary font-semibold text-sm">
          Live Operations Feed
        </span>
        <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-pulse ml-auto" />
      </div>

      {/* Events List */}
      <div className="space-y-2 h-[200px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {displayedEvents.map((event, index) => (
            <motion.div
              key={`${event.text}-${eventIndex - displayedEvents.length + index}`}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1 - index * 0.15, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-start gap-3 text-sm"
            >
              <span
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[event.type]}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-tf-text-secondary truncate">{event.text}</p>
              </div>
              <span className="text-tf-text-muted text-xs whitespace-nowrap">
                {event.time}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
