"use client"

import { motion } from "framer-motion"
import { BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LossAnalysisNarrativeProps {
  inputKg: number
  sortingLossKg: number
  sortingLossPercent: number
  processingLossKg: number
  processingLossPercent: number
  currentOutputKg: number
  stagesRemaining: number
}

export function LossAnalysisNarrative({
  inputKg,
  sortingLossKg,
  sortingLossPercent,
  processingLossKg,
  processingLossPercent,
  currentOutputKg,
  stagesRemaining,
}: LossAnalysisNarrativeProps) {
  const efficiencySoFar = ((currentOutputKg / inputKg) * 100).toFixed(1)
  const isProcessingHigh = processingLossPercent > 20
  const isSortingNormal = sortingLossPercent <= 20

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-tf-accent-green" />
        <h3 className="text-tf-text-primary font-semibold">
          Loss Analysis — Plain English
        </h3>
      </div>

      <div className="space-y-4 text-tf-text-secondary leading-relaxed">
        {/* Starting point */}
        <p>
          You started with{" "}
          <span className="text-tf-text-primary font-semibold font-mono">
            {inputKg.toLocaleString()} kg
          </span>{" "}
          of PET bottles.
        </p>

        {/* Sorting analysis */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {isSortingNormal ? (
              <CheckCircle2 className="w-4 h-4 text-tf-accent-green" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-tf-accent-amber" />
            )}
          </div>
          <p>
            <span className="text-tf-text-primary font-medium">Sorting</span>{" "}
            removed{" "}
            <span className="font-mono text-tf-text-primary">
              {sortingLossKg.toLocaleString()} kg
            </span>{" "}
            (<span className="font-mono">{sortingLossPercent}%</span>) — caps,
            labels, and non-PET contamination. This is{" "}
            <span
              className={cn(
                "font-semibold",
                isSortingNormal ? "text-tf-accent-green" : "text-tf-accent-amber"
              )}
            >
              {isSortingNormal ? "NORMAL" : "ELEVATED"}
            </span>
            .
          </p>
        </div>

        {/* Processing analysis */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {isProcessingHigh ? (
              <AlertTriangle className="w-4 h-4 text-tf-accent-red" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-tf-accent-green" />
            )}
          </div>
          <div>
            <p>
              <span className="text-tf-text-primary font-medium">Processing</span>{" "}
              lost{" "}
              <span className="font-mono text-tf-text-primary">
                {processingLossKg.toLocaleString()} kg
              </span>{" "}
              (<span className="font-mono">{processingLossPercent}%</span>) — this
              is{" "}
              <span
                className={cn(
                  "font-semibold",
                  isProcessingHigh ? "text-tf-accent-red" : "text-tf-accent-green"
                )}
              >
                {isProcessingHigh ? "HIGH" : "NORMAL"}
              </span>
              .
            </p>
            {isProcessingHigh && (
              <p className="text-tf-text-muted text-sm mt-1">
                The industry average is 15–20%. Possible causes: shredder wear,
                wet input, or material contamination.
              </p>
            )}
          </div>
        </div>

        {/* Current output */}
        <div className="pt-4 border-t border-tf-border">
          <p>
            <span className="text-tf-text-primary font-medium">
              Final output so far:
            </span>{" "}
            <span className="font-mono text-tf-accent-green font-semibold">
              {currentOutputKg.toLocaleString()} kg
            </span>{" "}
            recovered
            {stagesRemaining > 0 && (
              <span className="text-tf-text-muted">
                {" "}
                (still {stagesRemaining} stages to go)
              </span>
            )}
          </p>
        </div>

        {/* Overall efficiency */}
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg",
            parseFloat(efficiencySoFar) < 70
              ? "bg-tf-accent-amber/10"
              : "bg-tf-accent-green/10"
          )}
        >
          <span className="text-tf-text-secondary">
            Overall efficiency so far:
          </span>
          <span
            className={cn(
              "font-mono font-bold text-lg",
              parseFloat(efficiencySoFar) < 70
                ? "text-tf-accent-amber"
                : "text-tf-accent-green"
            )}
          >
            {efficiencySoFar}%
          </span>
          {parseFloat(efficiencySoFar) < 70 && (
            <AlertTriangle className="w-4 h-4 text-tf-accent-amber ml-auto" />
          )}
        </div>
      </div>
    </motion.div>
  )
}
