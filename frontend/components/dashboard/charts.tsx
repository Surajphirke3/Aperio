"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sankey,
  Layer,
  Rectangle,
} from "recharts"
import { motion } from "framer-motion"
import {
  weeklyData,
  stageData,
  materialBreakdown,
  sankeyData,
  completenessBreakdown,
} from "@/lib/mockData"

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-3 shadow-xl">
        <p className="text-tf-text-primary font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-mono" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} kg
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Weekly Line Chart
export function WeeklyLineChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
    >
      <h3 className="text-tf-text-primary font-semibold mb-4">
        Weekly Material Throughput
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2e23" />
          <XAxis dataKey="week" stroke="#86efac" fontSize={12} />
          <YAxis stroke="#86efac" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="PET"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="HDPE"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={{ fill: "#14b8a6", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="PP"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: "#f59e0b", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// Batch Stage Bar Chart
export function BatchStageBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
    >
      <h3 className="text-tf-text-primary font-semibold mb-4">
        Batch Stage Analysis
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={stageData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2e23" />
          <XAxis type="number" stroke="#86efac" fontSize={12} />
          <YAxis dataKey="stage" type="category" stroke="#86efac" fontSize={12} width={90} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="input" name="Input" fill="#22c55e" radius={[0, 4, 4, 0]} />
          <Bar dataKey="loss" name="Loss" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// Material Pie Chart
export function MaterialPieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
    >
      <h3 className="text-tf-text-primary font-semibold mb-4">
        Material Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={materialBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {materialBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-3">
                    <p className="text-tf-text-primary font-mono">
                      {payload[0].name}: {payload[0].value}%
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            formatter={(value) => <span className="text-tf-text-secondary">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-4">
        <p className="text-tf-text-muted text-sm">Total</p>
        <p className="text-tf-text-primary font-mono font-bold text-xl">
          18,420 kg
        </p>
      </div>
    </motion.div>
  )
}

// Completeness Gauge
export function CompletenessGauge() {
  const data = [{ name: "Completeness", value: 91.4, fill: "#22c55e" }]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
    >
      <h3 className="text-tf-text-primary font-semibold mb-4">
        Completeness Score
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={12}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background={{ fill: "#1e2e23" }}
            dataKey="value"
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center -mt-16 mb-4">
        <p className="text-tf-accent-green font-mono font-bold text-3xl">91.4%</p>
      </div>
      <div className="space-y-2 mt-4">
        {completenessBreakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-tf-text-secondary">{item.label}</span>
            <span className="text-tf-text-primary font-mono">{item.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// Sankey Chart for Material Flow
const CustomSankeyNode = ({ x, y, width, height, index, payload }: any) => {
  const isLoss = payload.name.includes("Loss")
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={isLoss ? "#ef4444" : payload.name === "Dispatch" ? "#14b8a6" : "#22c55e"}
      fillOpacity={0.9}
      radius={4}
    />
  )
}

const CustomSankeyLink = ({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index }: any) => {
  const isLossLink = index >= 2 // Loss links are at indices 2, 4, 6
  return (
    <path
      d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      fill="none"
      stroke={isLossLink ? "#ef4444" : "#22c55e"}
      strokeWidth={linkWidth}
      strokeOpacity={0.4}
    />
  )
}

export function MaterialFlowSankey() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-tf-bg-secondary border border-tf-border rounded-lg p-5"
    >
      <h3 className="text-tf-text-primary font-semibold mb-4">
        Material Flow (Sankey)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <Sankey
          data={sankeyData}
          node={<CustomSankeyNode />}
          link={<CustomSankeyLink />}
          nodePadding={50}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-tf-bg-secondary border border-tf-border rounded-lg p-3">
                    <p className="text-tf-text-primary font-mono">
                      {data.source?.name || data.name} → {data.target?.name || ""}
                    </p>
                    <p className="text-tf-accent-green font-mono">
                      {data.value?.toLocaleString() || data.value} kg
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </Sankey>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-tf-accent-green" />
          <span className="text-tf-text-secondary">Material Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-tf-accent-red" />
          <span className="text-tf-text-secondary">Process Loss</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-tf-accent-teal" />
          <span className="text-tf-text-secondary">Dispatch</span>
        </div>
      </div>
    </motion.div>
  )
}
