"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  MessageSquare,
  BarChart3,
  Brain,
  Shield,
  Zap,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Entry",
    description:
      "Just type what happened — 'Received 500 kg PET from GreenCycle today' — and AI extracts intent, entities, and saves structured data instantly.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Unified Lifecycle View",
    description:
      "Sankey diagrams, timelines, and interactive charts show every batch's journey from collection through sorting, processing, and dispatch.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get plain-English summaries of complex data — 'You lost 34% at processing — here's why' — so everyone understands, no data science required.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Role-Based Dashboards",
    description:
      "Separate views for customers, regulators, and stakeholders. Each role sees exactly the data they need with appropriate granularity.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Zap,
    title: "Real-Time Anomaly Detection",
    description:
      "AI monitors processing loss thresholds, vendor delivery patterns, and batch completeness — flagging issues before they become problems.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Leaf,
    title: "Carbon Intelligence",
    description:
      "Track CO₂ savings automatically. Compare recycled vs virgin material emissions with impact narratives your stakeholders will love.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section id="features" ref={sectionRef} className="py-24 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium inline-block mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete toolkit for modern recycling traceability — from data entry to compliance reporting.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 group cursor-default"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                    feature.bgColor
                  )}
                >
                  <Icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
