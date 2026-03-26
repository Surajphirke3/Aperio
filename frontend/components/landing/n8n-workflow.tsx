"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Truck,
  ScanLine,
  Cog,
  Droplets,
  PackageCheck,
  BarChart3,
  FileCheck,
  Recycle,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ── Node definitions ── */
const workflowNodes = [
  {
    id: "intake",
    label: "Material Intake",
    subtitle: "Collection Hub",
    icon: Truck,
    color: "#f59e0b",
    description: "Raw recyclable plastics (PET, HDPE, PP) arrive from collection stakeholders, municipal programs, and drop-off centers. Each batch is weighed, photographed, and geo-tagged automatically.",
    stats: { throughput: "5,000 kg/day", sources: "12 Stakeholders" },
    column: 0,
    row: 0,
  },
  {
    id: "scan",
    label: "AI Classification",
    subtitle: "Optical Scan",
    icon: ScanLine,
    color: "#3b82f6",
    description: "NIR spectroscopy and computer vision classify materials by polymer type, color, and contamination level. AI assigns quality scores and flags non-recyclables in real time.",
    stats: { accuracy: "96.4%", speed: "200 items/min" },
    column: 1,
    row: 0,
  },
  {
    id: "sort",
    label: "Automated Sorting",
    subtitle: "Stream Separation",
    icon: Recycle,
    color: "#8b5cf6",
    description: "Robotic sorters separate materials into 6 distinct streams. Contaminated items are diverted to secondary processing. Each stream is tracked with unique batch IDs.",
    stats: { streams: "6 Material", purity: "98.1%" },
    column: 2,
    row: 0,
  },
  {
    id: "wash",
    label: "Wash & Shred",
    subtitle: "Pre-Processing",
    icon: Droplets,
    color: "#06b6d4",
    description: "Materials are washed in hot alkaline solution, then shredded into uniform flakes. Water is recycled through closed-loop filtration. Weight loss is tracked at each stage.",
    stats: { waterSaved: "85% Recycled", lossRate: "4.2%" },
    column: 3,
    row: 0,
  },
  {
    id: "process",
    label: "Granulation",
    subtitle: "Extrusion Line",
    icon: Cog,
    color: "#22c55e",
    description: "Clean flakes are melted and extruded into uniform pellets/granules. Temperature, throughput, and melt-flow index are monitored continuously by IoT sensors.",
    stats: { temp: "260°C", output: "3,200 kg/day" },
    column: 0,
    row: 1,
  },
  {
    id: "qc",
    label: "Quality Control",
    subtitle: "Lab Testing",
    icon: FileCheck,
    color: "#ec4899",
    description: "Random samples undergo tensile testing, MFI analysis, and colorimetry. AI compares results against buyer specifications and flags deviations automatically.",
    stats: { tests: "14 Parameters", passRate: "94.8%" },
    column: 1,
    row: 1,
  },
  {
    id: "dispatch",
    label: "Dispatch",
    subtitle: "Distribution",
    icon: PackageCheck,
    color: "#14b8a6",
    description: "Certified granules are packaged, labeled with QR-coded traceability data, and shipped to manufacturing stakeholders. Carbon offset certificates are auto-generated per batch.",
    stats: { shipments: "48/month", certRate: "100%" },
    column: 2,
    row: 1,
  },
  {
    id: "analytics",
    label: "Carbon Analytics",
    subtitle: "Impact Report",
    icon: BarChart3,
    color: "#10b981",
    description: "Real-time dashboards aggregate carbon savings vs virgin material production. Monthly sustainability reports are auto-generated for regulators and stakeholders.",
    stats: { co2Saved: "3,204 kg", credits: "32.04" },
    column: 3,
    row: 1,
  },
]

/* ── Edge definitions (source → target) ── */
const workflowEdges = [
  { from: "intake", to: "scan" },
  { from: "scan", to: "sort" },
  { from: "sort", to: "wash" },
  { from: "wash", to: "process" },
  { from: "process", to: "qc" },
  { from: "qc", to: "dispatch" },
  { from: "dispatch", to: "analytics" },
]

/* ── SVG animated edge between two nodes ── */
function WorkflowEdge({
  fromEl,
  toEl,
  containerEl,
  index,
  isActive,
}: {
  fromEl: HTMLElement | null
  toEl: HTMLElement | null
  containerEl: HTMLElement | null
  index: number
  isActive: boolean
}) {
  if (!fromEl || !toEl || !containerEl) return null

  const containerRect = containerEl.getBoundingClientRect()
  const fromRect = fromEl.getBoundingClientRect()
  const toRect = toEl.getBoundingClientRect()

  const x1 = fromRect.right - containerRect.left
  const y1 = fromRect.top + fromRect.height / 2 - containerRect.top
  const x2 = toRect.left - containerRect.left
  const y2 = toRect.top + toRect.height / 2 - containerRect.top

  // Determine if we need a vertical connector (row change)
  const isVertical = Math.abs(y2 - y1) > 50

  let pathD: string
  if (isVertical) {
    const midX = (x1 + x2) / 2
    pathD = `M ${x1} ${y1} C ${x1 + 60} ${y1}, ${midX} ${y1}, ${midX} ${(y1 + y2) / 2} S ${midX} ${y2}, ${x2 - 30} ${y2} L ${x2} ${y2}`
  } else {
    const cpOffset = (x2 - x1) * 0.4
    pathD = `M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`
  }

  return (
    <g>
      {/* Shadow path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-border"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
      />
      {/* Active glow path */}
      {isActive && (
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#edgeGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Flowing dot */}
      <motion.circle
        r={4}
        fill="#22c55e"
        filter="url(#glow)"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          delay: index * 0.3 + 1,
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          offsetPath: `path('${pathD}')`,
        }}
      />
    </g>
  )
}

