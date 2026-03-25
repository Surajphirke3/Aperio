import { env } from '@/core/config/env';
import type { AIClient } from '../provider';

export const featherlessClient: AIClient = {
  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const response = await fetch(`${env.featherlessBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.featherlessApiKey}`,
      },
      body: JSON.stringify({
        model: env.featherlessModel,
        max_tokens: 512,
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Featherless API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
};
