import type { ParsedIntent } from '../types';

export function parseStructuredJSON(content: string): ParsedIntent | null {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim()) as ParsedIntent;
    }

    // Try direct JSON parse
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && 'intent' in parsed) {
      return parsed as ParsedIntent;
    }

    return null;
  } catch {
    return null;
  }
}
