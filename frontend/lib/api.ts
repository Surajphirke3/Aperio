export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}
