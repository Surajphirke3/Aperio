// Features call services, services call infrastructure.
// Features NEVER import from infrastructure directly.

import { ChatResponse } from '../types';

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.statusText}`);
  }

  return response.json() as Promise<ChatResponse>;
}
