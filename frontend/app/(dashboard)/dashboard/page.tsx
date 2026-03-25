"use client"

import { useState, useEffect } from "react"
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
import { fetchFromAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar } from "lucide-react"

const dateRanges = ["7d", "30d", "90d"]

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState("7d")
  const [backendStatus, setBackendStatus] = useState("Loading...")
  const [liveKpi, setLiveKpi] = useState<any>(null)
  const [liveAnomalies, setLiveAnomalies] = useState<any[]>([])

  useEffect(() => {
    // Fetch live APIs
    Promise.all([
      fetchFromAPI("/stats/"),
      fetchFromAPI("/anomalies/")
    ])
      .then(([statsData, anomaliesData]) => {
        setLiveKpi(statsData)
        setLiveAnomalies(anomaliesData.anomalies || [])
        setBackendStatus("Connected")
      })
      .catch((err) => {
        setBackendStatus(`Error: ${err.message}`)
        console.error("Backend fetch error:", err)
      })
  }, [])

  // Provide fallback so UI doesn't crash while loading
  const currentKpi = liveKpi ? {
    totalTracked: liveKpi.total_tracked,
    totalTrackedChange: liveKpi.total_tracked_change,
    avgCompleteness: liveKpi.avg_completeness,
    completenessChange: liveKpi.completeness_change,
    activeBatches: liveKpi.active_batches,
    criticalBatches: liveKpi.critical_batches,
    co2Saved: liveKpi.co2_saved_t * 1000 // Convert tons to kg for UI matching
  } : kpiData;

  const currentAnomalies = liveAnomalies.length > 0 ? liveAnomalies : anomalies;

  return (
    <div className="min-h-screen">
      <TopBar
        title="Dashboard"
        subtitle={`Real-time analytics and insights (Backend: ${backendStatus})`}
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
            value={currentKpi.totalTracked}
            suffix=" kg"
            change={currentKpi.totalTrackedChange}
            subtitle="vs last week"
            accentColor="green"
            index={0}
          />
          <StatCard
            title="Avg Completeness"
            value={currentKpi.avgCompleteness}
            suffix="%"
            decimals={1}
            change={currentKpi.completenessChange}
            changeLabel=" pts"
            accentColor="green"
            index={1}
          />
          <StatCard
            title="Active Batches"
            value={currentKpi.activeBatches}
            subtitle={`${currentKpi.criticalBatches} critical`}
            accentColor="amber"
            index={2}
          />
          <StatCard
            title="CO2 Saved"
            value={currentKpi.co2Saved}
            suffix=" kg"
            subtitle="vs virgin material"
            accentColor="teal"
            index={3}
          />
        </motion.div>

        {/* Anomaly Alerts */}
        <AnomalyPanel anomalies={currentAnomalies} />

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
