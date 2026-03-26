"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ClipboardList, Search, Check, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StructuredOutputCardProps {
  data: {
    type: "entry" | "query"
    data?: Record<string, string>
  }
}

export function StructuredOutputCard({ data }: StructuredOutputCardProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  if (cancelled) return null

  const isEntry = data.type === "entry"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      className="ml-11 mt-3"
    >
      <div className="bg-tf-bg-secondary border border-tf-border rounded-lg overflow-hidden max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-tf-border bg-tf-bg-tertiary">
          {isEntry ? (
            <>
              <ClipboardList className="w-4 h-4 text-tf-accent-green" />
              <span className="text-tf-text-primary font-semibold text-sm">
                EXTRACTED ENTRY
              </span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-tf-accent-blue" />
              <span className="text-tf-text-primary font-semibold text-sm">
                QUERY EXECUTED
              </span>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {data.data &&
            Object.entries(data.data).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-tf-text-muted capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span
                  className={
                    key === "result"
                      ? "text-tf-accent-green font-mono font-semibold"
                      : "text-tf-text-primary font-mono"
                  }
                >
                  {value}
                </span>
              </div>
            ))}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-tf-border bg-tf-bg-tertiary/50">
          {isEntry ? (
            confirmed ? (
              <div className="flex items-center gap-2 text-tf-accent-green text-sm">
                <Check className="w-4 h-4" />
                <span>Entry saved successfully!</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setConfirmed(true)}
                  className="bg-tf-accent-green hover:bg-tf-accent-green-dim text-tf-bg-primary"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Confirm & Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCancelled(true)}
                  className="text-tf-text-muted hover:text-tf-accent-red"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )
          ) : (
            <Link href="/batches">
              <Button
                size="sm"
                variant="ghost"
                className="text-tf-accent-green hover:text-tf-accent-green-dim"
              >
                View Full Report
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