/* ═══════════════════════════════════════════════════
   N8N WORKFLOW COMPONENT
═══════════════════════════════════════════════════ */
export function N8nWorkflow() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [nodeRefs, setNodeRefs] = useState<Record<string, HTMLElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [renderEdges, setRenderEdges] = useState(false)

  // Re-render edges after layout settles
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setRenderEdges(true), 300)
      return () => clearTimeout(timer)
    }
  }, [inView])

  // Force re-render on resize
  useEffect(() => {
    const handler = () => {
      setRenderEdges(false)
      setTimeout(() => setRenderEdges(true), 100)
    }
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  const setNodeRef = (id: string, el: HTMLElement | null) => {
    setNodeRefs((prev) => ({ ...prev, [id]: el }))
  }

  const activeNodeData = workflowNodes.find((n) => n.id === activeNode)

  return (
    <section id="workflow" ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(34,197,94,0.06) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Dot grid pattern behind workflow */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 inline-block">
            Intelligent Pipeline
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mt-4 mb-4">
            Recycling Workflow
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every step automated, every gram traced. Click any node to explore the process.
          </p>
        </motion.div>

        {/* ── Workflow Canvas ── */}
        <div ref={containerRef} className="relative">
          {/* SVG Overlay for edges */}
          <div ref={svgContainerRef} className="absolute inset-0 pointer-events-none z-0">
            {renderEdges && containerRef.current && (
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              >
                <defs>
                  <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {workflowEdges.map((edge, i) => (
                  <WorkflowEdge
                    key={`${edge.from}-${edge.to}`}
                    fromEl={nodeRefs[edge.from]}
                    toEl={nodeRefs[edge.to]}
                    containerEl={containerRef.current}
                    index={i}
                    isActive={activeNode === edge.from || activeNode === edge.to}
                  />
                ))}
              </svg>
            )}
          </div>

          {/* ── Node Grid ── */}
          {/* Row 1: intake → scan → sort → wash */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 relative z-10">
            {workflowNodes.filter((n) => n.row === 0).map((node, index) => {
              const Icon = node.icon
              const isActive = activeNode === node.id
              return (
                <motion.div
                  key={node.id}
                  ref={(el) => setNodeRef(node.id, el)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  onClick={() => setActiveNode(isActive ? null : node.id)}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={cn(
                    "relative cursor-pointer rounded-xl border bg-card transition-all duration-300 overflow-hidden group",
                    isActive
                      ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/30"
                      : "border-border hover:border-primary/40 hover:shadow-md"
                  )}
                >
                  {/* Node header bar */}
                  <div
                    className="px-4 py-2.5 flex items-center gap-2.5 border-b"
                    style={{
                      borderColor: `${node.color}30`,
                      background: `linear-gradient(135deg, ${node.color}10, transparent)`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${node.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: node.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{node.label}</p>
                      <p className="text-[10px] text-muted-foreground">{node.subtitle}</p>
                    </div>
                  </div>

                  {/* Node body */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      {Object.entries(node.stats).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs font-mono font-bold text-foreground">{val}</p>
                          <p className="text-[9px] text-muted-foreground capitalize">{key}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active indicator pulse */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNodeGlow"
                      className="absolute inset-0 border-2 rounded-xl pointer-events-none"
                      style={{ borderColor: node.color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Row 2: process → qc → dispatch → analytics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {workflowNodes.filter((n) => n.row === 1).map((node, index) => {
              const Icon = node.icon
              const isActive = activeNode === node.id
              return (
                <motion.div
                  key={node.id}
                  ref={(el) => setNodeRef(node.id, el)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  onClick={() => setActiveNode(isActive ? null : node.id)}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={cn(
                    "relative cursor-pointer rounded-xl border bg-card transition-all duration-300 overflow-hidden group",
                    isActive
                      ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/30"
                      : "border-border hover:border-primary/40 hover:shadow-md"
                  )}
                >
                  {/* Node header bar */}
                  <div
                    className="px-4 py-2.5 flex items-center gap-2.5 border-b"
                    style={{
                      borderColor: `${node.color}30`,
                      background: `linear-gradient(135deg, ${node.color}10, transparent)`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${node.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: node.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{node.label}</p>
                      <p className="text-[10px] text-muted-foreground">{node.subtitle}</p>
                    </div>
                  </div>

                  {/* Node body */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      {Object.entries(node.stats).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs font-mono font-bold text-foreground">{val}</p>
                          <p className="text-[9px] text-muted-foreground capitalize">{key}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeNodeGlow2"
                      className="absolute inset-0 border-2 rounded-xl pointer-events-none"
                      style={{ borderColor: node.color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── Detail Panel ── */}
        <AnimatePresence>
          {activeNodeData && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 overflow-hidden"
            >
              <div
                className="glass-card rounded-2xl p-8 border"
                style={{ borderColor: `${activeNodeData.color}30` }}
              >
                <div className="flex items-start gap-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${activeNodeData.color}15` }}
                  >
                    <activeNodeData.icon
                      className="w-7 h-7"
                      style={{ color: activeNodeData.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {activeNodeData.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{activeNodeData.subtitle}</p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {activeNodeData.description}
                    </p>
                    <div className="flex gap-6">
                      {Object.entries(activeNodeData.stats).map(([key, val]) => (
                        <div key={key}>
                          <span
                            className="font-mono font-bold text-lg"
                            style={{ color: activeNodeData.color }}
                          >
                            {val}
                          </span>
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">{key}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
