import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ChatMessage, ChatSession } from '../types';

interface ChatStore {
  messages: ChatMessage[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (message: Partial<ChatMessage> & { content: string }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveSession: (sessionId: string | null) => void;
  clearMessages: () => void;
  setMessages: (messages: ChatMessage[]) => void;
  setSessions: (sessions: ChatSession[]) => void;
  upsertSession: (session: ChatSession) => void;
  removeSession: (sessionId: string) => void;
}

const initialState = {
  messages: [] as ChatMessage[],
  sessions: [] as ChatSession[],
  activeSessionId: null as string | null,
  isLoading: false,
  error: null as string | null,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      ...initialState,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      updateLastMessage: (message) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last?.role === 'assistant') {
            messages[messages.length - 1] = {
              ...last,
              ...message,
              isStreaming: false,
            };
          }
          return { messages };
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setActiveSession: (activeSessionId) => set({ activeSessionId }),
      clearMessages: () => set({ messages: [] }),
      setMessages: (messages) => set({ messages }),
      setSessions: (sessions) => set({ sessions }),
      upsertSession: (session) =>
        set((state) => {
          const sessions = state.sessions.filter((item) => item.id !== session.id);
          return { sessions: [session, ...sessions] };
        }),
      removeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== sessionId),
          activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
          messages: state.activeSessionId === sessionId ? [] : state.messages,
        })),
    }),
    {
      name: 'aperio-chat-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<ChatStore>;
        return {
          ...current,
          ...stored,
          messages: (stored.messages ?? []).map((message) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          })),
          sessions: (stored.sessions ?? []).map((session) => ({
            ...session,
            createdAt: new Date(session.createdAt),
          })),
        };
      },
    },
  ),
);
