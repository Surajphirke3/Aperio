"use client"

import { motion } from "framer-motion"
import { Leaf, Car, Plane, TreeDeciduous } from "lucide-react"

interface ImpactNarrativeProps {
  totalSavedKg: number
  topMaterial: string
  topMaterialPercent: number
}

export function ImpactNarrative({
  totalSavedKg,
  topMaterial,
  topMaterialPercent,
}: ImpactNarrativeProps) {
  // Calculate equivalents
  const carsOffRoad = (totalSavedKg / 4600 * 1).toFixed(1) // ~4600 kg CO2 per car per year
  const flightsSkipped = Math.round(totalSavedKg / 270) // ~270 kg CO2 per Mumbai-Delhi flight
  const treesGrown = Math.round(totalSavedKg / 20) // ~20 kg CO2 absorbed per tree per year

  const comparisons = [
    {
      icon: Car,
      value: carsOffRoad,
      label: "cars off the road for a full year",
      delay: 0.3,
    },
    {
      icon: Plane,
      value: flightsSkipped,
      label: "Mumbai–Delhi flights",
      delay: 0.5,
    },
    {
      icon: TreeDeciduous,
      value: treesGrown,
      label: "trees grown for a year",
      delay: 0.7,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-tf-accent-green/20 via-tf-accent-teal/15 to-tf-accent-green/20 border border-tf-accent-green/30 rounded-xl p-6 md:p-8"
    >
      <div className="flex items-start gap-4 md:gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-tf-accent-green/30 flex items-center justify-center flex-shrink-0"
        >
          <Leaf className="w-7 h-7 md:w-8 md:h-8 text-tf-accent-green" />
        </motion.div>

        <div className="flex-1">
          <h3 className="text-tf-text-primary font-semibold text-lg mb-3">
            This Month's Environmental Impact — Plain English
          </h3>

          <p className="text-tf-text-secondary leading-relaxed mb-6">
            By using recycled plastic instead of making new plastic,
            Aperio-tracked batches avoided{" "}
            <span className="text-tf-accent-green font-bold text-xl">
              {totalSavedKg.toLocaleString()} kg
            </span>{" "}
            of CO2 emissions this month.
          </p>

          <p className="text-tf-text-muted text-sm mb-4">
            To put that in perspective:
          </p>

          <div className="space-y-3">
            {comparisons.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-tf-bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-tf-text-secondary" />
                  </div>
                  <p className="text-tf-text-secondary">
                    <span className="text-tf-text-primary font-semibold font-mono">
                      = {item.value}
                    </span>{" "}
                    {item.label}
                  </p>
                </motion.div>
              )
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-tf-text-muted text-sm mt-6 pt-4 border-t border-tf-accent-green/20"
          >
            Most impact came from{" "}
            <span className="text-tf-text-primary font-medium">{topMaterial}</span>{" "}
            recycling ({topMaterialPercent}% of total).
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
