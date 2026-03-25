'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { useSessions } from '../hooks/useSessions';
import { useChatStore } from '../store/chatStore';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SessionSidebar } from './SessionSidebar';
import { TypingIndicator } from './TypingIndicator';

export function ChatPanel() {
  const { messages, isLoading, sendMessage, activeSessionId, error } = useChat();
  const { sessions, switchSession, deleteSession } = useSessions();
  const { clearMessages, setActiveSession, setError } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    clearMessages();
    setActiveSession(null);
    setError(null);
  };

  return (
    <div className="flex h-full bg-[var(--bg-primary)]">
      <SessionSidebar
        sessions={sessions}
        onSelect={(sessionId) => void switchSession(sessionId)}
        onNewChat={handleNewChat}
        onDelete={(sessionId) => void deleteSession(sessionId)}
        activeSessionId={activeSessionId}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)]">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          <span className="font-mono text-sm text-[var(--text-secondary)]">aperio / chat</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <div className="rounded-xl border border-[var(--status-danger)]/40 bg-[var(--status-danger)]/10 px-4 py-3 text-sm font-mono text-[var(--status-danger)]">
              {error}
            </div>
          )}
          {messages.length === 0 && <EmptyChat onSuggestion={sendMessage} />}
          <MessageList messages={messages} />
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[var(--border)] p-4">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}

function EmptyChat({ onSuggestion }: { onSuggestion: (msg: string) => void }) {
  const suggestions = [
    'Purchased 300kg of PET bottles from Vendor A yesterday',
    'How much material was dispatched last week?',
    'Show losses during processing this month',
    'Log 150kg HDPE processed today',
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 py-12">
      <div className="text-center">
        <h2 className="font-display text-3xl text-[var(--text-primary)] mb-2">What happened today?</h2>
        <p className="text-[var(--text-muted)] font-mono text-sm">Log materials or query your data in plain English</p>
      </div>
      <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="text-left px-4 py-3 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] text-sm font-mono hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
