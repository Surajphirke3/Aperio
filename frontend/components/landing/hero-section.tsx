"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { ArrowRight, Recycle, Sparkles, Play, ChevronDown, BarChart3, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ── animated counter for hero stats ── */
function HeroCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  inView,
}: {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  inView: boolean
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) =>
    target % 1 !== 0 ? v.toFixed(1) : Math.floor(v).toLocaleString()
  )
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, target, {
      duration,
      ease: "easeOut",
    })
    const unsub = rounded.on("change", (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsub()
    }
  }, [inView, target, count, rounded, duration])

  return (
    <span className="font-mono font-bold">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ── floating particles ── */
function Particles() {
  const [mounted, setMounted] = useState(false)
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: ((i * 37 + 13) % 100),
      y: ((i * 53 + 7) % 100),
      size: (i % 3) + 1.5,
      duration: 10 + (i % 6) * 2.5,
      delay: (i % 5) * 1,
    }))
  )

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [-20, -60, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/* ── mini dashboard preview ── */
function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative mx-auto max-w-4xl mt-16"
    >
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            aperio.app/dashboard
          </span>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-4 gap-4">
          {/* Mini KPI cards */}
          {[
            { label: "Tracked", value: "18,420 kg", color: "border-l-green-500" },
            { label: "Recovery", value: "87.2%", color: "border-l-teal-500" },
            { label: "Batches", value: "12 Active", color: "border-l-amber-500" },
            { label: "CO₂ Saved", value: "3,204 kg", color: "border-l-blue-500" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={`bg-secondary/50 rounded-lg p-3 border-l-2 ${kpi.color}`}
            >
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              <p className="text-sm font-bold text-foreground font-mono">{kpi.value}</p>
            </motion.div>
          ))}

          {/* Mini chart area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="col-span-2 bg-secondary/30 rounded-lg p-4 h-32 flex items-end gap-1"
          >
            {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 92].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 1.3 + i * 0.05, type: "spring", stiffness: 100 }}
                className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t"
              />
            ))}
          </motion.div>

          {/* Mini Sankey placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="col-span-2 bg-secondary/30 rounded-lg p-4 h-32 flex items-center justify-center"
          >
            <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
              <motion.path
                d="M10 20 C50 20 50 40 100 40 C150 40 150 20 190 20"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.5, duration: 1.5 }}
              />
              <motion.path
                d="M10 40 C50 40 50 50 100 50 C150 50 150 60 190 60"
                stroke="currentColor"
                strokeWidth="2"
                className="text-teal-500/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.7, duration: 1.5 }}
              />
              <motion.path
                d="M10 60 C50 60 50 30 100 30 C150 30 150 45 190 45"
                stroke="currentColor"
                strokeWidth="2"
                className="text-amber-500/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.9, duration: 1.5 }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════ */
export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const heroStats = [
    { target: 18420, suffix: " kg", label: "Material Tracked" },
    { target: 96, suffix: "%", label: "Sorting Accuracy" },
    { target: 3204, suffix: " kg", label: "CO₂ Offset" },
  ]

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
    >
      {/* Particles */}
      <Particles />

      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-green-500 to-emerald-600 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.06, 0.14, 0.06],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 blur-[150px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,197,94,0.4) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 flex-1 flex flex-col justify-center">
        {/* ── Top content ── */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Recycling Intelligence
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[0.95]"
          >
            <span className="text-foreground">Track Every Gram.</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Trust Every Chain.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Aperio brings AI-powered traceability to recycled materials.
            Speak in plain English, get structured data. One platform for
            collection, sorting, processing, and dispatch — with full carbon intelligence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl group shadow-lg shadow-primary/25">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#workflow">
              <Button
                variant="outline"
                className="border-border hover:border-primary/50 text-foreground font-medium px-8 py-6 text-base rounded-xl backdrop-blur-sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Workflow
              </Button>
            </a>
          </motion.div>

          {/* ── Live Stats Row ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8"
          >
            {heroStats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl text-foreground">
                  <HeroCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    inView={inView}
                    duration={2 + i * 0.3}
                  />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-primary/60" />
              <span>ISO 14001</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs">
              <Zap className="w-4 h-4 text-primary/60" />
              <span>99.9% Uptime</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs">
              <BarChart3 className="w-4 h-4 text-primary/60" />
              <span>Real-time Analytics</span>
            </div>
          </motion.div>
        </div>

        {/* ── Dashboard Preview Card ── */}
        <DashboardPreview />

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 flex justify-center"
        >
          <a href="#workflow" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className="w-6 h-6" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
