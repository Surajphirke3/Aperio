import { useChatStore } from '../store/chatStore';
import { chatService } from '../services/chatService';

export function useSessions() {
  const { sessions, setSessions, setActiveSession, clearMessages } = useChatStore();

  const switchSession = async (sessionId: string) => {
    setActiveSession(sessionId);
    clearMessages();
  };

  const deleteSession = async (sessionId: string) => {
    await chatService.clearSession(sessionId);
    setSessions(sessions.filter((s) => s.id !== sessionId));
  };

  return { sessions, switchSession, deleteSession };
}