import { NextResponse } from "next/server"

const SCENARIO_PATH = "D:/Aperio/problem_statement_3"

const stageNames: Record<string, string> = {
  PR: "Collection",
  SEG: "Sorting",
  MB: "Baling",
  WT: "Transfer",
  WTR: "Transfer-Recv",
  QC: "QC-Check",
  RECY: "Granulation",
  PROD: "Production",
}

const stageMapping: Record<string, string> = {
  INWARD: "Collection",
  SEGREGATION: "Sorting",
  BALING: "Baling",
  WASHING: "Washing",
  QC_PASS: "QC",
  QC_FAIL: "QC",
  RECYCLING: "Granulation",
  PRODUCTION: "Production",
  TRANSFER: "Dispatch",
  RECEIPT: "Transfer-Recv",
  MIXING: "Production",
}

interface SankeyNode {
  name: string
}

interface SankeyLink {
  source: number
  target: number
  value: number
}

interface RealSankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

function getStageFromRemarks(remarks: string | null): string {
  if (!remarks) return "Unknown"
  const parts = remarks.split(":")
  return parts.length > 1 ? parts[1] : parts[0]
}

function getBatchFromRemarks(remarks: string | null): string {
  if (!remarks) return "Unknown"
  const parts = remarks.split(":")
  return parts.length > 0 ? parts[0] : "Unknown"
}

function parseCSV(content: string): string[][] {
  const lines = content.trim().split("\n")
  return lines.map((line) => line.split(",").map((cell) => cell.trim()))
}

export function getRealSankeyData(): RealSankeyData {
  const fs = require("fs")
  const path = require("path")

  const nodes: string[] = []
  const linksMap: Map<string, number> = new Map()

  for (let scn = 1; scn <= 6; scn++) {
    const transPath = path.join(SCENARIO_PATH, `Scenario ${scn}`, "transaction_events.csv")
    const transformPath = path.join(SCENARIO_PATH, `Scenario ${scn}`, "inventory_transforms.csv")

    if (!fs.existsSync(transPath) || !fs.existsSync(transformPath)) continue

    const transData = parseCSV(fs.readFileSync(transPath, "utf8"))
    const transformData = parseCSV(fs.readFileSync(transformPath, "utf8"))

    transData.slice(1).forEach((row: string[]) => {
      const [, , processCode, series, , warehouse, status, qty, remarks] = row
      if (status !== "APPROVED") return

      const batchId = getBatchFromRemarks(remarks)
      const stage = stageNames[processCode] || processCode

      if (!nodes.includes(stage)) nodes.push(stage)
    })

    transformData.slice(1).forEach((row: string[]) => {
      const [,,, destInv, mode, qty] = row
      const sourceStage = row[2] ? "Input" : "Collection"
      const targetStage = stageMapping[mode] || mode

      if (!nodes.includes(sourceStage)) nodes.push(sourceStage)
      if (!nodes.includes(targetStage)) nodes.push(targetStage)
    })
  }

  for (let scn = 1; scn <= 6; scn++) {
    const transformPath = path.join(SCENARIO_PATH, `Scenario ${scn}`, "inventory_transforms.csv")
    if (!fs.existsSync(transformPath)) continue

    const transformData = parseCSV(fs.readFileSync(transformPath, "utf8"))
    transformData.slice(1).forEach((row: string[]) => {
      const [,,, destInv, mode, qty] = row
      if (mode === "NULL" || !mode) return

      const sourceStage = "Input"
      const targetStage = stageMapping[mode] || mode

      const linkKey = `${sourceStage}->${targetStage}`
      const current = linksMap.get(linkKey) || 0
      linksMap.set(linkKey, current + (parseFloat(qty) || 0))
    })
  }

  const sankeyNodes = nodes.map((name) => ({ name }))
  const sankeyLinks: SankeyLink[] = []

  linksMap.forEach((value, key) => {
    const [source, target] = key.split("->")
    const sourceIdx = sankeyNodes.findIndex((n) => n.name === source)
    const targetIdx = sankeyNodes.findIndex((n) => n.name === target)
    if (sourceIdx >= 0 && targetIdx >= 0 && value > 0) {
      sankeyLinks.push({ source: sourceIdx, target: targetIdx, value })
    }
  })

  return { nodes: sankeyNodes, links: sankeyLinks }
}

export function getChatHistoryData(): { id: string; preview: string; time: string; entries: number; queries: number }[] {
  const fs = require("fs")
  const path = require("path")

  const history: { id: string; preview: string; time: string; entries: number; queries: number }[] = []

  for (let scn = 1; scn <= 6; scn++) {
    const transPath = path.join(SCENARIO_PATH, `Scenario ${scn}`, "transaction_events.csv")
    if (!fs.existsSync(transPath)) continue

    const transData = parseCSV(fs.readFileSync(transPath, "utf8"))
    const transactions = transData.slice(1).filter((r: string[]) => r[6] === "APPROVED")

    if (transactions.length === 0) continue

    const firstTx = transactions[0]
    const qty = parseFloat(firstTx[7] || "0")
    const stage = stageNames[firstTx[2] as string] || firstTx[2]

    let preview = ""
    if (firstTx[2] === "PR" || firstTx[2] === "WT") {
      preview = `Received ${qty} kg at ${stage}...`
    } else if (firstTx[2] === "WTR") {
      preview = `Transferred ${qty} kg...`
    } else {
      preview = `${stage} processing: ${qty} kg...`
    }

    history.push({
      id: `scn-${scn}`,
      preview: preview.slice(0, 30) + "...",
      time: `${scn} day${scn > 1 ? "s" : ""} ago`,
      entries: transactions.filter((t: string[]) => t[2] === "PR" || t[2] === "WT").length,
      queries: 0,
    })
  }

  return history
}

export function getRealDashboardStats(): { totalKg: number; batches: number; stages: Record<string, number> } {
  const fs = require("fs")
  const path = require("path")

  let totalKg = 0
  const stages: Record<string, number> = {}
  let batchCount = 0

  for (let scn = 1; scn <= 6; scn++) {
    const transPath = path.join(SCENARIO_PATH, `Scenario ${scn}`, "transaction_events.csv")
    if (!fs.existsSync(transPath)) continue

    const transData = parseCSV(fs.readFileSync(transPath, "utf8"))
    const uniqueBatches = new Set<string>()

    transData.slice(1).forEach((row: string[]) => {
      const qty = parseFloat(row[7] || "0")
      const status = row[6]
      const remarks = row[8]
      const processCode = row[2]

      if (status !== "APPROVED") return

      totalKg += qty
      const stage = stageNames[processCode] || processCode
      stages[stage] = (stages[stage] || 0) + qty

      const batchId = getBatchFromRemarks(remarks)
      if (batchId !== "Unknown") uniqueBatches.add(batchId)
    })

    batchCount += uniqueBatches
  }

  return { totalKg, batches: batchCount, stages }
}