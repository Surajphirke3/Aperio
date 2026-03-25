import type { ReactNode } from 'react';

interface Props { icon?: ReactNode; title: string; description?: string; action?: ReactNode; }

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      {icon && <div className="text-[var(--text-muted)]">{icon}</div>}
      <h3 className="text-lg font-mono text-[var(--text-primary)]">{title}</h3>
      {description && <p className="text-sm text-[var(--text-muted)] max-w-md">{description}</p>}
      {action}
    </div>
  );
}