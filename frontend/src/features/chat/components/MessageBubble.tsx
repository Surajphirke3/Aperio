'use client';

import { motion } from 'framer-motion';
import type { ChatMessage } from '../types';
import { IntentBadge } from './IntentBadge';
import { StructuredCard } from './StructuredCard';
import { cn } from '@/shared/utils/cn';

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent-primary)] text-xs font-mono shrink-0 mt-1">
          AI
        </div>
      )}

      <div className={cn('max-w-[70%] space-y-2 flex flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-[var(--chat-user-bg)] text-[var(--text-primary)] rounded-tr-sm'
              : 'bg-[var(--chat-assistant-bg)] text-[var(--text-secondary)] border border-[var(--border)] rounded-tl-sm',
            message.isStreaming && 'animate-pulse'
          )}
        >
          {message.content || (message.isStreaming ? '...' : '')}
        </div>

        {message.intent && <IntentBadge intent={message.intent} />}
        {message.structuredData && <StructuredCard data={message.structuredData as Record<string, unknown>} />}

        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}