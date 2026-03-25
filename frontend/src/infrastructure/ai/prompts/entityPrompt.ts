import type { AIClient } from '../provider';
import type { ParsedIntent } from '@/shared/types';

const ENTITY_SYSTEM_PROMPT = `You are an entity extractor for a plastic recycling platform.
Extract structured data from the user's message. Return a JSON object with these fields:
- intent: the action type
- material: PET, HDPE, PP, LDPE, PVC, or mixed
- quantity_kg: number
- vendor: string (optional)
- date: ISO 8601 date string
- stage: collection, sorting, processing, output, or dispatch (optional)
- loss_kg: number (optional)
- batch_id: string (optional)
- notes: string (optional)`;

export async function extractEntities(
  ai: AIClient,
  message: string,
  intentType: string,
): Promise<ParsedIntent> {
  const prompt = `Intent type: ${intentType}\nUser message: "${message}"`;
  const raw = await ai.complete(prompt, ENTITY_SYSTEM_PROMPT);
  try {
    return JSON.parse(raw) as ParsedIntent;
  } catch {
    throw new Error('Failed to parse entity extraction response');
  }
}
