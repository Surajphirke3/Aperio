import { IntentType, ParsedEntry } from '@/shared/types';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  intent?: IntentType;
  structuredData?: ParsedEntry | Record<string, unknown> | null;
  isError?: boolean;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messageCount: number;
  lastMessage?: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  intent: IntentType;
  structured_data?: ParsedEntry | Record<string, unknown> | null;
  success: boolean;
}

export interface ChatHistoryMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
  intent?: IntentType | null;
}

export interface SessionHistoryResponse {
  session_id: string;
  messages: ChatHistoryMessage[];
  count: number;
}
