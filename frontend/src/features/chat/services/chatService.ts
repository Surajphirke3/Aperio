import { api } from '@/shared/utils/api';
import { ChatResponse } from '../types';

interface SendMessagePayload {
  message: string;
  session_id?: string;
}

export const chatService = {
  send: async (payload: SendMessagePayload): Promise<ChatResponse> => {
    return api.post<ChatResponse>('/v1/chat/', payload);
  },

  getHistory: async (sessionId: string) => {
    return api.get<{ messages: unknown[]; count: number }>(
      `/v1/chat/sessions/${sessionId}/history`
    );
  },

  clearSession: async (sessionId: string) => {
    return api.delete(`/v1/chat/sessions/${sessionId}`);
  },
};