'use client';

import type { ChatMessage } from '../types';
import { StructuredOutput } from './StructuredOutput';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : message.isError
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.structuredData && (
          <StructuredOutput data={message.structuredData} />
        )}
        <span className="text-xs opacity-60 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
