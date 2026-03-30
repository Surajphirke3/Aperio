"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, ChevronDown, ChevronUp, Cpu, Zap, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIModelInfoProps {
  autoCollapse?: boolean
  collapseDelay?: number
}

export function AIModelInfo({ autoCollapse = true, collapseDelay = 5000 }: AIModelInfoProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    if (autoCollapse) {
      const timer = setTimeout(() => {
        setIsExpanded(false)
      }, collapseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoCollapse, collapseDelay])

  return (
    <div className="mb-4">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-tf-bg-secondary border border-tf-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tf-accent-green/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-tf-accent-green" />
                </div>
                <div>
                  <p className="text-tf-text-primary font-medium">
                    AI Model: qwen3.5:cloud
                  </p>
                  <p className="text-tf-text-muted text-sm">
                    via Local Ollama Cloud (inference)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-tf-text-muted hover:text-tf-text-primary transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-tf-border">
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-tf-text-muted" />
                <span className="text-tf-text-secondary">Parameters:</span>
                <span className="text-tf-text-primary font-mono">3B</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-tf-text-muted" />
                <span className="text-tf-text-secondary">Quantization:</span>
                <span className="text-tf-text-primary font-mono">INT4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-tf-text-muted" />
                <span className="text-tf-text-secondary">Latency:</span>
                <span className="text-tf-text-primary font-mono">~1.2s</span>
              </div>
            </div>
            
            <p className="text-tf-text-muted text-xs mt-3">
              Prompt strategy: few-shot NER + intent classification
            </p>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full",
              "bg-tf-bg-secondary border border-tf-border",
              "text-tf-text-secondary text-sm",
              "hover:bg-tf-bg-tertiary hover:text-tf-text-primary transition-colors"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-pulse" />
            <span className="font-mono text-xs">qwen3.5:cloud</span>
            <ChevronDown className="w-3 h-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
