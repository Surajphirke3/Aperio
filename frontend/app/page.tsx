"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Recycle, ArrowRight, Github, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { N8nWorkflow } from "@/components/landing/n8n-workflow"
import { FeaturesSection } from "@/components/landing/features-section"
import { ProblemSolutionSection } from "@/components/landing/problem-solution"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { BlogSection } from "@/components/landing/blog-section"
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
          className="fixed top-[72px] left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 px-6 py-3 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-foreground">
              Welcome back, <strong>{user?.name}</strong>! Your{" "}
              <span className="text-primary font-semibold capitalize">{user?.role}</span>{" "}
              dashboard awaits.
            </p>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* 1. Hero — engaging above-the-fold with counters, particles, dashboard preview */}
      <HeroSection />

      {/* 2. N8N Workflow — animated pipeline visualization */}
      <N8nWorkflow />

      {/* 3. Features Grid */}
      <FeaturesSection />

      {/* 4. Problem → Solution */}
      <ProblemSolutionSection />

      {/* 5. Stats — animated counters */}
      <StatsSection />

      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. Blog / News Section */}
      <BlogSection />

      {/* 8. CTA Section */}
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
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl group shadow-lg shadow-primary/25">
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

      {/* 9. Footer — expanded */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-bold text-lg">Aperio</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                AI-powered traceability for recycled materials. Track every gram, trust every chain.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                {["Dashboard", "AI Chat", "Carbon Tracking", "Vendor Analytics", "Batch Management"].map((item) => (
                  <li key={item}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                {["About Us", "Blog", "Careers", "Press Kit", "Contact"].map((item) => (
                  <li key={item}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary/60" />
                  hello@aperio.app
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary/60" />
                  +91 98765 43210
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary/60 mt-0.5" />
                  Pune, Maharashtra, India
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Aperio. Built for a sustainable future.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a
                  key={item}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
