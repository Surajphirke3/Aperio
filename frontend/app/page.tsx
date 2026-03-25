"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedNumber } from "@/components/ui/animated-number"
import {
  Recycle,
  Bot,
  BarChart3,
  Leaf,
  Search,
  ClipboardList,
  Radio,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { ProblemSolutionSection } from "@/components/landing/problem-solution"

const heroWords = ["Track", "Every", "Gram.", "Trust", "Every", "Chain."]

const features = [
  {
    icon: Bot,
    title: "Conversational Data Entry",
    description:
      "Log materials in plain English. AI extracts intent, quantities, vendors automatically.",
  },
  {
    icon: BarChart3,
    title: "Visual Lifecycle Tracking",
    description:
      "Sankey diagrams, batch timelines, and loss heatmaps for full traceability.",
  },
  {
    icon: Leaf,
    title: "Carbon Intelligence",
    description:
      "Real-time CO2 savings vs virgin material benchmarks.",
  },
  {
    icon: Search,
    title: "Anomaly Detection",
    description:
      "AI flags unusual loss rates, data gaps, and vendor irregularities instantly.",
  },
  {
    icon: ClipboardList,
    title: "Vendor Scorecards",
    description:
      "Automated performance scoring based on reliability, quantity, and consistency.",
  },
  {
    icon: Radio,
    title: "AI Insights",
    description:
      "Batch-level narrative summaries generated automatically for stakeholders.",
  },
]

const flowStages = [
  { label: "Collection", value: "5,000 kg" },
  { label: "Sorting", value: "4,200 kg" },
  { label: "Processing", value: "3,500 kg" },
  { label: "Recycling", value: "3,200 kg" },
  { label: "Dispatch", value: "3,100 kg" },
]

const liveStats = [
  { label: "Tracked Today", value: 2847, suffix: " kg" },
  { label: "Completeness", value: 94.2, suffix: "%", decimals: 1 },
  { label: "Active Batches", value: 12, suffix: "" },
  { label: "CO2 Saved", value: 3.2, suffix: "t", decimals: 1 },
]

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const flowInView = useInView(flowRef, { once: true, amount: 0.3 })

  return (
    <div className="min-h-screen bg-tf-bg-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-tf-bg-primary/80 backdrop-blur-md border-b border-tf-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-tf-accent-green/20 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-tf-accent-green" />
            </div>
            <span className="text-tf-text-primary font-semibold text-lg">
              Aperio
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-tf-text-secondary hover:text-tf-text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/batches"
              className="text-tf-text-secondary hover:text-tf-text-primary transition-colors"
            >
              Batches
            </Link>
            <Link
              href="/vendors"
              className="text-tf-text-secondary hover:text-tf-text-primary transition-colors"
            >
              Vendors
            </Link>
            <Link
              href="/carbon"
              className="text-tf-text-secondary hover:text-tf-text-primary transition-colors"
            >
              Carbon
            </Link>
          </div>

          <Link href="/dashboard">
            <Button className="bg-tf-accent-green hover:bg-tf-accent-green-dim text-tf-bg-primary font-medium">
              Launch App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1e2e23 1px, transparent 1px),
              linear-gradient(to bottom, #1e2e23 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-tf-bg-primary via-transparent to-tf-bg-primary" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Animated Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            {heroWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={
                  word.includes(".")
                    ? "text-tf-accent-green"
                    : "text-tf-text-primary"
                }
              >
                {word}{" "}
              </motion.span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-xl md:text-2xl text-tf-text-secondary mb-10 max-w-2xl mx-auto text-balance"
          >
            Intelligent traceability for recycled plastic materials — from
            collection to dispatch.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-tf-accent-green hover:bg-tf-accent-green-dim text-tf-bg-primary font-semibold px-8"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="border-tf-border text-tf-text-primary hover:bg-tf-bg-secondary px-8"
              >
                See Live Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Live Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="relative z-10 mt-16 w-full max-w-4xl"
        >
          <div className="bg-tf-bg-secondary/80 backdrop-blur-sm border border-tf-border rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {liveStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-mono font-bold text-tf-accent-green">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      duration={2000}
                    />
                  </div>
                  <p className="text-tf-text-secondary text-sm mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-tf-text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* Problem We're Solving Section */}
      <ProblemSolutionSection />

      {/* Features Grid */}
      <section ref={featuresRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-text-primary tracking-tight mb-4">
              Built for Modern Traceability
            </h2>
            <p className="text-tf-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to track, analyze, and optimize your recycled
              material supply chain.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, borderColor: "var(--accent-green)" }}
                  className="bg-tf-bg-secondary border border-tf-border rounded-xl p-6 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-tf-accent-green/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-tf-accent-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-tf-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-tf-text-secondary">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Material Flow Preview */}
      <section ref={flowRef} className="py-24 px-6 bg-tf-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={flowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-text-primary tracking-tight mb-4">
              Complete Material Flow Visibility
            </h2>
            <p className="text-tf-text-secondary text-lg max-w-2xl mx-auto">
              Track every kilogram from collection point to final dispatch with
              real-time loss analysis.
            </p>
          </motion.div>

          {/* Flow Diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={flowInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-0">
              {flowStages.map((stage, index) => (
                <div key={stage.label} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={flowInView ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 0.5 + index * 0.15,
                      type: "spring",
                    }}
                    className="relative"
                  >
                    <div className="bg-tf-bg-tertiary border border-tf-border rounded-xl p-4 md:p-6 text-center min-w-[120px]">
                      <p className="text-tf-text-primary font-semibold mb-1">
                        {stage.label}
                      </p>
                      <p className="text-tf-accent-green font-mono text-sm">
                        {stage.value}
                      </p>
                    </div>
                  </motion.div>
                  {index < flowStages.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={flowInView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.15 }}
                      className="hidden md:block w-8 lg:w-16 h-0.5 bg-tf-border mx-2"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, var(--accent-green) 0, var(--accent-green) 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Loss Indicators */}
            <div className="hidden md:flex justify-center mt-8 gap-24">
              {["-800 kg", "-700 kg", "-300 kg", "-100 kg"].map((loss, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={flowInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  className="text-tf-accent-red font-mono text-sm"
                >
                  {loss}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-text-primary tracking-tight mb-4">
              Ready to Transform Your Traceability?
            </h2>
            <p className="text-tf-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Join industry leaders who trust Aperio for end-to-end material
              tracking and sustainability reporting.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-tf-accent-green hover:bg-tf-accent-green-dim text-tf-bg-primary font-semibold px-8"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-tf-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Recycle className="w-5 h-5 text-tf-accent-green" />
            <span className="text-tf-text-secondary">
              Aperio - Hackniche 4.0 Demo
            </span>
          </div>
          <p className="text-tf-text-muted text-sm">
            Built for sustainable material traceability
          </p>
        </div>
      </footer>
    </div>
  )
}
