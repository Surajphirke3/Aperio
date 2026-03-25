import { env } from '@/core/config/env';

export interface AIClient {
  complete(prompt: string, systemPrompt: string): Promise<string>;
}

interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  model: string;
}

async function callFeatherless(messages: ChatCompletionMessage[]): Promise<AIResponse> {
  const response = await fetch(`${env.featherlessBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.featherlessApiKey}`,
    },
    body: JSON.stringify({
      model: env.featherlessModel,
      messages,
      max_tokens: 1024,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Featherless API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    model: env.featherlessModel,
  };
}

async function callOllama(messages: ChatCompletionMessage[]): Promise<AIResponse> {
  const response = await fetch(`${env.ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.ollamaModel,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.message.content,
    model: env.ollamaModel,
  };
}

export async function getAIResponse(messages: ChatCompletionMessage[]): Promise<AIResponse> {
  try {
    return await callFeatherless(messages);
  } catch (error) {
    console.warn('Featherless failed, falling back to Ollama:', error);
    return await callOllama(messages);
  }
}
