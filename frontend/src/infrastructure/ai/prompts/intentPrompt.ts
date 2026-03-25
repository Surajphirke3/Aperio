import type { AIClient } from '../provider';

const INTENT_SYSTEM_PROMPT = `You are an intent classifier for a plastic recycling platform.
Classify the user's message into one of these intents: purchase, processing, dispatch, query, report.
Respond with ONLY a JSON object: { "type": "<intent>" }`;

export async function parseIntent(
  ai: AIClient,
  message: string,
): Promise<{ type: string }> {
  const raw = await ai.complete(message, INTENT_SYSTEM_PROMPT);
  try {
    return JSON.parse(raw);
  } catch {
    return { type: 'query' };
  }
}
