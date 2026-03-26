"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { TopBar } from "@/components/layout/topbar"
import { BatchCard } from "@/components/batches/batch-card"
import { BatchFilters } from "@/components/batches/batch-filters"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { batches as mockBatches } from "@/lib/mockData"
import { fetchFromAPI } from "@/lib/api"

export default function BatchesPage() {
  const { data: batches, isLoading } = useBatches()

  const [filters, setFilters] = useState({
    material: "all",
    stage: "all",
    status: "all",
    dateRange: "7d",
    search: "",
  })
  
  const [liveBatches, setLiveBatches] = useState<any[]>([])
  
  useEffect(() => {
    fetchFromAPI("/batches/")
      .then((data) => {
        if (data.batches) setLiveBatches(data.batches)
      })
      .catch((err) => console.error("Error fetching batches:", err))
  }, [])
  
  const currentBatches = liveBatches.length > 0 ? liveBatches : mockBatches;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredBatches = useMemo(() => {
    return currentBatches.filter((batch: any) => {
      // Material filter
      if (filters.material !== "all") {
        const materialLower = batch.material.toLowerCase()
        if (!materialLower.includes(filters.material)) return false
      }

      // Status filter
      if (filters.status !== "all") {
        if (batch.status !== filters.status) return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesId = batch.id.toLowerCase().includes(searchLower)
        const matchesVendor = batch.vendor.toLowerCase().includes(searchLower)
        if (!matchesId && !matchesVendor) return false
      }

      return true
    })
  }, [filters, currentBatches])

  return (
    <div className="min-h-screen">
      <TopBar
        title="Material Batches"
        subtitle="Track every batch from collection to dispatch"
      />

      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading batches...
                </span>
              ) : (
                <>
                  Showing{" "}
                  <span className="text-foreground font-mono">
                    {filteredBatches.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-foreground font-mono">
                    {batches.length}
                  </span>{" "}
                  batches
                </>
              )}
            </p>
          </div>
          <Link href="/chat">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <MessageSquare className="w-4 h-4 mr-2" />
              New Entry via Chat
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <BatchFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Batch Grid */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBatches.map((batch, index) => (
              <BatchCard key={batch.id} batch={batch} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredBatches.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">
              No batches match your filters
            </p>
            <p className="text-muted-foreground/60 mt-2">
              Try adjusting your search criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
