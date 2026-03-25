import { create } from 'zustand';
import { ChatMessage, ChatSession } from '../types';

interface ChatStore {
  messages: ChatMessage[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveSession: (sessionId: string) => void;
  clearMessages: () => void;
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last?.role === 'assistant') {
        messages[messages.length - 1] = { ...last, content, isStreaming: false };
      }
      return { messages };
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActiveSession: (activeSessionId) => set({ activeSessionId, messages: [] }),
  clearMessages: () => set({ messages: [] }),
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
}));