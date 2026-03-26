"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, Bot, FileText, AlertTriangle, BarChart3, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const tabs = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "anomalies", label: "Anomalies", icon: AlertTriangle },
  { id: "data-quality", label: "Data Quality", icon: BarChart3 },
]

const anomalies = [
  {
    severity: "high",
    title: "B-2024-089 Processing Loss",
    explanation: "34% material lost — nearly double the 20% limit. This likely means the shredder needed maintenance or the input had more contamination than usual.",
    action: "Check shredder calibration logs",
    link: "/batches/B-2024-089",
  },
  {
    severity: "medium",
    title: "GreenCycle Industries Supply Gap",
    explanation: "No delivery in 8 days. Average gap is 4.2 days. You may run low on PET stock within 2–3 days.",
    action: "Send reorder request",
    link: "/vendors",
  },
  {
    severity: "medium",
    title: "B-2024-091 Incomplete Data",
    explanation: "3 of 5 stages are missing entries. Traceability score is 67% — below the 80% required for compliance reporting.",
    action: "Log remaining stages",
    link: "/batches/B-2024-091",
  },
]

const dataQualityMetrics = [
  { label: "Batch completeness", score: 96, status: "Good", issues: "0 gaps" },
  { label: "Stage data entry", score: 89, status: "Good", issues: "2 pending" },
  { label: "Vendor records", score: 88, status: "Good", issues: "1 outdated" },
  { label: "Timestamps", score: 93, status: "Good", issues: "0 gaps" },
  { label: "Weight measurements", score: 91, status: "Good", issues: "0 gaps" },
]

export function AIInsightsPanel() {
  const [activeTab, setActiveTab] = useState("summary")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [summaryKey, setSummaryKey] = useState(0)

  const refreshInsight = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSummaryKey((prev) => prev + 1)
    setIsRefreshing(false)
  }

  const overallScore = dataQualityMetrics.reduce((sum, m) => sum + m.score, 0) / dataQualityMetrics.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-tf-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-tf-accent-green/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-tf-accent-green" />
          </div>
          <div>
            <h3 className="text-tf-text-primary font-semibold">AI Analysis</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-pulse" />
              <span className="text-tf-text-muted text-xs">Live insight</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshInsight}
          disabled={isRefreshing}
          className="text-tf-text-secondary hover:text-tf-text-primary"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing 12 batches...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-tf-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-tf-accent-green"
                  : "text-tf-text-secondary hover:text-tf-text-primary"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="insights-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-tf-accent-green"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Summary Tab */}
          {activeTab === "summary" && (
            <motion.div
              key={`summary-${summaryKey}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-tf-text-secondary leading-relaxed text-base">
                This week, your facility processed <span className="text-tf-text-primary font-semibold">18,420 kg</span> of recycled plastic across <span className="text-tf-text-primary font-semibold">12 active batches</span> — up <span className="text-tf-accent-green font-semibold">8.2%</span> from last week. PET recovery rates are strong at <span className="text-tf-accent-green font-semibold">87.3%</span>.
              </p>
              <p className="text-tf-text-secondary leading-relaxed text-base mt-4">
                One batch needs your attention: <Link href="/batches/B-2024-089" className="text-tf-accent-green hover:underline font-medium">B-2024-089</Link> had unusually high material loss during processing. Your three vendors are performing well overall, though <span className="text-tf-accent-amber font-medium">GreenCycle Industries</span> has not made a delivery in 8 days.
              </p>
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-tf-border text-xs text-tf-text-muted">
                <span>Confidence: <span className="text-tf-accent-green">High</span></span>
                <span>Generated: <span className="text-tf-text-secondary">just now</span></span>
                <span>Based on <span className="text-tf-text-secondary">12 batches</span></span>
              </div>
            </motion.div>
          )}

          {/* Anomalies Tab */}
          {activeTab === "anomalies" && (
            <motion.div
              key="anomalies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {anomalies.map((anomaly, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    anomaly.severity === "high"
                      ? "bg-tf-accent-red/10 border-tf-accent-red"
                      : "bg-tf-accent-amber/10 border-tf-accent-amber"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold",
                        anomaly.severity === "high"
                          ? "bg-tf-accent-red/20 text-tf-accent-red"
                          : "bg-tf-accent-amber/20 text-tf-accent-amber"
                      )}
                    >
                      {anomaly.severity.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-tf-text-primary font-medium">
                        {anomaly.title}
                      </h4>
                      <p className="text-tf-text-secondary text-sm mt-1">
                        "{anomaly.explanation}"
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-tf-text-muted text-xs">
                          Suggested action:
                        </span>
                        <Link
                          href={anomaly.link}
                          className="text-tf-accent-green text-sm hover:underline"
                        >
                          {anomaly.action}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Data Quality Tab */}
          {activeTab === "data-quality" && (
            <motion.div
              key="data-quality"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-tf-text-muted">
                      <th className="pb-3 font-medium">Data Dimension</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataQualityMetrics.map((metric, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-tf-border"
                      >
                        <td className="py-3 text-tf-text-secondary">
                          {metric.label}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-tf-bg-tertiary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.score}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={cn(
                                  "h-full rounded-full",
                                  metric.score >= 90
                                    ? "bg-tf-accent-green"
                                    : metric.score >= 80
                                    ? "bg-tf-accent-amber"
                                    : "bg-tf-accent-red"
                                )}
                              />
                            </div>
                            <span className="text-tf-text-primary font-mono text-sm">
                              {metric.score}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-tf-accent-green text-sm flex items-center gap-1">
                            ✓ {metric.status}
                          </span>
                        </td>
                        <td className="py-3 text-tf-text-muted text-sm">
                          {metric.issues}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-tf-border font-semibold">
                      <td className="pt-3 text-tf-text-primary">OVERALL SCORE</td>
                      <td className="pt-3">
                        <span className="text-tf-accent-green font-mono text-lg">
                          {overallScore.toFixed(1)}%
                        </span>
                      </td>
                      <td className="pt-3">
                        <span className="px-2 py-1 rounded bg-tf-accent-green/20 text-tf-accent-green text-sm font-medium">
                          ✓ GOOD
                        </span>
                      </td>
                      <td className="pt-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="text-tf-text-muted text-xs mt-4 pt-4 border-t border-tf-border">
                Data credibility: <span className="text-tf-accent-green">HIGH</span> · Suitable for regulatory reporting · Last audit: today
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
