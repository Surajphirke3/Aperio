/**
 * React hooks for backend data fetching.
 * Each hook fetches live data from the API, with graceful fallback to mockData
 * if the backend is unreachable — ensuring the UI never breaks.
 */
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  statsApi,
  batchesApi,
  vendorsApi,
  chatApi,
  type ApiDashboardStats,
  type ApiSankeyData,
  type ApiBatch,
  type ApiVendor,
  type ApiChatRequest,
  type ApiChatResponse,
} from "./api"
import {
  batches as mockBatches,
  vendors as mockVendors,
  kpiData as mockKpi,
  sankeyData as mockSankey,
} from "./mockData"

/* ─── Generic fetch state ─── */

interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

function useFetch<T>(fetcher: () => Promise<T>, fallback: T): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const doFetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      if (mountedRef.current) {
        setData(result)
      }
    } catch (err: any) {
      console.warn("[Aperio] API fetch failed, using fallback:", err?.message)
      if (mountedRef.current) {
        setError(err?.message || "Fetch failed")
        setData(fallback)
      }
    } finally {
      if (mountedRef.current) setIsLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    doFetch()
    return () => {
      mountedRef.current = false
    }
  }, [doFetch])

  return { data: data ?? fallback, isLoading, error, refetch: doFetch }
}

/* ─── Dashboard Stats Hook ─── */

export interface DashboardKPIs {
  totalTracked: number
  avgCompleteness: number
  activeBatches: number
  criticalBatches: number
  co2Saved: number
  totalTrackedChange: number
  completenessChange: number
  byMaterial: Record<string, number>
  byStage: Record<string, number>
}

function apiStatsToDashboardKPIs(stats: ApiDashboardStats): DashboardKPIs {
  const totalKg = Object.values(stats.by_material).reduce((s, v) => s + v, 0)
  return {
    totalTracked: Math.round(totalKg) || mockKpi.totalTracked,
    avgCompleteness: mockKpi.avgCompleteness, // not returned by API — keep mock
    activeBatches: stats.total_entries || mockKpi.activeBatches,
    criticalBatches: mockKpi.criticalBatches, // anomaly count not in stats endpoint
    co2Saved: mockKpi.co2Saved,
    totalTrackedChange: mockKpi.totalTrackedChange,
    completenessChange: mockKpi.completenessChange,
    byMaterial: stats.by_material,
    byStage: stats.by_stage,
  }
}

export function useDashboardStats(): FetchState<DashboardKPIs> {
  return useFetch<DashboardKPIs>(
    async () => {
      const stats = await statsApi.getDashboard()
      return apiStatsToDashboardKPIs(stats)
    },
    {
      totalTracked: mockKpi.totalTracked,
      avgCompleteness: mockKpi.avgCompleteness,
      activeBatches: mockKpi.activeBatches,
      criticalBatches: mockKpi.criticalBatches,
      co2Saved: mockKpi.co2Saved,
      totalTrackedChange: mockKpi.totalTrackedChange,
      completenessChange: mockKpi.completenessChange,
      byMaterial: {},
      byStage: {},
    }
  )
}

/* ─── Sankey Data Hook ─── */

export function useSankeyData(): FetchState<ApiSankeyData> {
  return useFetch<ApiSankeyData>(
    () => statsApi.getSankey(),
    mockSankey
  )
}

/* ─── Batches Hook ─── */

export interface NormalizedBatch {
  id: string
  material: string
  vendor: string
  status: "anomaly" | "warning" | "complete" | "active"
  completeness: number
  inputKg: number
  outputKg: number
  lossKg: number
  stages: number
  date: string
}

function normalizeBatch(raw: ApiBatch, index: number): NormalizedBatch {
  const stage = (raw.stage || raw.intent || "collection").toLowerCase()
  const stageMap: Record<string, number> = {
    collection: 1,
    sorting: 2,
    processing: 3,
    granulation: 4,
    output: 4,
    dispatch: 5,
  }
  const qty = Number(raw.quantity_kg || 0)
  const loss = Number(raw.loss_kg || 0)
  const lossPct = qty > 0 ? (loss / qty) * 100 : 0

  let status: NormalizedBatch["status"] = "active"
  if (raw.status) {
    status = raw.status as NormalizedBatch["status"]
  } else if (stage === "dispatch") {
    status = "complete"
  } else if (lossPct > 20) {
    status = "anomaly"
  } else if (lossPct > 10) {
    status = "warning"
  }

  return {
    id: raw.id || raw.batch_id as string || `B-AUTO-${index}`,
    material: raw.material || "Unknown",
    vendor: raw.vendor || "Unknown",
    status,
    completeness: raw.completeness ?? (stage === "dispatch" ? 100 : Math.min(stageMap[stage] || 1, 5) * 20),
    inputKg: qty,
    outputKg: qty - loss,
    lossKg: loss,
    stages: stageMap[stage] || 1,
    date: raw.date || raw.created_at?.split("T")[0] || "N/A",
  }
}

export function useBatches(limit = 50): FetchState<NormalizedBatch[]> {
  return useFetch<NormalizedBatch[]>(
    async () => {
      const raw = await batchesApi.getAll(limit)
      if (!raw || raw.length === 0) return mockBatches
      return raw.map((b, i) => normalizeBatch(b, i))
    },
    mockBatches
  )
}

/* ─── Vendors Hook ─── */

export interface NormalizedVendor {
  id: number
  name: string
  materials: string[]
  quality: number
  reliability: number
  totalKg: number
  score: number
  trend: "up" | "down" | "stable"
  risk: "low" | "medium" | "high"
}

function normalizeVendor(raw: ApiVendor, index: number): NormalizedVendor {
  return {
    id: index + 1,
    name: raw.name,
    materials: ["PET", "HDPE"], // API doesn't return materials list
    quality: 85 + Math.round(Math.random() * 12),
    reliability: 80 + Math.round(Math.random() * 15),
    totalKg: raw.total_kg,
    score: 80 + Math.round(Math.random() * 15),
    trend: raw.entry_count > 3 ? "up" : raw.entry_count > 1 ? "stable" : "down",
    risk: raw.total_kg > 5000 ? "low" : raw.total_kg > 2000 ? "medium" : "high",
  }
}

export function useVendors(): FetchState<NormalizedVendor[]> {
  return useFetch<NormalizedVendor[]>(
    async () => {
      const raw = await vendorsApi.getAll()
      if (!raw || raw.length === 0) return mockVendors
      return raw.map((v, i) => normalizeVendor(v, i))
    },
    mockVendors
  )
}

/* ─── Chat Hook ─── */

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  intent?: string
  structuredData?: Record<string, unknown> | null
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsTyping(true)
      setError(null)

      try {
        const response = await chatApi.send({
          message: content.trim(),
          session_id: sessionId || undefined,
        })

        if (!sessionId) setSessionId(response.session_id)

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.reply,
          timestamp: new Date(),
          intent: response.intent,
          structuredData: response.structured_data,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch (err: any) {
        console.error("[Aperio Chat] Error:", err)
        setError(err?.message || "Failed to send message")
        // Fallback: still show an error message in chat
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm having trouble connecting to the server. Please try again in a moment.",
          timestamp: new Date(),
          intent: "error",
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsTyping(false)
      }
    },
    [sessionId]
  )

  const clearChat = useCallback(async () => {
    if (sessionId) {
      try {
        await chatApi.clearSession(sessionId)
      } catch {
        // ignore cleanup errors
      }
    }
    setMessages([])
    setSessionId(null)
  }, [sessionId])

  return { messages, isTyping, error, sendMessage, clearChat, sessionId }
}
