"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Target, Tags, Code, Database, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NLPPipelineData {
  intent: string
  confidence: number
  rejectedIntents: { name: string; confidence: number }[]
  entities: {
    text: string
    label: string
    value: string
  }[]
  originalMessage: string
  jsonOutput: Record<string, unknown>
  savedRecords: {
    icon: string
    text: string
  }[]
  batchId?: string
}

interface NLPPipelinePanelProps {
  data: NLPPipelineData
  onComplete?: () => void
}

const STEP_DELAY = 400

const entityColors: Record<string, string> = {
  QUANTITY: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  MATERIAL: "bg-green-500/20 text-green-400 border-green-500/30",
  VENDOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DATE: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  BUYER: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  STAGE: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  BATCH_ID: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  METRIC: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
}

export function NLPPipelinePanel({ data, onComplete }: NLPPipelinePanelProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [jsonText, setJsonText] = useState("")
  const [confidenceBars, setConfidenceBars] = useState<Record<string, number>>({})

  const fullJson = JSON.stringify(data.jsonOutput, null, 2)

  // Step progression
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Step 1 after initial delay
    timers.push(setTimeout(() => setActiveStep(1), STEP_DELAY))
    // Step 2
    timers.push(setTimeout(() => setActiveStep(2), STEP_DELAY * 2))
    // Step 3
    timers.push(setTimeout(() => setActiveStep(3), STEP_DELAY * 3))
    // Step 4
    timers.push(setTimeout(() => {
      setActiveStep(4)
      onComplete?.()
    }, STEP_DELAY * 4 + fullJson.length * 8))

    return () => timers.forEach(clearTimeout)
  }, [fullJson.length, onComplete])

  // Confidence bar animation
  useEffect(() => {
    if (activeStep >= 1) {
      const timer = setTimeout(() => {
        setConfidenceBars({
          [data.intent]: data.confidence,
          ...Object.fromEntries(data.rejectedIntents.map(i => [i.name, i.confidence]))
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeStep, data.intent, data.confidence, data.rejectedIntents])

  // JSON typewriter effect
  useEffect(() => {
    if (activeStep >= 3) {
      let index = 0
      const interval = setInterval(() => {
        if (index <= fullJson.length) {
          setJsonText(fullJson.slice(0, index))
          index++
        } else {
          clearInterval(interval)
        }
      }, 8)
      return () => clearInterval(interval)
    }
  }, [activeStep, fullJson])

  const steps = [
    { label: "Intent", sublabel: "Detect", icon: Target },
    { label: "Entity", sublabel: "Extract", icon: Tags },
    { label: "JSON", sublabel: "Output", icon: Code },
    { label: "Saved", sublabel: "to DB", icon: Database },
  ]

  // Render message with entity highlights
  const renderHighlightedMessage = () => {
    let message = data.originalMessage
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0

    // Sort entities by their position in the message
    const sortedEntities = [...data.entities].sort((a, b) => {
      const aIndex = message.toLowerCase().indexOf(a.text.toLowerCase())
      const bIndex = message.toLowerCase().indexOf(b.text.toLowerCase())
      return aIndex - bIndex
    })

    sortedEntities.forEach((entity, idx) => {
      const entityIndex = message.toLowerCase().indexOf(entity.text.toLowerCase(), lastIndex)
      if (entityIndex !== -1) {
        // Add text before entity
        if (entityIndex > lastIndex) {
          parts.push(message.slice(lastIndex, entityIndex))
        }
        // Add highlighted entity
        parts.push(
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-sm font-medium mx-0.5",
              entityColors[entity.label] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
            )}
          >
            {entity.text}
            <span className="text-[10px] opacity-70 font-mono">{entity.label}</span>
          </motion.span>
        )
        lastIndex = entityIndex + entity.text.length
      }
    })

    // Add remaining text
    if (lastIndex < message.length) {
      parts.push(message.slice(lastIndex))
    }

    return parts
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 ml-11"
    >
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = activeStep > idx
          const isCurrent = activeStep === idx + 1

          return (
            <div key={idx} className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isActive || isCurrent ? 1 : 0.8,
                  opacity: isActive || isCurrent ? 1 : 0.5,
                }}
                className={cn(
                  "flex flex-col items-center px-4 py-2 rounded-lg border transition-all duration-300",
                  isActive
                    ? "bg-tf-accent-green/20 border-tf-accent-green/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    : isCurrent
                    ? "bg-tf-bg-tertiary border-tf-accent-green/30 animate-pulse"
                    : "bg-tf-bg-secondary border-tf-border"
                )}
              >
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Check className="w-4 h-4 text-tf-accent-green" />
                    </motion.div>
                  ) : (
                    <Icon className={cn("w-4 h-4", isCurrent ? "text-tf-accent-green" : "text-tf-text-muted")} />
                  )}
                  <span className={cn("text-xs font-medium", isActive || isCurrent ? "text-tf-text-primary" : "text-tf-text-muted")}>
                    STEP {idx + 1}
                  </span>
                </div>
                <span className={cn("text-[10px] mt-0.5", isActive ? "text-tf-accent-green" : "text-tf-text-muted")}>
                  {step.label}
                </span>
              </motion.div>
              {idx < steps.length - 1 && (
                <ArrowRight className={cn("w-4 h-4 mx-1", activeStep > idx + 1 ? "text-tf-accent-green" : "text-tf-text-muted")} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Intent Detection */}
      <AnimatePresence>
        {activeStep >= 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4 mb-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-tf-accent-green" />
              <span className="text-tf-text-primary font-medium text-sm">INTENT CLASSIFICATION</span>
            </div>
            <div className="space-y-2">
              {/* Detected intent */}
              <div className="flex items-center gap-3">
                <span className="text-tf-text-secondary text-sm w-20">Detected:</span>
                <span className="text-tf-accent-green font-mono text-sm font-semibold">{data.intent}</span>
                <div className="flex-1 h-2 bg-tf-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidenceBars[data.intent] || 0}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-tf-accent-green rounded-full"
                  />
                </div>
                <span className="text-tf-accent-green font-mono text-sm w-12 text-right">{data.confidence}%</span>
              </div>
              {/* Rejected intents */}
              {data.rejectedIntents.map((intent, idx) => (
                <div key={idx} className="flex items-center gap-3 opacity-60">
                  <span className="text-tf-text-muted text-sm w-20">Rejected:</span>
                  <span className="text-tf-text-muted font-mono text-sm">{intent.name}</span>
                  <div className="flex-1 h-2 bg-tf-bg-tertiary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidenceBars[intent.name] || 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                      className="h-full bg-tf-text-muted/50 rounded-full"
                    />
                  </div>
                  <span className="text-tf-text-muted font-mono text-sm w-12 text-right">{intent.confidence}%</span>
                </div>
              ))}
            </div>
            <p className="text-tf-text-muted text-xs mt-3 font-mono">
              Model: Llama-3.3-70B via Groq API
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Entity Extraction */}
      <AnimatePresence>
        {activeStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4 mb-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tags className="w-4 h-4 text-tf-accent-green" />
              <span className="text-tf-text-primary font-medium text-sm">ENTITY EXTRACTION</span>
            </div>
            <div className="text-tf-text-secondary leading-relaxed">
              {renderHighlightedMessage()}
            </div>
            <div className="mt-3 pt-3 border-t border-tf-border">
              <p className="text-tf-text-muted text-xs mb-2">Extracted entities:</p>
              <div className="flex flex-wrap gap-2">
                {data.entities.map((entity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "px-2 py-1 rounded border text-xs",
                      entityColors[entity.label] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    )}
                  >
                    <span className="font-mono opacity-70">{entity.label}:</span>{" "}
                    <span className="font-medium">{entity.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: JSON Output */}
      <AnimatePresence>
        {activeStep >= 3 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4 mb-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-tf-accent-green" />
              <span className="text-tf-text-primary font-medium text-sm">STRUCTURED JSON OUTPUT</span>
            </div>
            <div className="bg-tf-bg-tertiary rounded-lg p-3 overflow-x-auto">
              <pre className="text-xs font-mono">
                {jsonText.split("\n").map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="text-tf-text-muted w-6 text-right mr-3 select-none">{idx + 1}</span>
                    <span className="text-tf-text-secondary">
                      {line.replace(/"(\w+)":/g, '<span class="text-tf-accent-blue">"$1"</span>:')
                        .replace(/: "([^"]+)"/g, ': <span class="text-tf-accent-green">"$1"</span>')
                        .replace(/: (\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>')
                        .replace(/: (true|false|null)/g, ': <span class="text-purple-400">$1</span>')
                        .split(/<span|<\/span>/)
                        .map((part, i) => {
                          if (part.startsWith(' class="text-tf-accent-blue">"')) {
                            return <span key={i} className="text-tf-accent-blue">{part.replace(/ class="text-tf-accent-blue">/, '')}</span>
                          }
                          if (part.startsWith(' class="text-tf-accent-green">"')) {
                            return <span key={i} className="text-tf-accent-green">{part.replace(/ class="text-tf-accent-green">/, '')}</span>
                          }
                          if (part.startsWith(' class="text-amber-400">')) {
                            return <span key={i} className="text-amber-400">{part.replace(/ class="text-amber-400">/, '')}</span>
                          }
                          if (part.startsWith(' class="text-purple-400">')) {
                            return <span key={i} className="text-purple-400">{part.replace(/ class="text-purple-400">/, '')}</span>
                          }
                          return part
                        })}
                    </span>
                  </div>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-tf-accent-green ml-1"
                />
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 4: Database Save */}
      <AnimatePresence>
        {activeStep >= 4 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-tf-bg-secondary border border-tf-accent-green/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-tf-accent-green" />
              <span className="text-tf-text-primary font-medium text-sm">SAVED TO DATABASE</span>
            </div>
            <div className="space-y-2">
              {data.savedRecords.map((record, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check className="w-4 h-4 text-tf-accent-green" />
                  <span className="text-tf-text-secondary">{record.text}</span>
                </motion.div>
              ))}
            </div>
            {data.batchId && (
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-tf-border">
                <Link
                  href={`/batches/${data.batchId}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-tf-accent-green/20 text-tf-accent-green text-sm hover:bg-tf-accent-green/30 transition-colors"
                >
                  View Batch
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-tf-bg-tertiary text-tf-text-secondary text-sm hover:bg-tf-bg-secondary transition-colors">
                  Log Another
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
