'use client';

import { LogOut, User } from 'lucide-react';
import { useAuthContext } from '@/core/providers/AuthProvider';

export function Header() {
  const { user, signOut } = useAuthContext();

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div />
      <div className="flex items-center gap-3">
        {user && (
          <>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {user.email}
            </span>
            <button onClick={signOut} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
              <LogOut size={14} />
            </button>
          </>
        )}
        {!user && (
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <User size={14} />
            <span className="text-xs font-mono">Not signed in</span>
          </div>
        )}
      </div>
    </header>
  );
}