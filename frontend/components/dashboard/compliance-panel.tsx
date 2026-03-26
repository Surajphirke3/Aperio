"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle2, AlertTriangle, Clock, FileCheck } from "lucide-react"

const complianceItems = [
  { label: "ISO 14001 Environmental Management", status: "compliant", date: "Valid until Dec 2026" },
  { label: "EU Waste Framework Directive", status: "compliant", date: "Last audit: Feb 2026" },
  { label: "EPR (Extended Producer Responsibility)", status: "warning", date: "Review due Apr 2026" },
  { label: "GRS (Global Recycled Standard)", status: "compliant", date: "Certified Mar 2026" },
  { label: "Carbon Disclosure Project (CDP)", status: "pending", date: "Submission deadline: May 2026" },
]

const statusConfig = {
  compliant: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Compliant" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", label: "Needs Review" },
  pending: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", label: "Pending" },
}

export function CompliancePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
          <Shield className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold">Compliance & Certifications</h3>
          <p className="text-xs text-muted-foreground">Regulatory framework status</p>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-2">
        {complianceItems.map((item, index) => {
          const config = statusConfig[item.status as keyof typeof statusConfig]
          const Icon = config.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                {config.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
