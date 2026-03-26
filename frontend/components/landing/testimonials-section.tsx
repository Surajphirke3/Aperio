"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "Aperio reduced our manual data entry by 90%. Our operators just describe what happened in plain language, and the system handles everything — logging, categorization, chain-of-custody updates.",
    name: "Priya Sharma",
    role: "Operations Lead",
    company: "GreenCycle Industries",
    rating: 5,
    gradient: "from-green-500/10 to-emerald-500/5",
  },
  {
    quote:
      "The carbon intelligence module alone justified our investment. We now generate verifiable CO₂ offset reports that our ESG team can publish with confidence.",
    name: "Marcus Chen",
    role: "Sustainability Director",
    company: "EcoPlast Corp",
    rating: 5,
    gradient: "from-blue-500/10 to-indigo-500/5",
  },
  {
    quote:
      "As a regulator, having full chain-of-custody visibility across all licensed recyclers — in real time — has completely transformed our audit process. What used to take weeks now takes hours.",
    name: "Dr. Anita Desai",
    role: "Environmental Compliance Officer",
    company: "Maharashtra PCBO",
    rating: 5,
    gradient: "from-purple-500/10 to-pink-500/5",
  },
]

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium inline-block mb-4">
            Trusted by Industry Leaders
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            What Our Stakeholders Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real feedback from recyclers, regulators, and sustainability teams using Aperio.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn(
                "relative rounded-2xl border border-border bg-gradient-to-br p-6 group",
                t.gradient
              )}
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />

              <p className="text-foreground text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
