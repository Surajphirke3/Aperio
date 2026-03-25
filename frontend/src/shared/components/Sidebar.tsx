'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, LayoutDashboard, Package, Users } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const NAV = [
  { href: '/chat',      label: 'Chat',      icon: MessageSquare,    primary: true },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard,  primary: false },
  { href: '/batches',   label: 'Batches',   icon: Package,          primary: false },
  { href: '/vendors',   label: 'Vendors',   icon: Users,            primary: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <span className="font-display text-xl text-[var(--accent-primary)]">aperio</span>
        <span className="block font-mono text-[10px] text-[var(--text-muted)] mt-0.5 uppercase tracking-widest">
          traceability
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon, primary }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors',
                active
                  ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
                primary && !active && 'text-[var(--text-secondary)]'
              )}
            >
              <Icon size={16} />
              {label}
              {primary && (
                <span className="ml-auto text-[10px] bg-[var(--accent-primary)] text-black px-1.5 py-0.5 rounded font-bold">
                  MAIN
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}