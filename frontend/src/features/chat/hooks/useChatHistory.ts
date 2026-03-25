'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from '../types';

const STORAGE_KEY = 'aperio-chat-history';
const MAX_MESSAGES = 100;

export function useChatHistory() {
  const [history, setHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        setHistory(parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })));
      }
    } catch {
      // Silently fail on corrupt data
    }
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setHistory((prev) => {
      const updated = [...prev, message].slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addMessage, clearHistory };
}
