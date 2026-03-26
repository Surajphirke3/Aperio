"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TopBar } from "@/components/layout/topbar"
import { VendorScorecard } from "@/components/vendors/vendor-scorecard"
import { useVendors } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Trophy,
  Users,
  Truck,
  Loader2,
} from "lucide-react"
import type { Vendor } from "@/lib/mockData"
import { vendors as mockVendors } from "@/lib/mockData"
import { fetchFromAPI } from "@/lib/api"

export default function VendorsPage() {
  const { data: vendors, isLoading } = useVendors()
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [liveVendors, setLiveVendors] = useState<any[]>([])

  useEffect(() => {
    fetchFromAPI("/vendors/")
      .then((data) => {
        if (data.vendors) setLiveVendors(data.vendors)
      })
      .catch((err) => console.error("Error fetching vendors:", err))
  }, [])

  const currentVendors = liveVendors.length > 0 ? liveVendors : mockVendors;
  const activeVendors = vendors || currentVendors;

  const bestPerformer = activeVendors.length > 0
    ? activeVendors.reduce((best: any, v: any) => v.score > best.score ? v : best)
    : null
  const avgReliability = activeVendors.length > 0
    ? activeVendors.reduce((sum: number, v: any) => sum + v.reliability, 0) / activeVendors.length
    : 0

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-500/20"
    if (score >= 80) return "text-amber-500 bg-amber-500/20"
    return "text-red-500 bg-red-500/20"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: "bg-green-500/20 text-green-500",
      medium: "bg-amber-500/20 text-amber-500",
      high: "bg-red-500/20 text-red-500",
    }
    return (
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          colors[risk as keyof typeof colors]
        )}
      >
        {risk.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="min-h-screen">
      <TopBar
        title="Vendor Performance"
        subtitle="Track and analyze vendor reliability and quality"
      />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <span className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading vendors...
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
                {vendors?.length || currentVendors.length} Active Vendors
              </span>
            )}
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Best Performer</p>
                <p className="text-foreground font-semibold">
                  {bestPerformer?.name || "—"}
                </p>
              </div>
            </div>
            <p className="text-green-500 font-mono text-2xl font-bold">
              {bestPerformer?.score || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Vendors</p>
                <p className="text-foreground font-semibold">
                  Active Stakeholders
                </p>
              </div>
            </div>
            <p className="text-foreground font-mono text-2xl font-bold">
              {vendors?.length || currentVendors.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Avg Delivery Reliability</p>
                <p className="text-foreground font-semibold">
                  All Vendors
                </p>
              </div>
            </div>
            <p className="text-teal-500 font-mono text-2xl font-bold">
              {avgReliability.toFixed(1)}%
            </p>
          </motion.div>
        </div>

        {/* Vendor Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Vendor Name
                  </th>
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Materials
                  </th>
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Avg Quality
                  </th>
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Reliability
                  </th>
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Total Supplied
                  </th>
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Risk
                  </th>
                  <th className="text-left px-6 py-4 text-muted-foreground text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentVendors.map((vendor: any, index: number) => (
                  <motion.tr
                    key={vendor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={cn(
                      "border-b border-border hover:bg-secondary transition-colors cursor-pointer",
                      selectedVendor?.id === vendor.id && "bg-secondary"
                    )}
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-foreground font-medium">
                          {vendor.name}
                        </span>
                        {getTrendIcon(vendor.trend)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {vendor.materials.map((m: string) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-xs"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-foreground">
                      {vendor.quality}%
                    </td>
                    <td className="px-6 py-4 font-mono text-foreground">
                      {vendor.reliability}%
                    </td>
                    <td className="px-6 py-4 font-mono text-foreground">
                      {vendor.totalKg.toLocaleString()} kg
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full font-mono font-semibold text-sm",
                          getScoreColor(vendor.score)
                        )}
                      >
                        {vendor.score}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getRiskBadge(vendor.risk)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVendor(vendor)
                        }}
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                      >
                        View
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Vendor Scorecard Panel */}
      <AnimatePresence>
        {selectedVendor && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVendor(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <VendorScorecard
              vendor={selectedVendor}
              onClose={() => setSelectedVendor(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
