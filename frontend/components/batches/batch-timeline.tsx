"use client"

import { motion } from "framer-motion"
import { Check, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stage {
  stage: string
  timestamp: string
  inputKg: number | null
  outputKg: number | null
  lossKg: number | null
  lossPercent: number | null
  status: string
  location: string
  method: string
  notes: string
}

interface BatchTimelineProps {
  stages: Stage[]
}

export function BatchTimeline({ stages }: BatchTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <Check className="w-4 h-4" />
      case "anomaly":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-tf-accent-green text-tf-bg-primary"
      case "anomaly":
        return "bg-tf-accent-red text-white"
      default:
        return "bg-tf-bg-tertiary text-tf-text-muted"
    }
  }

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "complete":
        return "border-tf-accent-green"
      case "anomaly":
        return "border-tf-accent-red"
      default:
        return "border-tf-border"
    }
  }

  return (
    <div className="space-y-0">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.stage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 }}
          className="relative"
        >
          {/* Connector Line */}
          {index < stages.length - 1 && (
            <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-tf-border" />
          )}

          <div className="flex gap-4">
            {/* Stage Indicator */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                getStatusColor(stage.status)
              )}
            >
              {getStatusIcon(stage.status)}
            </div>

            {/* Stage Content */}
            <div className="flex-1 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-tf-text-primary font-semibold">
                  {stage.stage}
                </h3>
                <span className="text-tf-text-muted text-sm font-mono">
                  {stage.timestamp}
                </span>
              </div>

              {/* Card */}
              <div
                className={cn(
                  "bg-tf-bg-secondary border rounded-lg p-4",
                  getStatusBorder(stage.status)
                )}
              >
                {stage.inputKg !== null ? (
                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {stage.outputKg !== null && stage.outputKg !== stage.inputKg ? (
                        <>
                          <span className="text-tf-text-secondary">
                            Input:{" "}
                            <span className="text-tf-text-primary font-mono">
                              {stage.inputKg.toLocaleString()} kg
                            </span>
                          </span>
                          <span className="text-tf-text-secondary">
                            Output:{" "}
                            <span className="text-tf-text-primary font-mono">
                              {stage.outputKg?.toLocaleString()} kg
                            </span>
                          </span>
                        </>
                      ) : (
                        <span className="text-tf-text-secondary">
                          Input:{" "}
                          <span className="text-tf-text-primary font-mono">
                            {stage.inputKg.toLocaleString()} kg
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Loss Badge */}
                    {stage.lossKg !== null && stage.lossKg > 0 && (
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm",
                          stage.status === "anomaly"
                            ? "bg-tf-accent-red/20 text-tf-accent-red"
                            : "bg-tf-bg-tertiary text-tf-text-secondary"
                        )}
                      >
                        <span>
                          Loss: {stage.lossKg.toLocaleString()} kg (
                          {stage.lossPercent?.toFixed(1)}%)
                        </span>
                        {stage.status === "anomaly" && (
                          <span className="font-semibold">ANOMALY</span>
                        )}
                      </div>
                    )}

                    {/* Location & Method */}
                    {stage.location && (
                      <p className="text-tf-text-muted text-sm">
                        Location: {stage.location}
                      </p>
                    )}
                    {stage.method && (
                      <p className="text-tf-text-muted text-sm">
                        Method: {stage.method}
                      </p>
                    )}

                    {/* Notes */}
                    {stage.notes && (
                      <p className="text-tf-text-secondary text-sm border-l-2 border-tf-border pl-3">
                        {stage.notes}
                      </p>
                    )}

                    {/* Status */}
                    <div className="flex items-center gap-2 text-sm pt-2">
                      <span className="text-tf-text-muted">Status:</span>
                      <span
                        className={cn(
                          stage.status === "complete" && "text-tf-accent-green",
                          stage.status === "anomaly" && "text-tf-accent-red",
                          stage.status === "pending" && "text-tf-text-muted"
                        )}
                      >
                        {stage.status === "complete" && "Complete"}
                        {stage.status === "anomaly" && "Anomaly Detected"}
                        {stage.status === "pending" && "Pending"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-tf-text-muted text-sm">
                    {stage.location || "Awaiting data entry..."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loss Indicator Between Stages */}
          {index < stages.length - 1 && stages[index + 1].lossKg && stages[index + 1].lossKg! > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.15 + 0.3 }}
              className="ml-4 pl-8 -mt-4 mb-4"
            >
              <span className="text-tf-accent-red text-xs font-mono">
                ↓ {stages[index + 1].lossKg?.toLocaleString()} kg loss (
                {stages[index + 1].lossPercent?.toFixed(1)}%)
              </span>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
