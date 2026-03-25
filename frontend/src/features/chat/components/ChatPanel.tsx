'use client';

import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';

export function ChatPanel() {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
