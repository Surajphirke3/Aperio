import { useCallback, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useChatStore } from '../store/chatStore';
import { chatService } from '../services/chatService';

export function useSessions() {
  const {
    sessions,
    activeSessionId,
    setMessages,
    setActiveSession,
    clearMessages,
    removeSession,
  } = useChatStore();

  const loadSession = useCallback(async (sessionId: string) => {
    const history = await chatService.getHistory(sessionId);
    setMessages(history.messages.map((message) => ({
      id: uuid(),
      role: message.role,
      content: message.content,
      timestamp: new Date(message.timestamp),
      intent: message.intent ?? undefined,
    })));
  }, [setMessages]);

  const switchSession = useCallback(async (sessionId: string) => {
    setActiveSession(sessionId);
    await loadSession(sessionId);
  }, [loadSession, setActiveSession]);

  const deleteSession = async (sessionId: string) => {
    await chatService.clearSession(sessionId);
    removeSession(sessionId);
    clearMessages();
  };

  useEffect(() => {
    if (!activeSessionId) return;
    const session = sessions.find((item) => item.id === activeSessionId);
    if (!session) {
      setActiveSession(sessions[0]?.id ?? null);
      return;
    }
    void loadSession(activeSessionId);
  }, [activeSessionId, loadSession, sessions, setActiveSession]);

  return { sessions, switchSession, deleteSession };
}
