/**
 * Aperio API Client
 * Centralized HTTP client for all backend endpoints.
 * Uses Clerk session tokens for authentication.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/* ─── Types ─── */

export interface ApiBatch {
  id: string
  material?: string
  vendor?: string
  quantity_kg?: number
  loss_kg?: number
  stage?: string
  intent?: string
  status?: string
  completeness?: number
  created_at?: string
  date?: string
  anomalies?: ApiAnomaly[]
  [key: string]: unknown
}

export interface ApiAnomaly {
  batch_id: string
  stage: string
  metric: string
  value: number
  threshold: number
  message: string
}

export interface ApiDashboardStats {
  total_entries: number
  by_material: Record<string, number>
  by_stage: Record<string, number>
  total_dispatched_kg: number
}

export interface ApiSankeyData {
  nodes: { name: string }[]
  links: { source: number; target: number; value: number }[]
}

export interface ApiVendor {
  id: string
  name: string
  total_kg: number
  entry_count: number
}

export interface ApiChatRequest {
  message: string
  session_id?: string
}

export interface ApiChatResponse {
  session_id: string
  reply: string
  intent: string
  structured_data?: Record<string, unknown> | null
  success: boolean
}

export interface ApiInsight {
  batch_id: string
  narrative: string
  [key: string]: unknown
}

/* ─── HTTP helper ─── */

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  try {
    const clerk = (window as any).Clerk
    if (clerk?.session) {
      return await clerk.session.getToken()
    }
  } catch (err) {
    console.warn("Clerk Token Generation Failed:", err)
  }
  return null
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = `${API_BASE}/v1${path}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error")
    throw new ApiError(
      `API Error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  return response.json()
}

/* ─── Batches API ─── */

export const batchesApi = {
  getAll: (limit = 50) =>
    apiFetch<ApiBatch[]>(`/batches/?limit=${limit}`),

  getById: (batchId: string) =>
    apiFetch<ApiBatch & { anomalies: ApiAnomaly[] }>(`/batches/${batchId}`),
}

/* ─── Stats / Dashboard API ─── */

export const statsApi = {
  getDashboard: () =>
    apiFetch<ApiDashboardStats>("/stats/"),

  getSankey: () =>
    apiFetch<ApiSankeyData>("/stats/sankey"),
}

/* ─── Vendors API ─── */

export const vendorsApi = {
  getAll: () =>
    apiFetch<ApiVendor[]>("/vendors/"),
}

/* ─── Chat API ─── */

export const chatApi = {
  send: (data: ApiChatRequest) =>
    apiFetch<ApiChatResponse>("/chat/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getHistory: (sessionId: string) =>
    apiFetch<{ session_id: string; messages: unknown[]; count: number }>(
      `/chat/sessions/${sessionId}/history`
    ),

  clearSession: (sessionId: string) =>
    apiFetch<{ message: string }>(`/chat/sessions/${sessionId}`, {
      method: "DELETE",
    }),
}

/* ─── Insights API ─── */

export const insightsApi = {
  generate: (batchId: string) =>
    apiFetch<ApiInsight>(`/insights/${batchId}`, {
      method: "POST",
    }),
}

/* ─── Health Check ─── */

export const healthApi = {
  check: async (): Promise<{ status: string; model: string }> => {
    const res = await fetch(`${API_BASE}/health`)
    if (!res.ok) throw new ApiError("Health check failed", res.status)
    return res.json()
  },
}
