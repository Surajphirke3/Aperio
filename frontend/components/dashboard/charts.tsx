"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sankey,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import {
  weeklyData,
  stageData,
  materialBreakdown,
  sankeyData as mockSankeyData,
  completenessBreakdown,
} from "@/lib/mockData"
import { useSankeyData } from "@/lib/hooks"
import { getRealSankeyData } from "@/lib/realDataClient"

/* ── Theme-aware tooltip wrapper ── */
function ChartTooltipWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-foreground">
      {children}
    </div>
  )
}

// Custom tooltip for line/bar charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltipWrapper>
        <p className="text-foreground font-medium mb-1.5 text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-mono flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value} kg
          </p>
        ))}
      </ChartTooltipWrapper>
    )
  }
  return null
}

// Weekly Line Chart
export function WeeklyLineChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-lg p-5"
    >
      <h3 className="text-foreground font-semibold mb-4">
        Weekly Material Throughput
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
          />
          <Line type="monotone" dataKey="PET" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="HDPE" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6", r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="PP" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// Batch Stage Bar Chart
export function BatchStageBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border rounded-lg p-5"
    >
      <h3 className="text-foreground font-semibold mb-4">
        Batch Stage Analysis
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={stageData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>} />
          <Bar dataKey="input" name="Input" fill="#22c55e" radius={[0, 4, 4, 0]} />
          <Bar dataKey="loss" name="Loss" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// ── Material Pie Chart with fixed tooltip ──
export function MaterialPieChart() {
  const total = materialBreakdown.reduce((sum, item) => sum + item.value, 0)
  const totalKg = 18420

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-lg p-5"
    >
      <h3 className="text-foreground font-semibold mb-4">Material Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={materialBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {materialBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                const percentage = data.value
                const kgAmount = Math.round((percentage / 100) * totalKg)
                return (
                  <ChartTooltipWrapper>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }} />
                      <span className="font-semibold text-foreground">{data.name}</span>
                    </div>
                    <p className="text-sm font-mono text-foreground">{percentage}% of total</p>
                    <p className="text-sm font-mono text-muted-foreground">≈ {kgAmount.toLocaleString()} kg</p>
                  </ChartTooltipWrapper>
                )
              }
              return null
            }}
          />
          <Legend formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-4">
        <p className="text-muted-foreground text-sm">Total</p>
        <p className="text-foreground font-mono font-bold text-xl">{totalKg.toLocaleString()} kg</p>
      </div>
    </motion.div>
  )
}

// Completeness Gauge
export function CompletenessGauge() {
  const data = [{ name: "Completeness", value: 91.4, fill: "#22c55e" }]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card border border-border rounded-lg p-5"
    >
      <h3 className="text-foreground font-semibold mb-4">Completeness Score</h3>
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={12} data={data} startAngle={180} endAngle={0}>
          <RadialBar background={{ fill: "hsl(var(--secondary))" }} dataKey="value" cornerRadius={6} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center -mt-16 mb-4">
        <p className="text-primary font-mono font-bold text-3xl">91.4%</p>
      </div>
      <div className="space-y-2 mt-4">
        {completenessBreakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="text-foreground font-mono">{item.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   PROPER SANKEY DIAGRAM
 ═══════════════════════════════════════ */

const STAGE_COLORS: Record<string, string> = {
  Collection: "#22c55e",
  Sorting: "#14b8a6",
  Processing: "#3b82f6",
  Granulation: "#8b5cf6",
  Dispatch: "#06b6d4",
}

function ProperSankeyDiagram({ data }: { data: { nodes: { name: string }[]; links: { source: number; target: number; value: number }[] } }) {
  if (!data || !data.nodes || !data.nodes.length || !data.links || !data.links.length) {
    return <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground font-mono">No flow data available</div>
  }

  const validLinks = data.links.filter((l) => 
    l.value > 0 && l.source < data.nodes.length && l.target < data.nodes.length
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <Sankey
        data={{ nodes: data.nodes, links: validLinks }}
        nodePadding={50}
        margin={{ top: 20, bottom: 20, left: 10, right: 10 }}
        link={{ stroke: '#64748b', strokeOpacity: 0.4 }}
        node={{ stroke: '#334155', strokeWidth: 1 }}
      >
        <Tooltip />
      </Sankey>
    </ResponsiveContainer>
  )
}

/* ── Exported Sankey wrapper — uses real data from problem_statement_3 ── */
export function MaterialFlowSankey() {
  const [realData, setRealData] = useState<{ nodes: { name: string }[]; links: { source: number; target: number; value: number }[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getRealSankeyData()
      .then((data) => {
        setRealData(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-5 relative"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-semibold">
          Material Flow (Sankey)
        </h3>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            Real Data: problem_statement_3
          </span>
        </div>
      </div>

      <div className="relative" style={{ height: 350 }}>
        {isLoading ? (
          <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground font-mono">
            Loading real data...
          </div>
        ) : realData ? (
          <ProperSankeyDiagram data={realData} />
        ) : (
          <ProperSankeyDiagram data={mockSankeyData} />
        )}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        {Object.entries(STAGE_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
