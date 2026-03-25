"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, X, Cpu, Workflow, Database } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "architecture", label: "System Architecture", icon: Workflow },
  { id: "pipeline", label: "AI Pipeline", icon: Cpu },
  { id: "data", label: "Data Model", icon: Database },
]

export function HowItWorksModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("architecture")

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-tf-bg-secondary border border-tf-border shadow-xl flex items-center justify-center text-tf-text-secondary hover:text-tf-text-primary hover:border-tf-accent-green/50 transition-colors"
        title="How It Works"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[700px] max-h-[80vh] bg-tf-bg-secondary border border-tf-border rounded-xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-tf-border">
                <h2 className="text-tf-text-primary font-semibold text-lg">
                  How TraceFlow Works
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-tf-text-muted hover:text-tf-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-tf-border">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                        activeTab === tab.id
                          ? "text-tf-accent-green"
                          : "text-tf-text-secondary hover:text-tf-text-primary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="how-it-works-tab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-tf-accent-green"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <AnimatePresence mode="wait">
                  {activeTab === "architecture" && (
                    <motion.div
                      key="architecture"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Flow Diagram */}
                      <div className="flex flex-col items-center gap-3 py-4">
                        {[
                          { text: "User types in chat", color: "bg-tf-accent-blue/20 text-tf-accent-blue" },
                          { text: "Llama 3.2-3B via Featherless AI", color: "bg-tf-accent-green/20 text-tf-accent-green" },
                          { text: "Intent + Entity Extraction", color: "bg-tf-accent-amber/20 text-tf-accent-amber" },
                          { text: "Structured JSON output", color: "bg-tf-accent-teal/20 text-tf-accent-teal" },
                          { text: "Mock DB / State", color: "bg-tf-accent-blue/20 text-tf-accent-blue" },
                          { text: "Dashboard updates in real time", color: "bg-tf-accent-green/20 text-tf-accent-green" },
                        ].map((step, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className={cn("px-4 py-2 rounded-lg text-sm font-medium", step.color)}>
                              {step.text}
                            </div>
                            {index < 5 && (
                              <div className="w-0.5 h-4 bg-tf-border my-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "pipeline" && (
                    <motion.div
                      key="pipeline"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-tf-text-secondary text-sm leading-relaxed">
                        Our AI pipeline uses a small but efficient model for edge deployment:
                      </p>
                      <div className="space-y-3">
                        <div className="bg-tf-bg-tertiary rounded-lg p-3">
                          <p className="text-tf-text-primary font-medium text-sm mb-1">Few-shot Prompting</p>
                          <p className="text-tf-text-muted text-xs">We use 6 example input/output pairs to guide the model for consistent structured extraction.</p>
                        </div>
                        <div className="bg-tf-bg-tertiary rounded-lg p-3">
                          <p className="text-tf-text-primary font-medium text-sm mb-1">JSON Output Parsing</p>
                          <p className="text-tf-text-muted text-xs">The model returns JSON. If JSON is invalid, we retry once with a repair prompt.</p>
                        </div>
                        <div className="bg-tf-bg-tertiary rounded-lg p-3">
                          <p className="text-tf-text-primary font-medium text-sm mb-1">Confidence Scoring</p>
                          <p className="text-tf-text-muted text-xs">Confidence scores are derived from the model's logprobs for intent classification.</p>
                        </div>
                        <div className="bg-tf-bg-tertiary rounded-lg p-3">
                          <p className="text-tf-text-primary font-medium text-sm mb-1">Model Flexibility</p>
                          <p className="text-tf-text-muted text-xs">Works on any ≤3B model — tested on Llama 3.2-3B (INT4 quantized).</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "data" && (
                    <motion.div
                      key="data"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-tf-text-secondary text-sm leading-relaxed">
                        Core data structures that power TraceFlow:
                      </p>
                      <div className="bg-tf-bg-tertiary rounded-lg p-4 font-mono text-xs overflow-x-auto">
                        <pre className="text-tf-text-secondary">
{`Batch: {
  id: string,
  material: string,
  vendor: string,
  stages: Stage[],
  status: "active" | "complete" | "anomaly",
  completeness: number
}

Stage: {
  name: string,
  input_kg: number,
  output_kg: number,
  loss_kg: number,
  timestamp: Date,
  notes: string
}

Vendor: {
  name: string,
  materials: string[],
  qualityScore: number,
  reliabilityScore: number
}

Entry: {
  intent: string,
  entities: Record<string, any>,
  json_output: object,
  timestamp: Date,
  batch_id: string
}`}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
