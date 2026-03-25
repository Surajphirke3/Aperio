"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Trash2, Filter, Recycle, PackageCheck, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const workflowSteps = [
  { icon: Trash2, label: "Collection", color: "text-amber-500", bg: "bg-amber-500/15" },
  { icon: Filter, label: "Sorting", color: "text-blue-500", bg: "bg-blue-500/15" },
  { icon: Recycle, label: "Processing", color: "text-green-500", bg: "bg-green-500/15" },
  { icon: PackageCheck, label: "Granulation", color: "text-teal-500", bg: "bg-teal-500/15" },
  { icon: Truck, label: "Dispatch", color: "text-indigo-500", bg: "bg-indigo-500/15" },
]

export function LifecycleWorkflow() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h3 className="text-foreground font-semibold mb-6">
        Recycling Lifecycle
      </h3>

      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.label} className="flex items-center gap-2 shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                className="flex flex-col items-center"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", step.bg)}>
                  <Icon className={cn("w-6 h-6", step.color)} />
                </div>
                <span className="text-xs text-muted-foreground mt-2 font-medium">
                  {step.label}
                </span>
              </motion.div>

              {index < workflowSteps.length - 1 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: 32 } : {}}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.3 }}
                  className="h-0.5 bg-border rounded-full mb-6"
                />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
