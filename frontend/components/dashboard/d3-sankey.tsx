"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { sankey, sankeyLinkHorizontal, sankeyJustify } from "d3-sankey"

interface SankeyData {
  nodes: { name: string }[]
  links: { source: number; target: number; value: number }[]
}

const STAGE_COLORS: Record<string, string> = {
  Collection: "#22c55e",
  Sorting: "#14b8a6",
  Processing: "#3b82f6",
  Granulation: "#8b5cf6",
  Dispatch: "#06b6d4",
}

const LOSS_COLOR = "#ef4444"

function getNodeColor(name: string): string {
  if (name.startsWith("Loss")) return LOSS_COLOR
  return STAGE_COLORS[name] || "#64748b"
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return v.toLocaleString()
}

interface LayoutNode {
  name: string
  x0: number
  y0: number
  x1: number
  y1: number
  sourceLinks: LayoutLink[]
  targetLinks: LayoutLink[]
  color: string
}

interface LayoutLink {
  source: LayoutNode
  target: LayoutNode
  value: number
  width: number
  points: string
}

export function D3SankeyDiagram({ data }: { data: SankeyData }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 700, h: 380 })
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setDims({ w, h: 380 })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const layout = useMemo(() => {
    if (!data?.nodes?.length || !data?.links?.length) return null

    const filtered = data.links.filter((l) => l.source !== l.target && l.value > 0)

    const gen = (sankey() as any)
      .nodeId((_: any, i: number) => i)
      .nodeAlign(sankeyJustify)
      .nodeWidth(16)
      .nodePadding(18)
      .extent([
        [8, 8],
        [dims.w - 160, dims.h - 8],
      ])

    const graph = gen({
      nodes: data.nodes.map((n) => ({ ...n })),
      links: filtered,
    })

    const nodes: LayoutNode[] = graph.nodes.map((n: any) => ({
      name: n.name,
      x0: n.x0,
      y0: n.y0,
      x1: n.x1,
      y1: n.y1,
      sourceLinks: n.sourceLinks || [],
      targetLinks: n.targetLinks || [],
      color: getNodeColor(n.name),
    }))

    const linkPath = sankeyLinkHorizontal()
    const links: LayoutLink[] = graph.links.map((l: any) => {
      const path = linkPath(l) || ""
      // Parse path to points for gradient
      const srcNode = nodes.find((n) => n.name === l.source.name)!
      const tgtNode = nodes.find((n) => n.name === l.target.name)!
      return {
        source: srcNode,
        target: tgtNode,
        value: l.value,
        width: Math.max(1.5, l.width),
        points: path,
      } as any
    })

    return { nodes, links, linkPath }
  }, [data, dims])

  if (!layout) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 text-sm text-muted-foreground">
        No flow data available
      </div>
    )
  }

  const { nodes, links, linkPath } = layout

  const onLinkEnter = (i: number, l: LayoutLink, e: React.MouseEvent) => {
    setHoveredLink(i)
    const rect = containerRef.current!.getBoundingClientRect()
    setTooltip({
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 8,
      text: `${l.source.name} → ${l.target.name}: ${fmt(l.value)} kg`,
    })
  }

  const onNodeEnter = (n: LayoutNode, e: React.MouseEvent) => {
    setHoveredNode(n.name)
    const rect = containerRef.current!.getBoundingClientRect()
    const total = Math.max(
      n.sourceLinks.reduce((s, l) => s + l.value, 0),
      n.targetLinks.reduce((s, l) => s + l.value, 0)
    )
    setTooltip({
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 8,
      text: `${n.name}: ${fmt(total)} kg`,
    })
  }

  const onLeave = () => {
    setHoveredLink(null)
    setHoveredNode(null)
    setTooltip(null)
  }

  const onMove = (e: React.MouseEvent) => {
    if (!tooltip) return
    const rect = containerRef.current!.getBoundingClientRect()
    setTooltip((t) =>
      t ? { ...t, x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 8 } : t
    )
  }

  return (
    <div ref={containerRef} className="relative w-full h-full" onMouseLeave={onLeave} onMouseMove={onMove}>
      <svg width="100%" height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`}>
        <defs>
          {links.map((l, i) => (
            <linearGradient
              key={`g${i}`}
              id={`sankey-grad-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={l.source.x1}
              x2={l.target.x0}
            >
              <stop offset="0%" stopColor={l.source.color} />
              <stop offset="100%" stopColor={l.target.color} />
            </linearGradient>
          ))}
        </defs>

        {/* Links */}
        {links.map((l, i) => {
          const path = typeof l.points === "string" ? l.points : (linkPath(l as any) ?? "")
          const isHovered = hoveredLink === i
          const isConnected =
            hoveredNode &&
            (l.source.name === hoveredNode || l.target.name === hoveredNode)
          const dimmed =
            (hoveredLink !== null && !isHovered) ||
            (hoveredNode !== null && !isConnected)
          return (
            <path
              key={`l${i}`}
              d={path}
              fill="none"
              stroke={`url(#sankey-grad-${i})`}
              strokeWidth={l.width}
              strokeOpacity={dimmed ? 0.08 : isHovered || isConnected ? 0.6 : 0.3}
              style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
              onMouseEnter={(e) => onLinkEnter(i, l, e)}
              onMouseLeave={onLeave}
              className="cursor-pointer"
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const h = Math.max(2, n.y1 - n.y0)
          const isHovered = hoveredNode === n.name
          const isConnected =
            hoveredLink !== null &&
            links.some(
              (l, i) =>
                hoveredLink === i &&
                (l.source.name === n.name || l.target.name === n.name)
            )
          const dimmed =
            (hoveredNode !== null && !isHovered) ||
            (hoveredLink !== null && !isConnected)
          return (
            <g key={n.name}>
              <rect
                x={n.x0}
                y={n.y0}
                width={n.x1 - n.x0}
                height={h}
                rx={3}
                fill={n.color}
                opacity={dimmed ? 0.25 : 1}
                stroke="none"
                style={{ transition: "opacity 0.2s" }}
                onMouseEnter={(e) => onNodeEnter(n, e)}
                onMouseLeave={onLeave}
                className="cursor-pointer"
              />
              {/* Glow on hover */}
              {isHovered && (
                <rect
                  x={n.x0 - 2}
                  y={n.y0 - 2}
                  width={n.x1 - n.x0 + 4}
                  height={h + 4}
                  rx={5}
                  fill="none"
                  stroke={n.color}
                  strokeWidth={2}
                  opacity={0.5}
                />
              )}
            </g>
          )
        })}

        {/* Labels */}
        {nodes.map((n) => {
          const midY = (n.y0 + n.y1) / 2
          const isLoss = n.name.startsWith("Loss")
          return (
            <g key={`lbl-${n.name}`}>
              {/* Stage name */}
              <text
                x={n.x1 + 8}
                y={midY}
                dy={isLoss ? "0em" : "-0.15em"}
                fill={isLoss ? "#ef4444" : "#94a3b8"}
                fontSize={12}
                fontFamily="var(--font-mono, monospace)"
                fontWeight={500}
              >
                {n.name}
              </text>
              {/* Value */}
              <text
                x={n.x1 + 8}
                y={midY}
                dy={isLoss ? "1.2em" : "1.05em"}
                fill="#e2e8f0"
                fontSize={11}
                fontFamily="var(--font-mono, monospace)"
                fontWeight={700}
              >
                {fmt(
                  Math.max(
                    n.sourceLinks.reduce((s, l) => s + l.value, 0),
                    n.targetLinks.reduce((s, l) => s + l.value, 0)
                  )
                )}{" "}
                kg
              </text>
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 rounded-md border border-border bg-popover px-3 py-2 text-xs font-mono text-popover-foreground shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
