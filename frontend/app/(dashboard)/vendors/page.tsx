"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TopBar } from "@/components/layout/topbar"
import { StatCard } from "@/components/ui/stat-card"
import { VendorScorecard } from "@/components/vendors/vendor-scorecard"
import { vendors as mockVendors } from "@/lib/mockData"
import { fetchFromAPI } from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Trophy,
  Users,
  Truck,
} from "lucide-react"
import type { Vendor } from "@/lib/mockData"

export default function VendorsPage() {
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

  const bestPerformer = currentVendors.reduce((best: any, v: any) =>
    v.score > best.score ? v : best
  , currentVendors[0] || { score: 0 })
  const avgReliability = currentVendors.length > 0 ?
    currentVendors.reduce((sum: number, v: any) => sum + v.reliability, 0) / currentVendors.length : 0

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-tf-accent-green bg-tf-accent-green/20"
    if (score >= 80) return "text-tf-accent-amber bg-tf-accent-amber/20"
    return "text-tf-accent-red bg-tf-accent-red/20"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-tf-accent-green" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-tf-accent-red" />
      default:
        return <Minus className="w-4 h-4 text-tf-text-muted" />
    }
  }

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: "bg-tf-accent-green/20 text-tf-accent-green",
      medium: "bg-tf-accent-amber/20 text-tf-accent-amber",
      high: "bg-tf-accent-red/20 text-tf-accent-red",
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
          <div>
            <span className="px-3 py-1 rounded-full bg-tf-accent-green/20 text-tf-accent-green text-sm font-medium">
              {currentVendors.length} Active Vendors
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-tf-accent-green/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-tf-accent-green" />
              </div>
              <div>
                <p className="text-tf-text-muted text-sm">Best Performer</p>
                <p className="text-tf-text-primary font-semibold">
                  {bestPerformer.name}
                </p>
              </div>
            </div>
            <p className="text-tf-accent-green font-mono text-2xl font-bold">
              {bestPerformer.score}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-tf-accent-blue/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-tf-accent-blue" />
              </div>
              <div>
                <p className="text-tf-text-muted text-sm">Total Vendors</p>
                <p className="text-tf-text-primary font-semibold">
                  Active Partners
                </p>
              </div>
            </div>
            <p className="text-tf-text-primary font-mono text-2xl font-bold">
              {currentVendors.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-tf-accent-teal/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-tf-accent-teal" />
              </div>
              <div>
                <p className="text-tf-text-muted text-sm">Avg Delivery Reliability</p>
                <p className="text-tf-text-primary font-semibold">
                  All Vendors
                </p>
              </div>
            </div>
            <p className="text-tf-accent-teal font-mono text-2xl font-bold">
              {avgReliability.toFixed(1)}%
            </p>
          </motion.div>
        </div>

        {/* Vendor Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-tf-bg-secondary border border-tf-border rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-tf-border bg-tf-bg-tertiary">
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
                    Vendor Name
                  </th>
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
                    Materials
                  </th>
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
                    Avg Quality
                  </th>
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
                    Reliability
                  </th>
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
                    Total Supplied
                  </th>
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
                    Risk
                  </th>
                  <th className="text-left px-6 py-4 text-tf-text-secondary text-sm font-medium">
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
                      "border-b border-tf-border hover:bg-tf-bg-tertiary transition-colors cursor-pointer",
                      selectedVendor?.id === vendor.id && "bg-tf-bg-tertiary"
                    )}
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-tf-text-primary font-medium">
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
                            className="px-2 py-0.5 rounded bg-tf-bg-tertiary text-tf-text-secondary text-xs"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-tf-text-primary">
                      {vendor.quality}%
                    </td>
                    <td className="px-6 py-4 font-mono text-tf-text-primary">
                      {vendor.reliability}%
                    </td>
                    <td className="px-6 py-4 font-mono text-tf-text-primary">
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
                        className="text-tf-accent-green hover:text-tf-accent-green-dim flex items-center gap-1 text-sm"
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
