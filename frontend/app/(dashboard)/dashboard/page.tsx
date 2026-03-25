"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TopBar } from "@/components/layout/topbar"
import { StatCard } from "@/components/ui/stat-card"
import { AnomalyPanel } from "@/components/dashboard/anomaly-panel"
import {
  MaterialFlowSankey,
  WeeklyLineChart,
  MaterialPieChart,
  BatchStageBarChart,
  CompletenessGauge,
} from "@/components/dashboard/charts"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights"
import { LiveEventTicker } from "@/components/dashboard/live-event-ticker"
import { anomalies, kpiData } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar } from "lucide-react"

const dateRanges = ["7d", "30d", "90d"]

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState("7d")

  return (
    <div className="min-h-screen">
      <TopBar
        title="Dashboard"
        subtitle="Real-time analytics and insights"
      />

      <div className="p-6 space-y-6">
        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-tf-text-secondary" />
            <div className="flex bg-tf-bg-secondary rounded-lg p-1">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedRange === range
                      ? "bg-tf-accent-green text-tf-bg-primary"
                      : "text-tf-text-secondary hover:text-tf-text-primary"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-tf-border text-tf-text-secondary hover:text-tf-text-primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* KPI Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Tracked"
            value={kpiData.totalTracked}
            suffix=" kg"
            change={kpiData.totalTrackedChange}
            subtitle="vs last week"
            accentColor="green"
            index={0}
          />
          <StatCard
            title="Avg Completeness"
            value={kpiData.avgCompleteness}
            suffix="%"
            decimals={1}
            change={kpiData.completenessChange}
            changeLabel=" pts"
            accentColor="green"
            index={1}
          />
          <StatCard
            title="Active Batches"
            value={kpiData.activeBatches}
            subtitle={`${kpiData.criticalBatches} critical`}
            accentColor="amber"
            index={2}
          />
          <StatCard
            title="CO2 Saved"
            value={kpiData.co2Saved}
            suffix=" kg"
            subtitle="vs virgin material"
            accentColor="teal"
            index={3}
          />
        </motion.div>

        {/* Anomaly Alerts */}
        <AnomalyPanel anomalies={anomalies} />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MaterialFlowSankey />
          <WeeklyLineChart />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MaterialPieChart />
          <BatchStageBarChart />
          <CompletenessGauge />
        </div>

        {/* Bottom Row: AI Insights + Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIInsightsPanel />
          </div>
          <LiveEventTicker />
        </div>
      </div>
    </div>
  )
}
