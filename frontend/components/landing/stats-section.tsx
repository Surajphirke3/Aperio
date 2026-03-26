"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: 18420, suffix: " kg", label: "Material Tracked", prefix: "" },
  { value: 3204, suffix: " kg", label: "CO₂ Saved", prefix: "" },
  { value: 91.4, suffix: "%", label: "Data Completeness", prefix: "" },
  { value: 97, suffix: "%", label: "Uptime", prefix: "" },
]

function AnimatedCounter({ value, suffix, prefix, inView }: { value: number; suffix: string; prefix: string; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = value
    const duration = 2000
    const isDecimal = value % 1 !== 0
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = start + (end - start) * eased

      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current))

      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [value, inView])

  return (
    <span className="font-mono font-bold text-4xl md:text-5xl text-foreground">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section id="stats" ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium inline-block mb-4">
            Real Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Numbers That Matter
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                inView={inView}
              />
              <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
