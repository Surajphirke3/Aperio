'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  data: Record<string, unknown>;
}

export function StructuredCard({ data }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden text-xs font-mono">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        Structured Data
      </button>
      {open && (
        <pre className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}