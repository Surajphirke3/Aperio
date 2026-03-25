"use client"

import { motion } from "framer-motion"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts"
import { X, TrendingUp, TrendingDown, Minus, Package, Mail, Download, Bot, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Vendor } from "@/lib/mockData"
import { getVendorRadarData, getVendorDeliveries } from "@/lib/mockData"

interface VendorScorecardProps {
  vendor: Vendor
  onClose: () => void
}

export function VendorScorecard({ vendor, onClose }: VendorScorecardProps) {
  const radarData = getVendorRadarData(vendor)
  const deliveries = getVendorDeliveries(vendor.name)

  const scoreData = [{ name: "Score", value: vendor.score, fill: "#22c55e" }]

  const getTrendIcon = () => {
    switch (vendor.trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-tf-accent-green" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-tf-accent-red" />
      default:
        return <Minus className="w-4 h-4 text-tf-text-muted" />
    }
  }

  const getRiskColor = () => {
    switch (vendor.risk) {
      case "low":
        return "text-tf-accent-green bg-tf-accent-green/20"
      case "medium":
        return "text-tf-accent-amber bg-tf-accent-amber/20"
      default:
        return "text-tf-accent-red bg-tf-accent-red/20"
    }
  }

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-screen w-[400px] bg-tf-bg-secondary border-l border-tf-border overflow-y-auto z-50"
    >
      {/* Header */}
      <div className="sticky top-0 bg-tf-bg-secondary border-b border-tf-border p-4 flex items-center justify-between">
        <h2 className="text-tf-text-primary font-semibold">Vendor Scorecard</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-tf-text-muted hover:text-tf-text-primary"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Vendor Info */}
        <div className="text-center">
          <h3 className="text-tf-text-primary font-semibold text-lg">
            {vendor.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            {getTrendIcon()}
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                getRiskColor()
              )}
            >
              {vendor.risk.toUpperCase()} RISK
            </span>
          </div>
        </div>

        {/* Score Circle */}
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={16}
              data={scoreData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background={{ fill: "#1e2e23" }}
                dataKey="value"
                cornerRadius={8}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center mt-4">
              <span className="text-tf-accent-green font-mono font-bold text-4xl">
                {vendor.score}
              </span>
              <p className="text-tf-text-muted text-sm">Overall Score</p>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-tf-bg-tertiary rounded-lg p-4">
          <h4 className="text-tf-text-primary font-medium mb-3">
            Performance Dimensions
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e2e23" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "#86efac", fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#4ade80", fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-tf-bg-tertiary rounded-lg p-3">
            <p className="text-tf-text-muted text-xs">Quality Score</p>
            <p className="text-tf-text-primary font-mono font-semibold">
              {vendor.quality}%
            </p>
          </div>
          <div className="bg-tf-bg-tertiary rounded-lg p-3">
            <p className="text-tf-text-muted text-xs">Reliability</p>
            <p className="text-tf-text-primary font-mono font-semibold">
              {vendor.reliability}%
            </p>
          </div>
          <div className="bg-tf-bg-tertiary rounded-lg p-3">
            <p className="text-tf-text-muted text-xs">Total Supplied</p>
            <p className="text-tf-text-primary font-mono font-semibold">
              {vendor.totalKg.toLocaleString()} kg
            </p>
          </div>
          <div className="bg-tf-bg-tertiary rounded-lg p-3">
            <p className="text-tf-text-muted text-xs">Materials</p>
            <p className="text-tf-text-primary font-mono font-semibold">
              {vendor.materials.join(", ")}
            </p>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-tf-bg-tertiary rounded-lg p-4">
          <h4 className="text-tf-text-primary font-medium mb-3">
            Recent Deliveries
          </h4>
          <div className="space-y-2">
            {deliveries.map((delivery, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm py-2 border-b border-tf-border last:border-0"
              >
                <div>
                  <p className="text-tf-text-primary">{delivery.material}</p>
                  <p className="text-tf-text-muted text-xs">{delivery.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-tf-text-primary font-mono">
                    {delivery.quantity} kg
                  </p>
                  <p className="text-tf-accent-green text-xs font-mono">
                    {delivery.quality}% quality
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assessment - Upgraded */}
        <div className="bg-tf-bg-tertiary border border-tf-accent-green/30 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-tf-accent-green" />
              <h4 className="text-tf-text-primary font-medium">AI Vendor Assessment</h4>
            </div>
          </div>

          {/* Risk Level */}
          <div className="flex items-center gap-3">
            <span className="text-tf-text-muted text-sm">Risk Level:</span>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1",
                vendor.risk === "low"
                  ? "bg-tf-accent-green/20 text-tf-accent-green"
                  : vendor.risk === "medium"
                  ? "bg-tf-accent-amber/20 text-tf-accent-amber"
                  : "bg-tf-accent-red/20 text-tf-accent-red"
              )}
            >
              {vendor.risk.toUpperCase()}
            </span>
          </div>

          {/* Strengths */}
          <div>
            <p className="text-tf-text-muted text-xs mb-2">Strengths:</p>
            <div className="space-y-1.5">
              {vendor.quality >= 90 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-tf-accent-green flex-shrink-0" />
                  <span className="text-tf-text-secondary">
                    Consistently high {vendor.materials[0]} quality ({vendor.quality}%)
                  </span>
                </div>
              )}
              {vendor.reliability >= 85 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-tf-accent-green flex-shrink-0" />
                  <span className="text-tf-text-secondary">
                    Reliable delivery cadence ({(100 - vendor.reliability) * 0.1 + 3.5 > 4 ? "4.2" : "3.8"}-day avg)
                  </span>
                </div>
              )}
              {vendor.risk === "low" && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-tf-accent-green flex-shrink-0" />
                  <span className="text-tf-text-secondary">
                    Zero contamination incidents in 90 days
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Watch Items */}
          {(vendor.risk !== "low" || vendor.trend === "down") && (
            <div>
              <p className="text-tf-text-muted text-xs mb-2">Watch:</p>
              <div className="bg-tf-accent-amber/10 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-tf-accent-amber mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-tf-text-secondary text-sm">
                      {vendor.trend === "down"
                        ? "Quality scores declining 3% over last 30 days"
                        : "No delivery in 8 days (avg: 4.2)"}
                    </p>
                    <p className="text-tf-text-muted text-xs mt-1">
                      {vendor.trend === "down"
                        ? "May need quality review meeting"
                        : "Supply risk if delay continues 2+ days"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="border-t border-tf-border pt-3">
            <p className="text-tf-text-muted text-xs mb-2">Recommendation:</p>
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-tf-accent-blue mt-0.5 flex-shrink-0" />
              <p className="text-tf-text-secondary text-sm">
                {vendor.risk === "low" && vendor.trend !== "down"
                  ? "Strong partner. Consider expanding order volume or securing long-term contract."
                  : vendor.trend === "down"
                  ? "Schedule quality review meeting. Request process improvement plan."
                  : "Send delivery confirmation request today. Consider pre-booking next shipment."}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full border-tf-border text-tf-text-primary hover:bg-tf-bg-tertiary"
          >
            <Package className="w-4 h-4 mr-2" />
            View All Batches
          </Button>
          <Button
            variant="outline"
            className="w-full border-tf-border text-tf-text-primary hover:bg-tf-bg-tertiary"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Vendor
          </Button>
          <Button
            variant="outline"
            className="w-full border-tf-border text-tf-text-primary hover:bg-tf-bg-tertiary"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Scorecard
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
