"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface Stage {
  name: string
  completeness: number
  status: "complete" | "pending" | "anomaly"
}

interface TraceabilityScoreProps {
  score: number
  stages: Stage[]
}

export function TraceabilityScore({ score, stages }: TraceabilityScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      setAnimatedScore(Math.round(score * eased))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [score])

  const getScoreColor = () => {
    if (score < 80) return "text-tf-accent-red"
    if (score < 95) return "text-tf-accent-amber"
    return "text-tf-accent-green"
  }

  const getScoreBg = () => {
    if (score < 80) return "from-tf-accent-red/20 to-tf-accent-red/5"
    if (score < 95) return "from-tf-accent-amber/20 to-tf-accent-amber/5"
    return "from-tf-accent-green/20 to-tf-accent-green/5"
  }

  const getStatusLabel = () => {
    if (score < 80) return "Incomplete"
    if (score < 95) return "Partial"
    return "Complete"
  }

  const strokeDasharray = 251.2 // 2 * PI * 40 (radius)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * animatedScore) / 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br border border-tf-border rounded-lg p-6",
        getScoreBg()
      )}
    >
      <h3 className="text-tf-text-primary font-semibold mb-4">
        TRACEABILITY SCORE
      </h3>

      <div className="flex items-center gap-6">
        {/* Radial Progress */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-tf-bg-tertiary"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={getScoreColor()}
              stroke="currentColor"
              initial={{ strokeDasharray, strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-bold font-mono", getScoreColor())}>
              {animatedScore}%
            </span>
            <span className="text-tf-text-muted text-xs">{getStatusLabel()}</span>
          </div>
        </div>

        {/* Stage Breakdown */}
        <div className="flex-1 space-y-2">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="flex items-center gap-3"
            >
              {stage.status === "complete" ? (
                <CheckCircle2 className="w-4 h-4 text-tf-accent-green flex-shrink-0" />
              ) : stage.status === "pending" ? (
                <Clock className="w-4 h-4 text-tf-text-muted flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-tf-accent-red flex-shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm flex-1",
                  stage.status === "complete"
                    ? "text-tf-text-secondary"
                    : "text-tf-text-muted"
                )}
              >
                {stage.name} stage
              </span>
              <span
                className={cn(
                  "text-xs font-mono",
                  stage.status === "complete"
                    ? "text-tf-accent-green"
                    : "text-tf-text-muted"
                )}
              >
                {stage.completeness}%
                {stage.status === "pending" && " — not logged"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Impact Warning */}
      {score < 80 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 pt-4 border-t border-tf-border/50"
        >
          <p className="text-tf-text-muted text-sm">
            <span className="text-tf-accent-amber font-medium">Missing data impacts:</span>{" "}
            compliance score, carbon calculations, vendor settlement
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
