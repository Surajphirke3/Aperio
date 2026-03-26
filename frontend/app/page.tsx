"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Recycle, ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { LifecycleAnimation } from "@/components/landing/lifecycle-animation"
import { FeaturesSection } from "@/components/landing/features-section"
import { ProblemSolutionSection } from "@/components/landing/problem-solution"
import { StatsSection } from "@/components/landing/stats-section"
import { ChatbotWidget } from "@/components/landing/chatbot-widget"
import { useAuth } from "@/lib/auth-context"

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Authenticated welcome banner */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="fixed top-[72px] left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 px-6 py-3"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-foreground">
              Welcome back, <strong>{user?.name}</strong>! Your{" "}
              <span className="text-primary font-semibold capitalize">{user?.role}</span> dashboard awaits.
            </p>
            <Link href="/dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Hero */}
      <HeroSection />

      {/* Lifecycle Animation */}
      <LifecycleAnimation />

      {/* Features */}
      <FeaturesSection />

      {/* Problem → Solution */}
      <ProblemSolutionSection />

      {/* Stats */}
      <StatsSection />

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34,197,94,0.12) 0%, transparent 60%)`,
            }}
          />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
              Ready to Transform{" "}
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Your Traceability?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join industry leaders who trust Aperio for end-to-end material
              tracking and sustainability reporting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-border text-foreground px-8 py-6 text-base rounded-xl"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Recycle className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground text-sm">
              Aperio — Intelligent Traceability Platform
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Aperio. Built for a sustainable future.
          </p>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
