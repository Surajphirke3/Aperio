"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, X, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Anomaly } from "@/lib/mockData"

interface AnomalyPanelProps {
  anomalies: Anomaly[]
}

export function AnomalyPanel({ anomalies: initialAnomalies }: AnomalyPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [anomalies, setAnomalies] = useState(initialAnomalies)

  const dismissAnomaly = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id))
  }

  const severityConfig = {
    critical: {
      icon: AlertCircle,
      color: "text-tf-accent-red",
      bg: "bg-tf-accent-red/10",
      border: "border-tf-accent-red/30",
      dot: "bg-tf-accent-red",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-tf-accent-amber",
      bg: "bg-tf-accent-amber/10",
      border: "border-tf-accent-amber/30",
      dot: "bg-tf-accent-amber",
    },
    info: {
      icon: Info,
      color: "text-tf-accent-blue",
      bg: "bg-tf-accent-blue/10",
      border: "border-tf-accent-blue/30",
      dot: "bg-tf-accent-blue",
    },
  }

  if (anomalies.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-tf-bg-tertiary transition-colors"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-tf-accent-red" />
          <span className="font-medium text-tf-text-primary">
            Anomaly Alerts
          </span>
          <span className="px-2 py-0.5 rounded-full bg-tf-accent-red/20 text-tf-accent-red text-xs font-mono">
            {anomalies.length}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-tf-text-secondary transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3">
              {anomalies.map((anomaly) => {
                const config = severityConfig[anomaly.severity]
                const Icon = config.icon

                return (
                  <motion.div
                    key={anomaly.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      config.bg,
                      config.border
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full mt-1.5", config.dot)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-tf-text-primary text-sm">
                        {anomaly.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-tf-text-muted text-xs font-mono">
                          {anomaly.timestamp}
                        </span>
                        {anomaly.link && (
                          <Link
                            href={anomaly.link}
                            className="text-tf-accent-green text-xs hover:underline"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissAnomaly(anomaly.id)}
                      className="h-6 w-6 text-tf-text-muted hover:text-tf-text-primary"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
