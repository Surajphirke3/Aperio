'use client';

import { useEffect, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={cn('relative z-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 max-w-lg w-full mx-4', className)}>
        {children}
      </div>
    </div>
  );
}