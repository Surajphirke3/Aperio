import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useChatStore } from '../store/chatStore';
import { chatService } from '../services/chatService';
import type { ChatMessage } from '../types';

export function useChat() {
  const store = useChatStore();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || store.isLoading) return;

    const sessionId = store.activeSessionId ?? uuid();

    const userMessage: ChatMessage = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    store.addMessage(userMessage);
    store.setLoading(true);
    store.setError(null);

    store.addMessage({
      id: uuid(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    });

    try {
      const response = await chatService.send({
        message: content,
        session_id: sessionId,
      });

      store.updateLastMessage(response.reply);

      if (!store.activeSessionId) {
        store.setActiveSession(response.session_id);
        store.addSession({
          id: response.session_id,
          title: content.slice(0, 50),
          createdAt: new Date(),
          messageCount: 1,
          lastMessage: content,
        });
      }
    } catch (err) {
      store.updateLastMessage('Something went wrong. Please try again.');
      store.setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  return {
    messages: store.messages,
    sessions: store.sessions,
    activeSessionId: store.activeSessionId,
    isLoading: store.isLoading,
    error: store.error,
    sendMessage,
    setActiveSession: store.setActiveSession,
  };
}