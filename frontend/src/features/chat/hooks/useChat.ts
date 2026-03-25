import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useChatStore } from '../store/chatStore';
import { chatService } from '../services/chatService';
import type { ChatMessage } from '../types';
import { APIError } from '@/shared/utils/api';

export function useChat() {
  const store = useChatStore();

  const sendMessage = useCallback(async (content: string) => {
    if (store.isLoading) return;
    if (!content.trim()) {
      store.setError('Please enter a message before sending.');
      return;
    }

    const sessionId = store.activeSessionId ?? uuid();
    const startedAt = new Date();

    const userMessage: ChatMessage = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: startedAt,
    };
    store.addMessage(userMessage);
    store.setLoading(true);
    store.setError(null);
    store.setActiveSession(sessionId);

    store.addMessage({
      id: uuid(),
      role: 'assistant',
      content: '',
      timestamp: startedAt,
      isStreaming: true,
    });

    try {
      const response = await chatService.send({
        message: content,
        session_id: sessionId,
      });

      store.updateLastMessage({
        content: response.reply,
        intent: response.intent,
        structuredData: response.structured_data ?? null,
      });
      store.setActiveSession(response.session_id);
      const existingSession = store.sessions.find((session) => session.id === response.session_id);
      store.upsertSession({
        id: response.session_id,
        title: existingSession?.title ?? content.slice(0, 50),
        createdAt: existingSession?.createdAt ?? startedAt,
        messageCount: (existingSession?.messageCount ?? 0) + 2,
        lastMessage: response.reply,
      });
    } catch (err) {
      const message = getChatErrorMessage(err);
      store.updateLastMessage({ content: message, isError: true });
      store.setError(message);
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

function getChatErrorMessage(error: unknown) {
  if (error instanceof APIError) {
    if (error.status === 422) return 'Please send a valid message.';
    return error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
