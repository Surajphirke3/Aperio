"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnimatedNumber } from "./animated-number"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  change?: number
  changeLabel?: string
  accentColor?: "green" | "amber" | "red" | "blue" | "teal"
  subtitle?: string
  index?: number
}

export function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  change,
  changeLabel,
  accentColor = "green",
  subtitle,
  index = 0,
}: StatCardProps) {
  const accentColors = {
    green: "border-l-tf-accent-green",
    amber: "border-l-tf-accent-amber",
    red: "border-l-tf-accent-red",
    blue: "border-l-tf-accent-blue",
    teal: "border-l-tf-accent-teal",
  }

  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, borderColor: "var(--accent-green)" }}
      className={cn(
        "bg-tf-bg-secondary rounded-lg p-5 border border-tf-border",
        "border-l-4",
        accentColors[accentColor]
      )}
    >
      <p className="text-tf-text-secondary text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-tf-text-primary text-3xl font-mono font-bold tracking-tight">
          <AnimatedNumber
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        </span>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2 text-sm">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-tf-accent-green" />
          ) : isNegative ? (
            <TrendingDown className="w-4 h-4 text-tf-accent-red" />
          ) : (
            <Minus className="w-4 h-4 text-tf-text-muted" />
          )}
          <span
            className={cn(
              "font-mono",
              isPositive && "text-tf-accent-green",
              isNegative && "text-tf-accent-red",
              !isPositive && !isNegative && "text-tf-text-muted"
            )}
          >
            {isPositive && "+"}
            {change}
            {changeLabel || "%"}
          </span>
          {subtitle && (
            <span className="text-tf-text-secondary ml-1">{subtitle}</span>
          )}
        </div>
      )}
      {!change && subtitle && (
        <p className="text-tf-text-secondary text-sm mt-2">{subtitle}</p>
      )}
    </motion.div>
  )
}
