const SCENARIO_BASE = "/data/problem_statement_3"

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

function parseCSV(content: string): string[][] {
  const lines = content.trim().split("\n")
  return lines.map((line) => line.split(",").map((cell) => cell.trim()))
}

async function loadCSV(scenario: number, filename: string): Promise<string[][]> {
  try {
    const res = await fetch(`${SCENARIO_BASE}/Scenario ${scenario}/${filename}`)
    if (!res.ok) return []
    const text = await res.text()
    return parseCSV(text)
  } catch {
    return []
  }
}

export async function getRealSankeyData() {
  const nodes: string[] = []
  const linksMap: Map<string, number> = new Map()

  for (let scn = 1; scn <= 6; scn++) {
    const trans = await loadCSV(scen, "transaction_events.csv")
    const transform = await loadCSV(scen, "inventory_transforms.csv")

    transform.slice(1).forEach((row) => {
      const mode = row[4]
      if (!mode || mode === "NULL") return

      let sourceStage = "Input"
      let targetStage = mode

      if (mode === "INWARD" || mode === "SEGREGATION") sourceStage = "Collection"
      else if (mode === "BALING") sourceStage = "Baling"
      else if (mode === "WASHING") sourceStage = "Washing"
      else if (mode === "QC_PASS" || mode === "QC_FAIL") sourceStage = "QC"
      else if (mode === "RECYCLING") sourceStage = "Granulation"
      else if (mode === "PRODUCTION") sourceStage = "Production"
      else if (mode === "TRANSFER") sourceStage = "Dispatch"
      else if (mode === "RECEIPT") sourceStage = "Transfer-Recv"
      else if (mode === "MIXING") sourceStage = "Production"

      if (mode === "INWARD") targetStage = "Collection"
      else if (mode === "SEGREGATION") targetStage = "Sorting"
      else if (mode === "BALING") targetStage = "Baling"
      else if (mode === "WASHING") targetStage = "Washing"
      else if (mode === "QC_PASS" || mode === "QC_FAIL") targetStage = "QC"
      else if (mode === "RECYCLING") targetStage = "Granulation"
      else if (mode === "PRODUCTION") targetStage = "Production"
      else if (mode === "TRANSFER") targetStage = "Dispatch"

      if (!nodes.includes(sourceStage)) nodes.push(sourceStage)
      if (!nodes.includes(targetStage)) nodes.push(targetStage)

      const qty = parseFloat(row[5]) || 0
      const key = `${sourceStage}->${targetStage}`
      linksMap.set(key, (linksMap.get(key) || 0) + qty)
    })
  }

  // Deduplicate
  const uniqueNodes = [...new Set(nodes)]
  const sankeyNodes = uniqueNodes.map((name) => ({ name }))
  const sankeyLinks: { source: number; target: number; value: number }[] = []

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

export async function getRealChatHistory() {
  const history: { id: string; preview: string; time: string; entries: number; queries: number }[] = []

  for (let scn = 1; scn <= 6; scn++) {
    const trans = await loadCSV(scen, "transaction_events.csv")
    const transactions = trans.slice(1).filter((r) => r[6] === "APPROVED")

    if (transactions.length === 0) continue

    const firstTx = transactions[0]
    const qty = parseFloat(firstTx[7] || "0")
    const processCode = firstTx[2]
    const stage = stageNames[processCode] || processCode

    let preview = ""
    if (processCode === "PR" || processCode === "WT") {
      preview = `Received ${qty} kg at ${stage}`
    } else if (processCode === "WTR") {
      preview = `Transferred ${qty} kg to next stage`
    } else {
      preview = `${stage} processing: ${qty} kg`
    }

    history.push({
      id: `scn-${scn}`,
      preview: preview.slice(0, 35),
      time: `${scn} day${scn > 1 ? "s" : ""} ago`,
      entries: transactions.filter((t) => t[2] === "PR" || t[2] === "WT").length,
      queries: 0,
    })
  }

  return history
}

export async function getRealDashboardStats() {
  let totalKg = 0
  const stages: Record<string, number> = {}
  const batchSet = new Set<string>()

  for (let scn = 1; scn <= 6; scn++) {
    const trans = await loadCSV(scen, "transaction_events.csv")

    trans.slice(1).forEach((row) => {
      const status = row[6]
      if (status !== "APPROVED") return

      const qty = parseFloat(row[7] || "0")
      const processCode = row[2]
      const batchId = row[8]?.split(":")[0] || "Unknown"

      totalKg += qty
      const stage = stageNames[processCode] || processCode
      stages[stage] = (stages[stage] || 0) + qty
      batchSet.add(batchId)
    })
  }

  return { totalKg: Math.round(totalKg), batches: batchSet.size, stages }
}