import { env } from '@/core/config/env';
import type { AIClient } from '../provider';

export const ollamaClient: AIClient = {
  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const response = await fetch(`${env.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.ollamaModel,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  },
};
