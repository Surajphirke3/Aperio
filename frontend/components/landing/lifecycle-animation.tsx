"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Trash2, Filter, Recycle, PackageCheck, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stages = [
  {
    id: "collection",
    icon: Trash2,
    title: "Collection",
    subtitle: "Gathering raw materials",
    description:
      "Recyclable plastics (PET, HDPE, PP) are collected from consumers, businesses, and municipal programs. Materials are weighed and tagged at collection points with automatic GPS logging.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 border-amber-500/30",
    glowColor: "shadow-amber-500/20",
    stat: "5,000 kg",
    statLabel: "avg daily intake",
  },
  {
    id: "sorting",
    icon: Filter,
    title: "Sorting",
    subtitle: "AI-powered classification",
    description:
      "Optical sensors and AI classify materials by polymer type, color, and contamination level. Automated conveyors separate streams with 96% accuracy, flagging anomalies in real time.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/30",
    glowColor: "shadow-blue-500/20",
    stat: "96%",
    statLabel: "sorting accuracy",
  },
  {
    id: "processing",
    icon: Recycle,
    title: "Recycling",
    subtitle: "Transform & regenerate",
    description:
      "Sorted plastics undergo shredding, washing, and granulation. Process parameters (temperature, throughput, loss rates) are tracked at every stage. AI flags efficiency drops and anomalies.",
    color: "text-green-500",
    bgColor: "bg-green-500/10 border-green-500/30",
    glowColor: "shadow-green-500/20",
    stat: "87%",
    statLabel: "recovery rate",
  },
  {
    id: "product",
    icon: PackageCheck,
    title: "End Product",
    subtitle: "Ready for reuse",
    description:
      "Recycled granules are dispatched to manufacturers for new products. Every gram is traced from source to output with blockchain-verified chain of custody and carbon offset certification.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10 border-teal-500/30",
    glowColor: "shadow-teal-500/20",
    stat: "3,200 kg",
    statLabel: "avg daily output",
  },
]

export function LifecycleAnimation() {
  const [activeStage, setActiveStage] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const ActiveIcon = stages[activeStage].icon

  return (
    <section id="lifecycle" ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 50%),
                              radial-gradient(circle at 70% 50%, rgba(20,184,166,0.08) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 inline-block">
            The Recycling Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mt-4 mb-4">
            From Waste to Wonder
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow every gram through the complete recycling lifecycle. Click each stage to explore the process.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Stage Selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            {stages.map((stage, index) => {
              const Icon = stage.icon
              const isActive = activeStage === index
              return (
                <motion.button
                  key={stage.id}
                  onClick={() => setActiveStage(index)}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300",
                    isActive
                      ? `${stage.bgColor} shadow-lg ${stage.glowColor}`
                      : "border-border hover:border-primary/30 bg-card"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0",
                      isActive ? stage.bgColor : "bg-secondary"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", isActive ? stage.color : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-semibold", isActive ? "text-foreground" : "text-foreground")}>
                        {stage.title}
                      </span>
                      {index < stages.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{stage.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <span className={cn("font-mono font-bold text-lg", stage.color)}>
                      {stage.stat}
                    </span>
                    <p className="text-xs text-muted-foreground">{stage.statLabel}</p>
                  </div>
                </motion.button>
              )
            })}

            {/* Progress bar */}
            <div className="flex gap-1 mt-4">
              {stages.map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "h-1 rounded-full flex-1 transition-colors duration-500",
                    i <= activeStage ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Active Stage Detail */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-8 relative overflow-hidden"
            >
              {/* Large icon background */}
              <div className="absolute -right-8 -bottom-8 opacity-5">
                <ActiveIcon className="w-48 h-48" />
              </div>

              <div className="relative z-10">
                <motion.div
                  key={`icon-${activeStage}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", stages[activeStage].bgColor)}
                >
                  <ActiveIcon className={cn("w-8 h-8", stages[activeStage].color)} />
                </motion.div>

                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {stages[activeStage].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {stages[activeStage].description}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-6">
                  <div>
                    <span className={cn("font-mono font-bold text-3xl", stages[activeStage].color)}>
                      {stages[activeStage].stat}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stages[activeStage].statLabel}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <span className="font-mono font-bold text-3xl text-foreground">
                      {activeStage + 1}/{stages.length}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">stage complete</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
