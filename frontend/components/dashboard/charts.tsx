"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  Rectangle,
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
   ANIMATED SANKEY — LIVE BACKEND DATA
═══════════════════════════════════════ */

const STAGE_COLORS: Record<string, string> = {
  Collection: "#22c55e",
  Sorting: "#14b8a6",
  Processing: "#3b82f6",
  Output: "#8b5cf6",
  Dispatch: "#06b6d4",
}

function AnimatedSankeyDiagram({ data }: { data: { nodes: { name: string }[]; links: { source: number; target: number; value: number }[] } }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 350 })
  const [animationProgress, setAnimationProgress] = useState(0)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: 350 })
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Animate on mount
  useEffect(() => {
    let frame: number
    let start: number | null = null
    const duration = 1500

    function step(ts: number) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      setAnimationProgress(progress)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [data])

  if (dimensions.width === 0 || !data.nodes.length) {
    return <div ref={containerRef} className="w-full h-[350px]" />
  }

  const { nodes, links } = data
  const margin = { top: 20, right: 40, bottom: 20, left: 20 }
  const w = dimensions.width - margin.left - margin.right
  const h = dimensions.height - margin.top - margin.bottom

  // Layout nodes evenly across x-axis
  const nodeWidth = 18
  const nodeGap = (w - nodeWidth) / Math.max(nodes.length - 1, 1)

  // Compute node values
  const nodeValues = nodes.map((_, i) => {
    const incoming = links.filter((l) => l.target === i).reduce((s, l) => s + l.value, 0)
    const outgoing = links.filter((l) => l.source === i).reduce((s, l) => s + l.value, 0)
    return Math.max(incoming, outgoing)
  })
  const maxValue = Math.max(...nodeValues, 1)

  const nodePositions = nodes.map((node, i) => {
    const x = margin.left + i * nodeGap
    const barHeight = Math.max((nodeValues[i] / maxValue) * h * 0.7, 20)
    const y = margin.top + (h - barHeight) / 2
    return { x, y, width: nodeWidth, height: barHeight, name: node.name, value: nodeValues[i] }
  })

  // Build link paths
  const linkPaths = links.map((link, index) => {
    const src = nodePositions[link.source]
    const tgt = nodePositions[link.target]
    const linkThickness = Math.max((link.value / maxValue) * h * 0.5, 4)

    const srcX = src.x + src.width
    const tgtX = tgt.x
    const srcY = src.y + src.height / 2
    const tgtY = tgt.y + tgt.height / 2
    const midX = (srcX + tgtX) / 2

    const pathD = `M${srcX},${srcY - linkThickness / 2}
      C${midX},${srcY - linkThickness / 2} ${midX},${tgtY - linkThickness / 2} ${tgtX},${tgtY - linkThickness / 2}
      L${tgtX},${tgtY + linkThickness / 2}
      C${midX},${tgtY + linkThickness / 2} ${midX},${srcY + linkThickness / 2} ${srcX},${srcY + linkThickness / 2} Z`

    const srcColor = STAGE_COLORS[src.name] || "#22c55e"
    const tgtColor = STAGE_COLORS[tgt.name] || "#22c55e"

    return { pathD, srcX, tgtX, srcY, tgtY, linkThickness, srcColor, tgtColor, value: link.value, index, sourceName: src.name, targetName: tgt.name }
  })

  // Animated flow particles
  const particles = linkPaths.map((lp, i) => {
    const t = ((animationProgress * 3 + i * 0.15) % 1)
    const srcX = lp.srcX
    const tgtX = lp.tgtX
    const midX = (srcX + tgtX) / 2

    // Bezier position
    const px = srcX * (1 - t) * (1 - t) + midX * 2 * (1 - t) * t + tgtX * t * t
    const py = lp.srcY * (1 - t) * (1 - t) + ((lp.srcY + lp.tgtY) / 2) * 2 * (1 - t) * t + lp.tgtY * t * t

    return { x: px, y: py, color: lp.srcColor, index: i }
  })

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="overflow-visible">
        <defs>
          {linkPaths.map((lp) => (
            <linearGradient key={`grad-${lp.index}`} id={`link-grad-${lp.index}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={lp.srcColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={lp.tgtColor} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {/* Links */}
        {linkPaths.map((lp) => (
          <g key={`link-${lp.index}`}>
            <path
              d={lp.pathD}
              fill={`url(#link-grad-${lp.index})`}
              stroke="none"
              opacity={hoveredLink === lp.index ? 0.8 : hoveredLink !== null ? 0.15 : 0.5}
              style={{ transition: "opacity 0.2s" }}
              onMouseEnter={() => setHoveredLink(lp.index)}
              onMouseLeave={() => setHoveredLink(null)}
            />
          </g>
        ))}

        {/* Flow particles */}
        {particles.map((p) => (
          <circle
            key={`particle-${p.index}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={p.color}
            opacity={0.8}
          >
            <animate
              attributeName="r"
              values="3;5;3"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Second set of offset particles */}
        {particles.map((p, i) => {
          const t2 = ((animationProgress * 3 + i * 0.15 + 0.5) % 1)
          const lp = linkPaths[i]
          if (!lp) return null
          const srcX = lp.srcX
          const tgtX = lp.tgtX
          const midX = (srcX + tgtX) / 2
          const px = srcX * (1 - t2) * (1 - t2) + midX * 2 * (1 - t2) * t2 + tgtX * t2 * t2
          const py = lp.srcY * (1 - t2) * (1 - t2) + ((lp.srcY + lp.tgtY) / 2) * 2 * (1 - t2) * t2 + lp.tgtY * t2 * t2
          return (
            <circle key={`p2-${i}`} cx={px} cy={py} r={3} fill={p.color} opacity={0.5}>
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
            </circle>
          )
        })}

        {/* Nodes */}
        {nodePositions.map((node, i) => (
          <g
            key={`node-${i}`}
            onMouseEnter={() => setHoveredNode(i)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height * animationProgress}
              rx={4}
              fill={STAGE_COLORS[node.name] || "#22c55e"}
              opacity={hoveredNode === i ? 1 : 0.85}
              style={{ transition: "opacity 0.2s" }}
            />
            {/* Node label */}
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height * animationProgress + 18}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize={11}
              fontWeight={500}
            >
              {node.name}
            </text>
            {/* Value label */}
            {hoveredNode === i && (
              <text
                x={node.x + node.width / 2}
                y={node.y - 8}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize={12}
                fontWeight={700}
                fontFamily="monospace"
              >
                {node.value.toLocaleString()} kg
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip for hovered link */}
      <AnimatePresence>
        {hoveredLink !== null && linkPaths[hoveredLink] && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-xl z-10"
          >
            <p className="text-foreground text-sm font-medium">
              {linkPaths[hoveredLink].sourceName} → {linkPaths[hoveredLink].targetName}
            </p>
            <p className="text-primary font-mono text-sm">
              {linkPaths[hoveredLink].value.toLocaleString()} kg
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Exported Sankey wrapper — fetches live data ── */
export function MaterialFlowSankey() {
  const { data: sankeyData, isLoading, error } = useSankeyData()
  const [animKey, setAnimKey] = useState(0)

  // Re-animate when data changes
  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [sankeyData])

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
          {isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse">Loading live data...</span>
          )}
          {error && (
            <span className="text-xs text-amber-500">Using cached data</span>
          )}
          {!error && !isLoading && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>

      <div className="relative" style={{ height: 350 }}>
        <AnimatedSankeyDiagram key={animKey} data={sankeyData!} />
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
