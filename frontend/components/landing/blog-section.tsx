"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, ArrowRight, Clock, Tag, TrendingUp, Newspaper, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

const blogPosts = [
  {
    id: 1,
    title: "How AI Is Transforming Plastic Recycling Rates Worldwide",
    excerpt:
      "Machine learning algorithms are now achieving 96%+ sorting accuracy — a 340% improvement over manual processes. We explore the technologies driving this revolution.",
    date: "Mar 22, 2026",
    readTime: "6 min read",
    category: "Technology",
    categoryColor: "text-blue-500 bg-blue-500/10",
    featured: true,
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  {
    id: 2,
    title: "EU Circular Economy Act: What It Means for Recyclers",
    excerpt:
      "New regulations mandate 65% recycling rates by 2030, with mandatory traceability documentation. Here's how Aperio-powered platforms are helping companies prepare.",
    date: "Mar 18, 2026",
    readTime: "8 min read",
    category: "Regulation",
    categoryColor: "text-purple-500 bg-purple-500/10",
    featured: false,
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    id: 3,
    title: "Carbon Credits in Recycling: A $47B Opportunity",
    excerpt:
      "The voluntary carbon market is booming, and recycled material processors stand to earn significant revenue. We break down the math behind carbon offset certification.",
    date: "Mar 14, 2026",
    readTime: "5 min read",
    category: "Market",
    categoryColor: "text-green-500 bg-green-500/10",
    featured: false,
    gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
  },
  {
    id: 4,
    title: "Case Study: GreenCycle Partners Cuts Waste by 34%",
    excerpt:
      "See how GreenCycle implemented full-stack traceability with Aperio, reducing processing waste from 22% to 14.5% in just 3 months.",
    date: "Mar 10, 2026",
    readTime: "4 min read",
    category: "Case Study",
    categoryColor: "text-teal-500 bg-teal-500/10",
    featured: false,
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: 5,
    title: "The True Cost of Non-Traceable Recycling",
    excerpt:
      "From greenwashing lawsuits to supply chain fraud — we explore why material traceability is no longer optional for responsible businesses.",
    date: "Mar 6, 2026",
    readTime: "7 min read",
    category: "Industry",
    categoryColor: "text-amber-500 bg-amber-500/10",
    featured: false,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
]

/* ── Blog card icons based on category ── */
const categoryIcons: Record<string, typeof TrendingUp> = {
  Technology: TrendingUp,
  Regulation: Newspaper,
  Market: TrendingUp,
  "Case Study": Leaf,
  Industry: Tag,
}

export function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.1 })
  const featured = blogPosts[0]
  const others = blogPosts.slice(1)

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium inline-block mb-4">
              Latest Insights
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              News & Research
            </h2>
            <p className="text-muted-foreground text-lg mt-2 max-w-xl">
              Stay ahead with the latest from recycling, sustainability, and AI-driven traceability.
            </p>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            className="mt-4 md:mt-0 flex items-center gap-2 text-primary font-medium text-sm group"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Featured Article (large) ── */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden row-span-2"
          >
            {/* Image placeholder with gradient */}
            <div
              className={cn(
                "relative h-56 bg-gradient-to-br flex items-center justify-center",
                featured.gradient
              )}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMmM1NWUiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm bg-card/30"
              >
                <TrendingUp className="w-10 h-10 text-blue-500/60" />
              </motion.div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", featured.categoryColor)}>
                  {featured.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {featured.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {featured.readTime}
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                {featured.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {featured.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-2.5 transition-all">
                Read More <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.article>

          {/* ── Smaller Articles Grid ── */}
          <div className="grid gap-4">
            {others.map((post, index) => {
              const CatIcon = categoryIcons[post.category] || Tag
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="group cursor-pointer flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all"
                >
                  {/* Mini icon thumbnail */}
                  <div
                    className={cn(
                      "w-16 h-16 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br",
                      post.gradient
                    )}
                  >
                    <CatIcon className="w-6 h-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", post.categoryColor)}>
                        {post.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{post.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
