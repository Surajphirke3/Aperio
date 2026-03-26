"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Batch } from "@/lib/mockData"

interface BatchCardProps {
  batch: Batch
  index?: number
}

export function BatchCard({ batch, index = 0 }: BatchCardProps) {
  const statusConfig = {
    complete: {
      label: "COMPLETE",
      color: "bg-tf-accent-green/20 text-tf-accent-green border-tf-accent-green/30",
      dot: "bg-tf-accent-green",
    },
    active: {
      label: "ACTIVE",
      color: "bg-tf-accent-blue/20 text-tf-accent-blue border-tf-accent-blue/30",
      dot: "bg-tf-accent-blue",
    },
    anomaly: {
      label: "ANOMALY",
      color: "bg-tf-accent-red/20 text-tf-accent-red border-tf-accent-red/30",
      dot: "bg-tf-accent-red",
    },
    warning: {
      label: "WARNING",
      color: "bg-tf-accent-amber/20 text-tf-accent-amber border-tf-accent-amber/30",
      dot: "bg-tf-accent-amber",
    },
  }

  const config = statusConfig[batch.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, borderColor: "var(--accent-green)" }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", config.dot)} />
          <span className="text-tf-text-primary font-mono font-semibold">
            {batch.id}
          </span>
        </div>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium border",
            config.color
          )}
        >
          {config.label}
        </span>
      </div>

      {/* Material & Vendor */}
      <p className="text-tf-text-secondary text-sm mb-4">
        {batch.material} · {batch.vendor}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-tf-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${batch.completeness}%` }}
            transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
            className={cn(
              "h-full rounded-full",
              batch.status === "anomaly"
                ? "bg-tf-accent-red"
                : batch.status === "warning"
                ? "bg-tf-accent-amber"
                : "bg-tf-accent-green"
            )}
          />
        </div>
        <p className="text-tf-text-muted text-xs mt-1 font-mono">
          {batch.completeness}% complete
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <span className="text-tf-text-primary font-mono">
          {batch.inputKg.toLocaleString()} kg in
        </span>
        <ArrowRight className="w-4 h-4 text-tf-text-muted" />
        <span className="text-tf-text-primary font-mono">
          {batch.outputKg.toLocaleString()} kg out
        </span>
        <span className="text-tf-accent-red font-mono ml-auto">
          △ {batch.lossKg.toLocaleString()} kg
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-tf-border">
        <p className="text-tf-text-muted text-xs">
          {batch.stages} stages · Started {batch.date} · {batch.status === "complete" ? "Completed" : "Active"}
        </p>
        <Link
          href={`/batches/${batch.id}`}
          className="text-tf-accent-green text-sm hover:underline flex items-center gap-1"
        >
          View
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  )
}
