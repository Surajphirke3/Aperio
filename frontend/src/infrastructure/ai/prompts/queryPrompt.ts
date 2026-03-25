import type { AIClient } from '../provider';

const QUERY_SYSTEM_PROMPT = `You are a natural language to filter converter for a plastic recycling platform.
Convert the user's question into a JSON filter object with optional fields:
- materialType: PET, HDPE, PP, LDPE, PVC, mixed
- stage: collection, sorting, processing, output, dispatch
- vendor: string
- startDate: ISO date
- endDate: ISO date
- aggregation: total, average, count
Return ONLY valid JSON.`;

export async function buildQueryFilters(
  ai: AIClient,
  message: string,
): Promise<Record<string, unknown>> {
  const raw = await ai.complete(message, QUERY_SYSTEM_PROMPT);
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
