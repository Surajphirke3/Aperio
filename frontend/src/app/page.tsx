import Link from 'next/link';
import { ArrowRight, BarChart3, Leaf, MessageCircle, Shield, Recycle, Factory } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TraceFlow</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Plastic Recycling
            <span className="text-green-600"> Traceability</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Track plastic from collection to re-manufacturing with AI-powered insights,
            real-time anomaly detection, and comprehensive sustainability metrics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              Launch Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              Try AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Complete Traceability Solution
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
              title="Sankey Flow Visualization"
              description="Interactive D3 diagrams showing material flow through each processing stage with loss tracking."
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6 text-purple-600" />}
              title="AI-Powered Chat"
              description="Natural language interface for data entry, queries, and intelligent insights."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-red-600" />}
              title="Anomaly Detection"
              description="Real-time alerts for unusual loss percentages across sorting, washing, melting stages."
            />
            <FeatureCard
              icon={<Leaf className="h-6 w-6 text-green-600" />}
              title="Carbon Impact"
              description="Calculate CO2 savings from recycled vs virgin plastic production."
            />
            <FeatureCard
              icon={<Factory className="h-6 w-6 text-orange-600" />}
              title="Vendor Scorecards"
              description="Performance tracking with quality scores, delivery metrics, and batch history."
            />
            <FeatureCard
              icon={<Recycle className="h-6 w-6 text-teal-600" />}
              title="Material Tracking"
              description="Support for PET, HDPE, PP, LDPE, PS with type-specific processing data."
            />
          </div>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value="5" label="Material Types" />
            <StatCard value="7" label="Processing Stages" />
            <StatCard value="2.15" label="kg CO₂/kg PET Saved" />
            <StatCard value="Real-time" label="Anomaly Alerts" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>TraceFlow — Plastic Recycling Traceability Platform</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border bg-white hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 rounded-xl bg-white border text-center">
      <div className="text-3xl font-bold text-green-600 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
