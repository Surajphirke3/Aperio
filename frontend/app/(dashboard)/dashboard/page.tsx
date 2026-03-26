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
import { LifecycleWorkflow } from "@/components/dashboard/lifecycle-workflow"
import { DigitalReport } from "@/components/dashboard/digital-report"
import { CompliancePanel } from "@/components/dashboard/compliance-panel"
import { RoleSelectionModal } from "@/components/dashboard/role-selection-modal"
import { anomalies, kpiData as mockKpi } from "@/lib/mockData"
import { useDashboardStats } from "@/lib/hooks"
import { useAuth } from "@/lib/auth-context"
import { fetchFromAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar, MessageCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const dateRanges = ["7d", "30d", "90d"]

const roleSubtitles = {
  customer: "Your recycling overview at a glance",
  regulator: "Full analytics, compliance, and audit data",
  stakeholder: "Key performance metrics and insights",
}

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState("7d")
  const [backendStatus, setBackendStatus] = useState("Loading...")
  const [liveKpi, setLiveKpi] = useState<any>(null)
  const [liveAnomalies, setLiveAnomalies] = useState<any[]>([])
  
  // Live data from backend with fallback
  const { data: kpiData, isLoading, refetch } = useDashboardStats()

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
  // HARDCODED TO MOCK DATA FOR DEMO PRESENTATION
  const currentKpi = mockKpi;
  const currentAnomalies = anomalies;
  const { user } = useAuth()
  const router = useRouter()
  const role = user?.role || "customer"

  return (
    <div className="min-h-screen">
      <RoleSelectionModal />
      <TopBar
        title="Dashboard"
        subtitle={`Real-time analytics and insights (Backend: ${backendStatus})`}
      />

      <div className="p-6 space-y-6">
        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex bg-card rounded-lg p-1 border border-border">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedRange === range
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/chat")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-foreground"
              onClick={refetch}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Lifecycle Workflow (all roles) */}
        <LifecycleWorkflow />

        {/* KPI Row — scaled by role, now using live data */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`grid grid-cols-1 md:grid-cols-2 ${
            role === "customer" ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-4`}
        >
          <StatCard
            title="Total Tracked"
            value={currentKpi?.totalTracked || 0}
            suffix=" kg"
            change={currentKpi?.totalTrackedChange || 0}
            subtitle="vs last week"
            accentColor="green"
            index={0}
          />
          {role !== "customer" && (
            <StatCard
              title="Avg Completeness"
              value={kpiData?.avgCompleteness || 0}
              suffix="%"
              decimals={1}
              change={kpiData?.completenessChange || 0}
              changeLabel=" pts"
              accentColor="green"
              index={1}
            />
          )}
          <StatCard
            title="Active Batches"
            value={currentKpi?.activeBatches || 0}
            subtitle={`${currentKpi?.criticalBatches || 0} critical`}
            accentColor="amber"
            index={2}
          />
          <StatCard
            title="CO2 Saved"
            value={currentKpi?.co2Saved || 0}
            suffix=" kg"
            subtitle="vs virgin material"
            accentColor="teal"
            index={3}
          />
        </motion.div>

        {/* Anomaly Alerts — regulator gets full, stakeholder filtered, customer hidden */}
        {role === "regulator" && <AnomalyPanel anomalies={anomalies} />}
        {role === "stakeholder" && (
          <AnomalyPanel anomalies={anomalies.filter((a) => a.severity === "critical")} />
        )}

        {/* Charts Row 1 — all roles get Sankey + Weekly side by side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MaterialFlowSankey />
          <WeeklyLineChart />
        </div>

        {/* Charts Row 2 — Material Pie for all; Stage Bar + Completeness only for regulator & stakeholder */}
        <div className={`grid grid-cols-1 ${
          role === "customer" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
        } gap-6`}>
          <MaterialPieChart />
          {role !== "customer" && <BatchStageBarChart />}
          {role === "regulator" && <CompletenessGauge />}
        </div>

        {/* Compliance Panel — regulator only */}
        {role === "regulator" && <CompliancePanel />}

        {/* Digital Report — all roles (content scales per role) */}
        <DigitalReport role={role} />

        {/* Bottom Row: AI Insights + Live Feed */}
        <div className={`grid grid-cols-1 ${role === "regulator" ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}>
          <div className={role === "regulator" ? "lg:col-span-2" : "lg:col-span-1"}>
            <AIInsightsPanel />
          </div>
          {role === "regulator" && <LiveEventTicker />}
        </div>
      </div>
    </div>
  )
}
