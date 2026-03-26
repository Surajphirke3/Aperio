"use client"

import { motion } from "framer-motion"
import { TopBar } from "@/components/layout/topbar"
import { StatCard } from "@/components/ui/stat-card"
import { useState, useEffect } from "react"
import { carbonData as mockCarbonData, carbonMonthlyData as mockMonthlyData } from "@/lib/mockData"
import { fetchFromAPI } from "@/lib/api"
import { ImpactNarrative } from "@/components/carbon/impact-narrative"
import { Leaf, Share2, Car, Rocket, Zap, Globe2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-3 shadow-xl">
        <p className="text-tf-text-primary font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-sm font-mono"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value.toLocaleString()} kg CO2
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function CarbonPage() {
  const [liveCarbon, setLiveCarbon] = useState<any>(null)

  useEffect(() => {
    fetchFromAPI("/carbon/")
      .then((data) => setLiveCarbon(data))
      .catch((err) => console.error("Error fetching carbon data:", err))
  }, [])

  // Map backend data to frontend components
  const carbonData = liveCarbon ? Object.entries(liveCarbon.by_material).map(([mat, saved]: [string, any]) => ({
    material: mat,
    recycledCO2: saved,
    virginCO2: saved * 2.5, // Approx calculation to match UI
    savedKg: (saved * 2.5) - saved
  })) : mockCarbonData;

  const carbonMonthlyData = liveCarbon ? liveCarbon.monthly.map((m: any) => ({
    month: m.month,
    recycled: m.co2_saved_kg,
    virgin: m.co2_saved_kg * 2.5
  })) : mockMonthlyData;

  const totalRecycled = carbonData.reduce((sum: number, d: any) => sum + d.recycledCO2, 0)
  const totalVirgin = carbonData.reduce((sum, d) => sum + d.virginCO2, 0)
  const totalSaved = totalVirgin - totalRecycled
  const savingsPercent = ((totalSaved / totalVirgin) * 100).toFixed(0)

  const gaugeData = [
    { name: "Saved", value: parseFloat(savingsPercent), fill: "#22c55e" },
  ]

  // Table data
  const tableData = carbonData.map((item: any) => ({
    ...item,
    inputKg: Math.round(item.recycledCO2 * 2.5),
    emissionFactor: 0.4,
    offsetCredits: (item.savedKg / 100).toFixed(1),
  }))

  const totals = {
    inputKg: tableData.reduce((sum: number, d: any) => sum + d.inputKg, 0),
    recycledCO2: totalRecycled,
    virginCO2: totalVirgin,
    savedKg: totalSaved,
    offsetCredits: (totalSaved / 100).toFixed(1),
  }

  return (
    <div className="min-h-screen">
      <TopBar
        title="Carbon Intelligence"
        subtitle="Tracking CO2 savings vs virgin material production"
      />

      <div className="p-6 space-y-6">
        {/* Impact Narrative - Top of Page */}
        <ImpactNarrative
          totalSavedKg={totalSaved}
          topMaterial="PET bottle recycling"
          topMaterialPercent={41}
        />

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total CO2 Avoided"
            value={totalSaved}
            suffix=" kg"
            accentColor="green"
            index={0}
          />
          <StatCard
            title="Recycled vs Virgin"
            value={parseInt(savingsPercent)}
            suffix="% savings"
            accentColor="teal"
            index={1}
          />
          <StatCard
            title="Carbon per kg"
            value={0.42}
            suffix=" kg CO2/kg"
            decimals={2}
            accentColor="blue"
            index={2}
          />
          <StatCard
            title="Offset Credits"
            value={parseFloat(totals.offsetCredits)}
            suffix=" (estimated)"
            decimals={1}
            accentColor="green"
            index={3}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carbon Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-tf-bg-secondary border border-tf-border rounded-lg p-6"
          >
            <h3 className="text-tf-text-primary font-semibold mb-4 text-center">
              Carbon Savings
            </h3>
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="90%"
                  barSize={20}
                  data={gaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background={{ fill: "#1e2e23" }}
                    dataKey="value"
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center mt-8">
                  <span className="text-tf-accent-green font-mono font-bold text-5xl">
                    {savingsPercent}%
                  </span>
                  <p className="text-tf-text-secondary text-lg mt-1">Saved</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-tf-text-muted">Virgin Equivalent</span>
                <span className="text-tf-text-secondary font-mono">
                  {totalVirgin.toLocaleString()} kg CO2
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tf-text-muted">Actual Emissions</span>
                <span className="text-tf-accent-green font-mono">
                  {totalRecycled.toLocaleString()} kg CO2
                </span>
              </div>
            </div>
          </motion.div>

          {/* Emissions Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-tf-bg-secondary border border-tf-border rounded-lg p-6"
          >
            <h3 className="text-tf-text-primary font-semibold mb-4">
              Emissions Breakdown by Material
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carbonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2e23" />
                <XAxis type="number" stroke="#86efac" fontSize={12} />
                <YAxis
                  dataKey="material"
                  type="category"
                  stroke="#86efac"
                  fontSize={12}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="recycledCO2"
                  name="Recycled CO2"
                  fill="#22c55e"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="virginCO2"
                  name="Virgin CO2 Equiv"
                  fill="#64748b"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Emissions Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-tf-bg-secondary border border-tf-border rounded-lg p-6"
        >
          <h3 className="text-tf-text-primary font-semibold mb-4">
            Emissions Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={carbonMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2e23" />
              <XAxis dataKey="month" stroke="#86efac" fontSize={12} />
              <YAxis stroke="#86efac" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="recycled"
                name="Recycled CO2"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: "#22c55e", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="virgin"
                name="Virgin CO2 Equiv"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#64748b", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Carbon Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-tf-bg-secondary border border-tf-border rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-tf-border">
            <h3 className="text-tf-text-primary font-semibold">
              Carbon Breakdown Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-tf-border bg-tf-bg-tertiary">
                  <th className="text-left px-6 py-3 text-tf-text-secondary text-sm font-medium">
                    Material
                  </th>
                  <th className="text-right px-6 py-3 text-tf-text-secondary text-sm font-medium">
                    Input kg
                  </th>
                  <th className="text-right px-6 py-3 text-tf-text-secondary text-sm font-medium">
                    Emission Factor
                  </th>
                  <th className="text-right px-6 py-3 text-tf-text-secondary text-sm font-medium">
                    Recycled CO2
                  </th>
                  <th className="text-right px-6 py-3 text-tf-text-secondary text-sm font-medium">
                    Virgin CO2 Equiv
                  </th>
                  <th className="text-right px-6 py-3 text-tf-text-secondary text-sm font-medium">
                    Saved
                  </th>
                  <th className="text-right px-6 py-3 text-tf-text-secondary text-sm font-medium">
                    Offset Credits
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-tf-border hover:bg-tf-bg-tertiary"
                  >
                    <td className="px-6 py-4 text-tf-text-primary">
                      {row.material}
                    </td>
                    <td className="px-6 py-4 text-tf-text-primary font-mono text-right">
                      {row.inputKg.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-tf-text-muted font-mono text-right">
                      {row.emissionFactor}
                    </td>
                    <td className="px-6 py-4 text-tf-accent-green font-mono text-right">
                      {row.recycledCO2.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-tf-text-secondary font-mono text-right">
                      {row.virginCO2.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-tf-accent-green font-mono text-right font-semibold">
                      {row.savedKg.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-tf-text-primary font-mono text-right">
                      {row.offsetCredits}
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-tf-bg-tertiary font-semibold">
                  <td className="px-6 py-4 text-tf-text-primary">Total</td>
                  <td className="px-6 py-4 text-tf-text-primary font-mono text-right">
                    {totals.inputKg.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-tf-text-muted font-mono text-right">
                    —
                  </td>
                  <td className="px-6 py-4 text-tf-accent-green font-mono text-right">
                    {totals.recycledCO2.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-tf-text-secondary font-mono text-right">
                    {totals.virginCO2.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-tf-accent-green font-mono text-right">
                    {totals.savedKg.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-tf-text-primary font-mono text-right">
                    {totals.offsetCredits}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 2026 Carbon Roadmap — Upcoming Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-teal-500/5"
        >
          {/* Decorative corner badge */}
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5" />
            2026 ROADMAP
          </div>

          <div className="p-8">
            <h3 className="text-foreground font-bold text-lg mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Upcoming Carbon Features
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              New capabilities rolling out across 2026 to enhance your carbon intelligence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="relative p-5 rounded-xl bg-card border border-border group hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center mb-3">
                  <Globe2 className="w-5 h-5 text-blue-500" />
                </div>
                <h4 className="text-foreground font-semibold text-sm mb-1.5">
                  EU CBAM Auto-Reporting
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  Automated Carbon Border Adjustment Mechanism compliance reports. Generate EU-ready documentation with one click.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 text-[10px] font-bold">
                    Q2 2026
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative p-5 rounded-xl bg-card border border-border group hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-foreground font-semibold text-sm mb-1.5">
                  Blockchain-Verified Carbon Credits
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  Immutable, tamper-proof carbon offset certificates verified on-chain. Tradeable credits tied to real recycling data.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
                    Q3 2026
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium">
                    In Development
                  </span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative p-5 rounded-xl bg-card border border-border group hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center mb-3">
                  <Rocket className="w-5 h-5 text-teal-500" />
                </div>
                <h4 className="text-foreground font-semibold text-sm mb-1.5">
                  Scope 3 Supply Chain Emissions
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  End-to-end upstream and downstream emission tracking across your entire vendor network. Full GHG Protocol alignment.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-500 text-[10px] font-bold">
                    Q4 2026
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium">
                    Planned
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary/20 to-teal-500/20 border border-primary/30 rounded-xl p-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-xl leading-relaxed">
                This month, Aperio-tracked batches avoided the equivalent of{" "}
                <span className="text-primary font-bold text-2xl">
                  {totalSaved.toLocaleString()} kg CO2
                </span>{" "}
                — the same as taking{" "}
                <span className="text-primary font-bold text-2xl">
                  1.4 cars off the road
                </span>{" "}
                for a year.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Car className="w-5 h-5" />
                  <span className="font-mono">≈ 1.4 cars/year</span>
                </div>
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/20"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Impact
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
