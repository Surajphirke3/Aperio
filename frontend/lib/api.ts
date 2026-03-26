export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Get auth token from localStorage or cookies
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) return token;
    const sessionToken = sessionStorage.getItem("auth_token");
    if (sessionToken) return sessionToken;
  }
  return null;
}

// Store auth token
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
    sessionStorage.setItem("auth_token", token);
  }
}

// Clear auth token
export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }
}

// Generate or retrieve session ID for chat
export function getSessionId(): string {
  if (typeof window !== "undefined") {
    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
  }
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Clear session ID (for new chat)
export function clearSessionId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("chat_session_id");
  }
}

export interface APIError extends Error {
  status?: number;
  data?: unknown;
}

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: APIError = new Error(`API error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      
      try {
        error.data = await response.json();
      } catch {
        error.data = await response.text();
      }
      
      if (response.status === 401) {
        clearAuthToken();
        error.message = "Authentication required. Please sign in again.";
      }
      
      throw error;
    }
    
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
}

// Chat-specific API functions
export async function sendChatMessage(message: string, sessionId?: string) {
  const body = {
    message,
    session_id: sessionId || getSessionId(),
  };
  
  return fetchFromAPI("/chat/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getChatHistory(sessionId?: string) {
  const sid = sessionId || getSessionId();
  return fetchFromAPI(`/chat/sessions/${sid}/history`);
}

export async function clearChatSession(sessionId?: string) {
  const sid = sessionId || getSessionId();
  const result = await fetchFromAPI(`/chat/sessions/${sid}`, {
    method: "DELETE",
  });
  clearSessionId();
  return result;
}

export async function listChatSessions() {
  return fetchFromAPI("/chat/sessions");
}

// Type definitions needed by hooks.ts
export interface ApiDashboardStats {
  total_entries: number;
  by_material: Record<string, number>;
  by_stage: Record<string, number>;
}

export interface ApiSankeyData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

export interface ApiBatch {
  id?: string;
  batch_id?: string;
  material?: string;
  vendor?: string;
  stage?: string;
  intent?: string;
  quantity_kg?: number;
  loss_kg?: number;
  status?: string;
  completeness?: number;
  date?: string;
  created_at?: string;
}

export interface ApiVendor {
  name: string;
  total_kg: number;
  entry_count: number;
}

export interface ApiChatRequest {
  message: string;
  session_id?: string;
}

export interface ApiChatResponse {
  session_id: string;
  reply: string;
  intent: string;
  structured_data: Record<string, unknown> | null;
  success: boolean;
}

// API namespace objects
export const statsApi = {
  getDashboard: (): Promise<ApiDashboardStats> => fetchFromAPI("/stats/"),
  getSankey: (): Promise<ApiSankeyData> => fetchFromAPI("/stats/sankey"),
};

export const batchesApi = {
  getAll: (limit = 50): Promise<ApiBatch[]> =>
    fetchFromAPI(`/batches/?limit=${limit}`).then((r) => r.batches || []),
};

export const vendorsApi = {
  getAll: (): Promise<ApiVendor[]> =>
    fetchFromAPI("/vendors/").then((r) => r.vendors || []),
};

export const chatApi = {
  send: (req: ApiChatRequest): Promise<ApiChatResponse> =>
    fetchFromAPI("/chat/", {
      method: "POST",
      body: JSON.stringify(req),
    }),
  getHistory: (sessionId: string) =>
    fetchFromAPI(`/chat/sessions/${sessionId}/history`),
  clearSession: (sessionId: string) =>
    fetchFromAPI(`/chat/sessions/${sessionId}`, { method: "DELETE" }),
  listSessions: () => fetchFromAPI("/chat/sessions"),
};
