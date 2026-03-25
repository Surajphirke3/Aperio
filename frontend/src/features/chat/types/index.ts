// These types are ONLY for the chat feature UI layer.
// Shared/global types live in src/shared/types/

import type { ParsedIntent } from '@/shared/types';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  structuredData?: ParsedIntent | null;  // null if query response
  isError?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  structuredData?: ParsedIntent;
  action: 'stored' | 'queried' | 'error';
}

// Re-export from shared for convenience
export type { ParsedIntent } from '@/shared/types';
