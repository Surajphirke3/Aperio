'use client';

import { MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { ChatSession } from '../types';
import { formatRelativeDate } from '@/shared/utils/dates';

interface Props {
  sessions: ChatSession[];
  onSelect: (sessionId: string) => void;
  activeSessionId?: string | null;
}

export function SessionSidebar({ sessions, onSelect, activeSessionId }: Props) {
  return (
    <div className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col">
      <div className="p-3 border-b border-[var(--border)]">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-mono text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] transition-colors">
          <Plus size={14} />
          New chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={cn(
              'flex items-start gap-2 w-full px-3 py-2 rounded-lg text-left transition-colors',
              activeSessionId === s.id
                ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'
            )}
          >
            <MessageSquare size={12} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-mono truncate">{s.title}</p>
              <p className="text-[10px] opacity-60">{formatRelativeDate(s.createdAt.toISOString())}</p>
            </div>
          </button>
        ))}
        {sessions.length === 0 && (
          <p className="text-[10px] font-mono text-[var(--text-muted)] text-center py-4">No sessions yet</p>
        )}
      </div>
    </div>
  );
}