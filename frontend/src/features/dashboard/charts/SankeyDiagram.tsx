'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, SankeyNode as D3SankeyNode, SankeyLink as D3SankeyLink } from 'd3-sankey';
import type { SankeyData } from '@/shared/types';

interface SankeyDiagramProps {
  data: SankeyData;
}

interface SNodeExtra {
  id: string;
  name: string;
  value: number;
}

interface SLinkExtra {
  source: string;
  target: string;
  value: number;
}

type SNode = D3SankeyNode<SNodeExtra, SLinkExtra>;
type SLink = D3SankeyLink<SNodeExtra, SLinkExtra>;

const LOSS_COLOR = '#ef4444';
const LOSS_LINK_COLOR = '#f9731680';
const STAGE_COLORS = ['#22c55e', '#16a34a', '#14b8a6', '#0d9488', '#0891b2', '#0284c7', '#3b82f6'];

function isLossNode(id: string): boolean {
  return id.endsWith('_loss');
}

function nodeColor(id: string, index: number): string {
  if (isLossNode(id)) return LOSS_COLOR;
  return STAGE_COLORS[index % STAGE_COLORS.length];
}

function linkColor(sourceId: string, targetId: string): string {
  if (isLossNode(targetId as string)) return LOSS_LINK_COLOR;
  return '#22c55e40';
}

export function SankeyDiagram({ data }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({ width: Math.max(width, 400), height: 420 });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateDimensions]);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || !data.links.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 140, bottom: 20, left: 140 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Build index map
    const nodeMap = new Map(data.nodes.map((n, i) => [n.id, i]));

    const sankeyNodes: SNodeExtra[] = data.nodes.map((n) => ({ ...n }));
    const sankeyLinks: SLinkExtra[] = data.links
      .filter((l) => nodeMap.has(l.source) && nodeMap.has(l.target))
      .map((l) => ({ source: l.source, target: l.target, value: l.value }));

    const sankeyGen = d3Sankey<SNodeExtra, SLinkExtra>()
      .nodeId((d: SNodeExtra) => d.id)
      .nodeWidth(18)
      .nodePadding(14)
      .extent([[0, 0], [width, height]]);

    const graph = sankeyGen({
      nodes: sankeyNodes.map((d) => ({ ...d })),
      links: sankeyLinks.map((d) => ({ ...d })),
    });

    // Links
    g.append('g')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', (d: SLink) => {
        const sId = typeof d.source === 'object' ? (d.source as SNode).id : d.source;
        const tId = typeof d.target === 'object' ? (d.target as SNode).id : d.target;
        return linkColor(sId ?? '', tId ?? '');
      })
      .attr('stroke-width', (d: SLink) => Math.max(1, d.width ?? 1))
      .attr('opacity', 0)
      .on('mouseover', function (event: MouseEvent, d: SLink) {
        d3.select(this).attr('opacity', 0.9);
        const sName = typeof d.source === 'object' ? (d.source as SNode).name : d.source;
        const tName = typeof d.target === 'object' ? (d.target as SNode).name : d.target;
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = `${event.offsetX + 10}px`;
          tooltipRef.current.style.top = `${event.offsetY - 20}px`;
          tooltipRef.current.textContent = `${d.value.toLocaleString()}kg → ${sName} to ${tName}`;
        }
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.6);
        if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
      })
      .transition()
      .duration(800)
      .delay((_: SLink, i: number) => i * 60)
      .attr('opacity', 0.6);

    // Nodes
    const nodeGroup = g.append('g')
      .selectAll('g')
      .data(graph.nodes)
      .join('g');

    nodeGroup.append('rect')
      .attr('x', (d: SNode) => d.x0 ?? 0)
      .attr('y', (d: SNode) => d.y0 ?? 0)
      .attr('height', (d: SNode) => Math.max(1, (d.y1 ?? 0) - (d.y0 ?? 0)))
      .attr('width', (d: SNode) => (d.x1 ?? 0) - (d.x0 ?? 0))
      .attr('fill', (d: SNode, i: number) => nodeColor(d.id ?? '', i))
      .attr('rx', 3)
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .delay((_: SNode, i: number) => i * 80)
      .attr('opacity', 1);

    // Labels
    nodeGroup.append('text')
      .attr('x', (d: SNode) => ((d.x0 ?? 0) < width / 2) ? (d.x1 ?? 0) + 8 : (d.x0 ?? 0) - 8)
      .attr('y', (d: SNode) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: SNode) => ((d.x0 ?? 0) < width / 2) ? 'start' : 'end')
      .attr('font-size', '11px')
      .attr('fill', '#374151')
      .attr('font-weight', (d: SNode) => isLossNode(d.id ?? '') ? '600' : '500')
      .text((d: SNode) => `${d.name}\n${(d.value ?? 0).toLocaleString()} kg`)
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .delay((_: SNode, i: number) => i * 80 + 200)
      .attr('opacity', 1);

  }, [data, dimensions]);

  if (!data.nodes.length || !data.links.length) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Material Flow</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6" ref={containerRef}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Material Flow — Sankey Diagram</h3>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Processing
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Loss
          </span>
        </div>
      </div>
      <div className="relative">
        <svg ref={svgRef} className="w-full" />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity whitespace-nowrap"
        />
      </div>
    </div>
  );
}

export default SankeyDiagram;
