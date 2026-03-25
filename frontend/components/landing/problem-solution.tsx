"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, FormInput, BarChart3, Brain, AlertTriangle } from "lucide-react"

const problemSolutions = [
  {
    problem: {
      title: "Rigid forms and manual entry",
      description: '"Purchased 300kg PET..."',
    },
    solution: {
      title: "Chat in plain English",
      description: "AI extracts everything",
    },
    icon: FormInput,
  },
  {
    problem: {
      title: "Poorly visualized reporting",
      description: "Fragmented data",
    },
    solution: {
      title: "Sankey + timelines + charts",
      description: "One unified lifecycle view",
    },
    icon: BarChart3,
  },
  {
    problem: {
      title: "Hard to understand for",
      description: "non-technical stakeholders",
    },
    solution: {
      title: 'Plain-English AI summaries',
      description: '"You lost 34% — here\'s why"',
    },
    icon: Brain,
  },
  {
    problem: {
      title: "Error-prone workflows",
      description: "Manual quality checks",
    },
    solution: {
      title: "Anomaly detection + alerts",
      description: "AI flags issues instantly",
    },
    icon: AlertTriangle,
  },
]

export function ProblemSolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-tf-bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-tf-text-primary tracking-tight mb-4">
            The Problem We're Solving
          </h2>
          <p className="text-tf-text-secondary text-lg max-w-2xl mx-auto">
            Current traceability systems are rigid, fragmented, and hard to use.
            Aperio transforms every pain point into a streamlined solution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {problemSolutions.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="bg-tf-bg-tertiary border border-tf-border rounded-xl overflow-hidden"
              >
                <div className="flex">
                  {/* Problem Side */}
                  <div className="flex-1 p-6 bg-tf-accent-red/10 border-r border-tf-border relative">
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-tf-accent-red/20 text-tf-accent-red">
                        PROBLEM
                      </span>
                    </div>
                    <div className="mt-8">
                      <p className="text-tf-text-primary font-medium mb-1">
                        {item.problem.title}
                      </p>
                      <p className="text-tf-text-muted text-sm">
                        {item.problem.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center w-12 bg-tf-bg-tertiary relative">
                    <motion.div
                      initial={{ x: -5 }}
                      animate={isInView ? { x: [0, 5, 0] } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      <ArrowRight className="w-5 h-5 text-tf-accent-green" />
                    </motion.div>
                  </div>

                  {/* Solution Side */}
                  <div className="flex-1 p-6 bg-tf-accent-green/10 relative">
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-tf-accent-green/20 text-tf-accent-green">
                        SOLUTION
                      </span>
                    </div>
                    <div className="mt-8 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-tf-accent-green/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-tf-accent-green" />
                      </div>
                      <div>
                        <p className="text-tf-text-primary font-medium mb-1">
                          {item.solution.title}
                        </p>
                        <p className="text-tf-text-muted text-sm">
                          {item.solution.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
