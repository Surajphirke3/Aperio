"use client"

import { motion } from "framer-motion"
import { FileText, Download, Calendar, TrendingUp, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserRole } from "@/lib/auth-context"

interface DigitalReportProps {
  role: UserRole
}

const reportSections: Record<UserRole, { title: string; items: string[] }> = {
  customer: {
    title: "Your Recycling Summary",
    items: [
      "Total materials submitted: 2,450 kg",
      "Active batches: 3",
      "CO₂ offset: 420 kg",
      "Average recovery rate: 88%",
    ],
  },
  regulator: {
    title: "Compliance & Audit Report",
    items: [
      "Total materials tracked: 18,420 kg across 14 batches",
      "Compliance rate: 94.2% (2 batches pending verification)",
      "Average processing loss: 18.3% (threshold: 20%)",
      "3 anomalies flagged — 1 resolved, 2 under investigation",
      "Carbon offset credits generated: 32.04",
      "Full chain-of-custody verified for 12/14 batches",
      "Vendor reliability index: 86.9% average",
      "Next audit deadline: April 15, 2026",
    ],
  },
  stakeholder: {
    title: "Stakeholder Performance Report",
    items: [
      "Materials supplied this month: 8,400 kg",
      "Quality score: 94.2 (top quartile)",
      "On-time delivery rate: 91.8%",
      "Revenue from recycled material: ₹4.2L",
      "Carbon credits earned: 12.6",
    ],
  },
}

export function DigitalReport({ role }: DigitalReportProps) {
  const report = reportSections[role]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold">{report.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>March 2026</span>
              <span>•</span>
              <TrendingUp className="w-3 h-3" />
              <span>Auto-generated</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-muted-foreground hover:text-foreground"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export PDF
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        <ul className="space-y-3">
          {report.items.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
