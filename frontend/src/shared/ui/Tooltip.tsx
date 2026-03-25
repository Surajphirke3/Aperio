'use client';

import { useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-mono bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border)] rounded whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
}