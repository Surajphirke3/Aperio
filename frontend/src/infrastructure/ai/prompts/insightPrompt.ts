import type { AIClient } from '../provider';

const INSIGHT_SYSTEM_PROMPT = `You are an analytics assistant for a plastic recycling platform.
Given batch data, provide a concise narrative summary with actionable insights.
Return JSON: { "summary": "...", "recommendations": ["..."] }`;

export async function generateInsight(
  ai: AIClient,
  batchData: string,
): Promise<{ summary: string; recommendations: string[] }> {
  const raw = await ai.complete(batchData, INSIGHT_SYSTEM_PROMPT);
  try {
    return JSON.parse(raw);
  } catch {
    return { summary: raw, recommendations: [] };
  }
}
