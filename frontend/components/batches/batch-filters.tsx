"use client"

import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface BatchFiltersProps {
  filters: {
    material: string
    stage: string
    status: string
    dateRange: string
    search: string
  }
  onFilterChange: (key: string, value: string) => void
}

const materials = ["All", "PET", "HDPE", "PP", "PVC"]
const stages = ["All", "Collection", "Sorting", "Processing", "Granulation", "Dispatch"]
const statuses = ["All", "Active", "Complete", "Anomaly", "Warning"]
const dateRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
]

export function BatchFilters({ filters, onFilterChange }: BatchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-tf-bg-secondary border border-tf-border rounded-lg">
      {/* Material */}
      <Select
        value={filters.material}
        onValueChange={(value) => onFilterChange("material", value)}
      >
        <SelectTrigger className="w-[140px] bg-tf-bg-tertiary border-tf-border text-tf-text-primary">
          <SelectValue placeholder="Material" />
        </SelectTrigger>
        <SelectContent className="bg-tf-bg-secondary border-tf-border">
          {materials.map((m) => (
            <SelectItem
              key={m}
              value={m.toLowerCase()}
              className="text-tf-text-primary hover:bg-tf-bg-tertiary"
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Stage */}
      <Select
        value={filters.stage}
        onValueChange={(value) => onFilterChange("stage", value)}
      >
        <SelectTrigger className="w-[140px] bg-tf-bg-tertiary border-tf-border text-tf-text-primary">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent className="bg-tf-bg-secondary border-tf-border">
          {stages.map((s) => (
            <SelectItem
              key={s}
              value={s.toLowerCase()}
              className="text-tf-text-primary hover:bg-tf-bg-tertiary"
            >
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      >
        <SelectTrigger className="w-[140px] bg-tf-bg-tertiary border-tf-border text-tf-text-primary">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-tf-bg-secondary border-tf-border">
          {statuses.map((s) => (
            <SelectItem
              key={s}
              value={s.toLowerCase()}
              className="text-tf-text-primary hover:bg-tf-bg-tertiary"
            >
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range Pills */}
      <div className="flex bg-tf-bg-tertiary rounded-lg p-1">
        {dateRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => onFilterChange("dateRange", range.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filters.dateRange === range.value
                ? "bg-tf-accent-green text-tf-bg-primary"
                : "text-tf-text-secondary hover:text-tf-text-primary"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tf-text-muted" />
        <Input
          placeholder="Search by batch ID or vendor..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10 bg-tf-bg-tertiary border-tf-border text-tf-text-primary placeholder:text-tf-text-muted"
        />
      </div>
    </div>
  )
}
