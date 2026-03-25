"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { TopBar } from "@/components/layout/topbar"
import { BatchTimeline } from "@/components/batches/batch-timeline"
import { TraceabilityScore } from "@/components/batches/traceability-score"
import { ChainOfCustody } from "@/components/batches/chain-of-custody"
import { LossAnalysisNarrative } from "@/components/batches/loss-analysis-narrative"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Download,
  Package,
  Factory,
  Calendar,
  Scale,
  Bot,
} from "lucide-react"
import { batches, batchDetailStages } from "@/lib/mockData"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface BatchDetailPageProps {
  params: Promise<{ id: string }>
}

export default function BatchDetailPage({ params }: BatchDetailPageProps) {
  const { id } = use(params)
  const batch = batches.find((b) => b.id === id) || batches[0]

  const statusConfig = {
    complete: {
      label: "COMPLETE",
      color: "bg-tf-accent-green/20 text-tf-accent-green border-tf-accent-green/30",
    },
    active: {
      label: "ACTIVE",
      color: "bg-tf-accent-blue/20 text-tf-accent-blue border-tf-accent-blue/30",
    },
    anomaly: {
      label: "ANOMALY",
      color: "bg-tf-accent-red/20 text-tf-accent-red border-tf-accent-red/30",
    },
    warning: {
      label: "WARNING",
      color: "bg-tf-accent-amber/20 text-tf-accent-amber border-tf-accent-amber/30",
    },
  }

  const config = statusConfig[batch.status]

  // Chart data from stages
  const chartData = batchDetailStages
    .filter((s) => s.inputKg !== null)
    .map((s) => ({
      stage: s.stage,
      processed: s.outputKg || s.inputKg,
      loss: s.lossKg || 0,
    }))

  // Traceability stages for the score component
  const traceabilityStages = batchDetailStages.map((s) => ({
    name: s.stage.charAt(0) + s.stage.slice(1).toLowerCase(),
    completeness: s.status === "complete" ? 100 : s.status === "anomaly" ? 100 : 0,
    status: s.status as "complete" | "pending" | "anomaly",
  }))

  // Chain of custody nodes
  const custodyNodes = [
    {
      name: batch.vendor,
      role: "Collection source",
      timestamp: "Mar 18, 09:00",
      verification: "Weighbridge verified",
      icon: "building" as const,
    },
    {
      name: "Mumbai Central Depot",
      role: "Aggregation point",
      timestamp: "Mar 18, 10:30",
      verification: "QC scan: PASS",
      icon: "truck" as const,
    },
    {
      name: "Aperio Facility",
      role: "Processing site",
      timestamp: "Mar 18, 14:00",
      verification: "Shredder #3",
      icon: "factory" as const,
    },
  ]

  // Calculate loss data for narrative
  const sortingStage = batchDetailStages.find((s) => s.stage === "SORTING")
  const processingStage = batchDetailStages.find((s) => s.stage === "PROCESSING")
  const completedStages = batchDetailStages.filter((s) => s.status === "complete" || s.status === "anomaly")
  const lastCompletedStage = completedStages[completedStages.length - 1]
  const pendingStages = batchDetailStages.filter((s) => s.status === "pending")

  return (
    <div className="min-h-screen">
      <TopBar title={`Batch ${batch.id}`} subtitle={batch.material} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/batches">
              <Button
                variant="ghost"
                size="sm"
                className="text-tf-text-secondary hover:text-tf-text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Batches
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-tf-text-primary font-mono text-xl font-bold">
                {batch.id}
              </span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  config.color
                )}
              >
                {config.label}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-tf-border text-tf-text-secondary hover:text-tf-text-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Traceability Score Card - New! */}
        <TraceabilityScore score={batch.completeness} stages={traceabilityStages} />

        {/* Info Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-tf-text-muted text-sm mb-1">
              <Package className="w-4 h-4" />
              Material
            </div>
            <p className="text-tf-text-primary font-medium">{batch.material}</p>
          </div>
          <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-tf-text-muted text-sm mb-1">
              <Factory className="w-4 h-4" />
              Vendor
            </div>
            <p className="text-tf-text-primary font-medium">{batch.vendor}</p>
          </div>
          <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-tf-text-muted text-sm mb-1">
              <Calendar className="w-4 h-4" />
              Started
            </div>
            <p className="text-tf-text-primary font-medium">{batch.date}</p>
          </div>
          <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-tf-text-muted text-sm mb-1">
              <Scale className="w-4 h-4" />
              Total Input
            </div>
            <p className="text-tf-text-primary font-mono font-medium">
              {batch.inputKg.toLocaleString()} kg
            </p>
          </div>
        </motion.div>

        {/* Chain of Custody - New! */}
        <ChainOfCustody nodes={custodyNodes} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-tf-bg-secondary border border-tf-border rounded-lg p-6"
          >
            <h2 className="text-tf-text-primary font-semibold text-lg mb-6">
              Batch Timeline
            </h2>
            <BatchTimeline stages={batchDetailStages} />
          </motion.div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Loss Analysis Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
            >
              <h3 className="text-tf-text-primary font-semibold mb-4">
                Loss Analysis
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2e23" />
                  <XAxis type="number" stroke="#86efac" fontSize={10} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    stroke="#86efac"
                    fontSize={10}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1712",
                      border: "1px solid #1e2e23",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f0fdf4" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="processed"
                    name="Processed"
                    stackId="a"
                    fill="#22c55e"
                  />
                  <Bar dataKey="loss" name="Loss" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
            >
              <h3 className="text-tf-text-primary font-semibold mb-4">
                Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-tf-text-secondary">Total Input</span>
                  <span className="text-tf-text-primary font-mono">
                    {batch.inputKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tf-text-secondary">Total Output</span>
                  <span className="text-tf-text-primary font-mono">
                    {batch.outputKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tf-text-secondary">Total Loss</span>
                  <span className="text-tf-accent-red font-mono">
                    {batch.lossKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-tf-border pt-3">
                  <span className="text-tf-text-secondary">Recovery Rate</span>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      batch.outputKg / batch.inputKg > 0.8
                        ? "text-tf-accent-green"
                        : "text-tf-accent-amber"
                    )}
                  >
                    {((batch.outputKg / batch.inputKg) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tf-text-secondary">Completeness</span>
                  <span className="text-tf-text-primary font-mono">
                    {batch.completeness}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Loss Analysis Narrative - New! */}
        <LossAnalysisNarrative
          inputKg={batch.inputKg}
          sortingLossKg={sortingStage?.lossKg || 800}
          sortingLossPercent={sortingStage?.lossPercent || 19}
          processingLossKg={processingStage?.lossKg || 1155}
          processingLossPercent={processingStage?.lossPercent || 34}
          currentOutputKg={lastCompletedStage?.outputKg || 2245}
          stagesRemaining={pendingStages.length}
        />

        {/* AI Insight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-tf-bg-secondary border-2 border-tf-accent-green/30 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-tf-accent-green/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-tf-accent-green" />
            </div>
            <div>
              <h3 className="text-tf-text-primary font-semibold">
                Batch Intelligence Report
              </h3>
              <p className="text-tf-text-muted text-xs">AI-generated analysis</p>
            </div>
          </div>
          <p className="text-tf-text-secondary leading-relaxed">
            Batch {batch.id} shows strong collection and sorting performance.
            However, the processing stage recorded a loss of 34.0% —
            significantly above the 20% anomaly threshold. This may indicate
            mechanical inefficiency in the shredding unit or a higher-than-usual
            contamination load in the input material. Data completeness is
            currently {batch.completeness}% — the granulation and dispatch
            stages still require logging. <strong>Recommend:</strong> (1) Review
            shredder calibration logs, (2) Complete remaining stage entries, (3)
            Cross-check with vendor delivery note.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
