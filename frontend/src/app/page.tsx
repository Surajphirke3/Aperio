'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const floatingVariants = {
  animate: (i: number) => ({
    y: [0, -15, 0],
    x: [0, i % 2 === 0 ? 10 : -10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  }),
};

const particleVariants = {
  animate: (i: number) => ({
    y: [0, -30, 0],
    opacity: [0.2, 0.8, 0.2],
    scale: [1, 1.2, 1],
    transition: {
      duration: 2 + i * 0.3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  }),
};

const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(16, 185, 129, 0.3)',
      '0 0 40px rgba(16, 185, 129, 0.6)',
      '0 0 20px rgba(16, 185, 129, 0.3)',
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

const stats = [
  { value: '50K+', label: 'Tons Recycled', icon: '♻️' },
  { value: '120+', label: 'Partner Plants', icon: '🏭' },
  { value: '98%', label: 'Accuracy Rate', icon: '🎯' },
  { value: '2M+', label: 'kg CO₂ Saved', icon: '🌍' },
];

const features = [
  {
    title: 'Chat to Log',
    desc: 'Just speak naturally - our AI understands and logs everything',
    icon: '💬',
    color: 'from-emerald-400 to-teal-500',
    example: '"Purchased 300kg PET from Vendor A yesterday"',
  },
  {
    title: 'Visualize Flow',
    desc: 'Watch materials flow from collection to dispatch in real-time',
    icon: '📊',
    color: 'from-blue-400 to-indigo-500',
    example: 'Beautiful Sankey diagrams show every kg',
  },
  {
    title: 'AI Insights',
    desc: 'Get smart recommendations and anomaly detection automatically',
    icon: '🤖',
    color: 'from-purple-400 to-pink-500',
    example: '"Processing loss is 8% above normal"',
  },
  {
    title: 'Carbon Tracking',
    desc: 'See your environmental impact in real numbers',
    icon: '🌱',
    color: 'from-green-400 to-emerald-500',
    example: '2450 kg CO₂ saved = 35 trees planted',
  },
];

const materialIcons = ['🥤', '🧴', '🛍️', '📦', '♻️'];

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      {/* Floating particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={particleVariants}
              animate="animate"
              className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Mouse follower glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
      />

      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl">♻️</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Aperio
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing'].map((item, i) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-300 hover:text-emerald-400 transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>

          <Link href="/dashboard">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow"
            >
              Launch App →
            </motion.button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32"
      >
        <div className="text-center">
          {/* Floating material icons */}
          <div className="absolute inset-0 pointer-events-none">
            {materialIcons.map((icon, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={floatingVariants}
                animate="animate"
                className="absolute text-4xl opacity-20"
                style={{
                  left: `${15 + i * 18}%`,
                  top: `${20 + (i % 3) * 15}%`,
                }}
              >
                {icon}
              </motion.div>
            ))}
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-sm">AI-Powered Recycling Intelligence</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Turn Plastic Waste
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Into Pure Progress
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Revolutionize your recycling operations with AI that understands natural language.
            Just <span className="text-emerald-400">chat</span> to log data, 
            <span className="text-blue-400"> visualize</span> material flow, and 
            <span className="text-purple-400"> discover insights</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
          <Link href="/dashboard">
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-white text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
            
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-white text-lg border-2 border-gray-600 hover:border-emerald-500 transition-colors flex items-center gap-2"
              >
                <span className="text-2xl">💬</span>
                Try AI Chat Demo
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple to Use.{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful Results.
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to run a smarter recycling operation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 overflow-hidden"
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.span
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="text-5xl"
                    >
                      {feature.icon}
                    </motion.span>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                  
                  {/* Example box */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-4 rounded-xl bg-black/30 border border-white/10"
                  >
                    <span className="text-emerald-400 font-mono text-sm">Example: </span>
                    <span className="text-gray-300 font-mono text-sm">{feature.example}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white text-center mb-16"
          >
            How It Works
          </motion.h2>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500 hidden md:block" />

            {[
              { step: '01', title: 'Chat Naturally', desc: 'Tell our AI what happened - "Received 500kg HDPE from GreenCo"', icon: '💬' },
              { step: '02', title: 'AI Extracts Data', desc: 'Our AI extracts material, quantity, vendor, and creates a batch entry', icon: '🤖' },
              { step: '03', title: 'Visualize instantly', desc: 'Watch your Sankey diagram update in real-time', icon: '📊' },
              { step: '04', title: 'Get Insights', desc: 'AI flags anomalies and suggests improvements', icon: '💡' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`inline-block p-8 rounded-2xl bg-gradient-to-br ${i % 2 === 0 ? 'from-emerald-500/20 to-teal-500/10' : 'from-blue-500/20 to-indigo-500/10'} border border-white/10`}
                  >
                    <span className="text-5xl block mb-4">{item.icon}</span>
                    <div className="text-emerald-400 font-mono text-sm mb-2">STEP {item.step}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </motion.div>
                </div>
                
                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50" />
                
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 rounded-3xl p-12 border border-emerald-500/30 backdrop-blur-xl"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            🚀
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 120+ recycling plants using Aperio to save time, reduce errors, and track every kg
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-white text-xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50"
            >
              Get Started Free →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♻️</span>
            <span className="font-bold text-white">Aperio</span>
          </div>
          <p className="text-gray-500 text-sm">
            Built with 💚 for a sustainable future
          </p>
        </div>
      </footer>
    </div>
  );
}