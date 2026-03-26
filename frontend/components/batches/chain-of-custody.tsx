"use client"

import { motion } from "framer-motion"
import { Building2, Truck, Factory, CheckCircle2 } from "lucide-react"

interface CustodyNode {
  name: string
  role: string
  timestamp: string
  verification: string
  icon: "building" | "truck" | "factory"
}

interface ChainOfCustodyProps {
  nodes: CustodyNode[]
}

const iconMap = {
  building: Building2,
  truck: Truck,
  factory: Factory,
}

export function ChainOfCustody({ nodes }: ChainOfCustodyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-6"
    >
      <h3 className="text-tf-text-primary font-semibold mb-6">Chain of Custody</h3>

      <div className="flex items-start justify-between overflow-x-auto pb-2">
        {nodes.map((node, index) => {
          const Icon = iconMap[node.icon]
          return (
            <div key={index} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 + 0.5 }}
                className="flex flex-col items-center min-w-[180px]"
              >
                {/* Node Card */}
                <div className="bg-tf-bg-tertiary border border-tf-border rounded-lg p-4 text-center w-full">
                  <div className="w-10 h-10 rounded-lg bg-tf-accent-green/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-tf-accent-green" />
                  </div>
                  <p className="text-tf-text-primary font-medium text-sm mb-1">
                    {node.name}
                  </p>
                  <p className="text-tf-text-muted text-xs mb-2">{node.role}</p>
                  <p className="text-tf-text-secondary text-xs font-mono mb-2">
                    {node.timestamp}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-tf-accent-green" />
                    <span className="text-tf-text-muted">{node.verification}</span>
                  </div>
                </div>
              </motion.div>

              {/* Connector Arrow */}
              {index < nodes.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.15 + 0.7 }}
                  className="flex items-center mx-3"
                >
                  <div
                    className="w-12 h-0.5"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, var(--accent-green) 0, var(--accent-green) 4px, transparent 4px, transparent 8px)",
                    }}
                  />
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-tf-accent-green" />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
