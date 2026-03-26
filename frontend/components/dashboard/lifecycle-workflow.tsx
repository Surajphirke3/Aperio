"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Trash2, Filter, Recycle, PackageCheck, Truck, ChevronRight, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { batches } from "@/lib/mockData"

/* Phase lookup from batch stages + status */
const workflowPhases = [
  {
    id: "collection",
    icon: Trash2,
    label: "Collection",
    color: "text-amber-500",
    bg: "bg-amber-500/15",
    borderActive: "border-amber-500",
    glowActive: "shadow-amber-500/20",
  },
  {
    id: "sorting",
    icon: Filter,
    label: "Sorting",
    color: "text-blue-500",
    bg: "bg-blue-500/15",
    borderActive: "border-blue-500",
    glowActive: "shadow-blue-500/20",
  },
  {
    id: "processing",
    icon: Recycle,
    label: "Processing",
    color: "text-green-500",
    bg: "bg-green-500/15",
    borderActive: "border-green-500",
    glowActive: "shadow-green-500/20",
  },
  {
    id: "granulation",
    icon: PackageCheck,
    label: "Granulation",
    color: "text-teal-500",
    bg: "bg-teal-500/15",
    borderActive: "border-teal-500",
    glowActive: "shadow-teal-500/20",
  },
  {
    id: "dispatch",
    icon: Truck,
    label: "Dispatch",
    color: "text-indigo-500",
    bg: "bg-indigo-500/15",
    borderActive: "border-indigo-500",
    glowActive: "shadow-indigo-500/20",
  },
]

/* Determine which phase a batch is in based on stages completed */
function getBatchPhase(batch: typeof batches[0]) {
  if (batch.status === "complete") return 4 // dispatch
  if (batch.stages <= 1) return 0 // collection
  if (batch.stages === 2) return 1 // sorting
  if (batch.stages === 3) return 2 // processing
  if (batch.stages === 4) return 3 // granulation
  return 4 // dispatch
}

function getPhaseStatusIcon(status: string) {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
    case "anomaly":
      return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
    case "active":
      return <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
    case "warning":
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
    default:
      return <Clock className="w-3.5 h-3.5 text-muted-foreground" />
  }
}

/* Compute phase summary from real batch data */
function computePhaseStats() {
  const phaseMap: Record<number, { count: number; totalKg: number; batchIds: string[]; statuses: string[] }> = {}
  for (let i = 0; i < 5; i++) {
    phaseMap[i] = { count: 0, totalKg: 0, batchIds: [], statuses: [] }
  }

  batches.forEach((batch) => {
    const phase = getBatchPhase(batch)
    phaseMap[phase].count++
    phaseMap[phase].totalKg += batch.inputKg
    phaseMap[phase].batchIds.push(batch.id)
    phaseMap[phase].statuses.push(batch.status)
  })

  return phaseMap
}

export function LifecycleWorkflow() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null)
  const phaseStats = computePhaseStats()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-foreground font-semibold">
          Recycling Lifecycle
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Complete
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            In Progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Attention
          </span>
        </div>
      </div>

      {/* Phase flow */}
      <div className="flex items-start justify-between gap-1 overflow-x-auto pb-2">
        {workflowPhases.map((phase, index) => {
          const Icon = phase.icon
          const stats = phaseStats[index]
          const isActive = stats.count > 0
          const hasAnomaly = stats.statuses.includes("anomaly")
          const hasWarning = stats.statuses.includes("warning")
          const isSelected = selectedPhase === index

          return (
            <div key={phase.label} className="flex items-center gap-1 flex-1 min-w-0">
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
                onClick={() => setSelectedPhase(isSelected ? null : index)}
                className={cn(
                  "flex flex-col items-center w-full p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer group",
                  isSelected
                    ? `${phase.borderActive} ${phase.glowActive} shadow-lg bg-card`
                    : isActive
                    ? "border-border hover:border-primary/30 bg-card hover:shadow-md"
                    : "border-transparent bg-secondary/50 opacity-60"
                )}
              >
                {/* Icon + status indicator */}
                <div className="relative">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-colors", phase.bg)}>
                    <Icon className={cn("w-5 h-5", phase.color)} />
                  </div>
                  {/* Status dot */}
                  {isActive && (
                    <div className={cn(
                      "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-card",
                      hasAnomaly ? "bg-red-500" : hasWarning ? "bg-amber-500" : "bg-green-500"
                    )}>
                      <span className="text-[8px] font-bold text-white">{stats.count}</span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span className="text-xs font-medium mt-2 text-foreground">{phase.label}</span>

                {/* Sub-metric */}
                <span className={cn(
                  "text-[10px] font-mono mt-0.5",
                  isActive ? "text-muted-foreground" : "text-muted-foreground/50"
                )}>
                  {isActive ? `${(stats.totalKg / 1000).toFixed(1)}t` : "—"}
                </span>
              </motion.button>

              {/* Connector arrow */}
              {index < workflowPhases.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={inView ? { opacity: 1, width: 24 } : {}}
                  transition={{ delay: index * 0.08 + 0.05, duration: 0.3 }}
                  className="flex items-center justify-center shrink-0 mb-6"
                >
                  <ChevronRight className="w-4 h-4 text-border" />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {selectedPhase !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", workflowPhases[selectedPhase].bg)}>
                  {(() => {
                    const PhaseIcon = workflowPhases[selectedPhase].icon
                    return <PhaseIcon className={cn("w-3.5 h-3.5", workflowPhases[selectedPhase].color)} />
                  })()}
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  {workflowPhases[selectedPhase].label} Phase
                </h4>
                <span className="text-xs text-muted-foreground">
                  — {phaseStats[selectedPhase].count} batch{phaseStats[selectedPhase].count !== 1 ? "es" : ""}
                </span>
              </div>

              {phaseStats[selectedPhase].count > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {phaseStats[selectedPhase].batchIds.map((batchId, i) => {
                    const batch = batches.find((b) => b.id === batchId)!
                    return (
                      <div
                        key={batchId}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 border border-border text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {getPhaseStatusIcon(batch.status)}
                          <div className="min-w-0">
                            <p className="font-mono text-xs text-foreground font-medium truncate">{batchId}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{batch.material}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-mono text-xs text-foreground">{batch.inputKg.toLocaleString()} kg</p>
                          <p className={cn("text-[10px] font-mono", 
                            batch.completeness === 100 ? "text-green-500" : "text-amber-500"
                          )}>
                            {batch.completeness}%
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  No batches currently in this phase.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
