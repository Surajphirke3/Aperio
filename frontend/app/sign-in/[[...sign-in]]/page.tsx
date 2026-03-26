"use client"

import { SignIn } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function FloatingOrbs() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const orbs = [
    { size: 300, color: "rgba(34, 197, 94, 0.4)", duration: 28, delay: 0 },
    { size: 400, color: "rgba(20, 184, 166, 0.35)", duration: 32, delay: 2 },
    { size: 250, color: "rgba(59, 130, 246, 0.3)", duration: 25, delay: 4 },
    { size: 350, color: "rgba(34, 197, 94, 0.25)", duration: 30, delay: 1 },
    { size: 280, color: "rgba(20, 184, 166, 0.3)", duration: 26, delay: 3 },
    { size: 320, color: "rgba(59, 130, 246, 0.25)", duration: 34, delay: 5 },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  )
}

function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

function PulsingRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#22c55e]/20"
          style={{
            width: 600 + i * 100,
            height: 600 + i * 100,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 1.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 1.3,
          }}
        />
      ))}
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f0d]">
      {/* Animated gradient background layers */}
      <motion.div
        className="fixed inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(20, 184, 166, 0.08) 0%, transparent 50%), #0a0f0d",
            "radial-gradient(ellipse at 80% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(20, 184, 166, 0.08) 0%, transparent 50%), #0a0f0d",
            "radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 50%), #0a0f0d",
            "radial-gradient(ellipse at 20% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(20, 184, 166, 0.08) 0%, transparent 50%), #0a0f0d",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating orbs */}
      <FloatingOrbs />

      {/* Animated grid */}
      <AnimatedGrid />

      {/* Pulsing rings behind card */}
      <PulsingRing />

      {/* Central glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed top-6 left-6 z-20"
      >
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f1712]/80 backdrop-blur-sm border border-[#1e2e23] text-[#4ade80] hover:bg-[#1a2520] hover:border-[#22c55e]/40 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Main card container */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10"
      >
        {/* Card glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-2xl blur-xl opacity-60"
          style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(20, 184, 166, 0.3), rgba(59, 130, 246, 0.2))",
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* SignIn component */}
        <div className="relative">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-[#0f1712]/80 backdrop-blur-2xl border border-[#22c55e]/20 shadow-2xl rounded-xl relative overflow-hidden",
                headerTitle: "text-[#f0fdf4] font-semibold text-xl",
                headerSubtitle: "text-[#4ade80] text-sm",
                socialButtonsBlockButton: "border-[#1e2e23] hover:bg-[#1a2520] hover:border-[#22c55e]/40 transition-all duration-300",
                socialButtonsBlockButtonText: "text-[#f0fdf4]",
                formFieldLabel: "text-[#f0fdf4] text-sm font-medium",
                formFieldInput: "bg-[#1a2520]/80 border-[#1e2e23] text-[#f0fdf4] focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all duration-300",
                footerActionLink: "text-[#22c55e] hover:text-[#4ade80] transition-colors font-medium",
                formButtonPrimary: "bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#22c55e] text-[#052e16] font-semibold transition-all duration-300 shadow-lg shadow-[#22c55e]/30 hover:shadow-[#22c55e]/50 hover:scale-[1.02]",
                identityPreview: "bg-[#1a2520] border-[#1e2e23] text-[#f0fdf4]",
                formFieldError: "text-[#ef4444]",
                formFieldErrorText: "text-[#ef4444]",
                alert: "bg-[#1a2520] border-[#1e2e23] text-[#f0fdf4]",
                alertText: "text-[#f0fdf4]",
                dividerLine: "bg-[#1e2e23]",
                dividerText: "text-[#4ade80]",
                formFieldHint: "text-[#4ade80]",
                footer: "text-[#4ade80]",
                alternativeMethodsBlockButton: "border-[#1e2e23] hover:bg-[#1a2520] text-[#f0fdf4] transition-all duration-300",
                alternativeMethodsBlockButtonText: "text-[#f0fdf4]",
                otpCodeFieldInput: "bg-[#1a2520] border-[#1e2e23] text-[#f0fdf4]",
                navbar: "hidden",
                navbarButtons: "hidden",
              },
            }}
          />

          {/* Shine effect overlay */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
            }}
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Decorative corner accents */}
      <motion.div
        className="fixed top-0 left-0 w-80 h-80 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 border-l border-t border-[#22c55e]/20 rounded-tl-3xl"
          animate={{ borderColor: ["rgba(34,197,94,0.2)", "rgba(34,197,94,0.4)", "rgba(34,197,94,0.2)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-10 left-10 w-3 h-3 bg-[#22c55e] rounded-full shadow-lg shadow-[#22c55e]/50"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="fixed bottom-0 right-0 w-80 h-80 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 border-r border-b border-[#22c55e]/20 rounded-br-3xl"
          animate={{ borderColor: ["rgba(34,197,94,0.2)", "rgba(34,197,94,0.4)", "rgba(34,197,94,0.2)"] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-3 h-3 bg-[#22c55e] rounded-full shadow-lg shadow-[#22c55e]/50"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
        />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f0d] to-transparent pointer-events-none" />
    </div>
  )
}
