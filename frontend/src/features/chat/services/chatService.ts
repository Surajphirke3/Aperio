import { api } from '@/shared/utils/api';
import type { ChatResponse, SessionHistoryResponse } from '../types';

interface SendMessagePayload {
  message: string;
  session_id?: string;
}

export const chatService = {
  send: async (payload: SendMessagePayload): Promise<ChatResponse> => {
    return api.post<ChatResponse>('/v1/chat/', payload);
  },

  getHistory: async (sessionId: string) => {
    return api.get<SessionHistoryResponse>(
      `/v1/chat/sessions/${sessionId}/history`
    );
  },

  clearSession: async (sessionId: string) => {
    return api.delete<{ message: string; session_id: string }>(`/v1/chat/sessions/${sessionId}`);
  },
};
