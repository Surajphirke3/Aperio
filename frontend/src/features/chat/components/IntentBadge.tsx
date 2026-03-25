import type { IntentType } from '@/shared/types';
import { cn } from '@/shared/utils/cn';

const INTENT_STYLES: Record<IntentType, string> = {
  purchase: 'bg-emerald-500/20 text-emerald-400',
  processing: 'bg-blue-500/20 text-blue-400',
  dispatch: 'bg-purple-500/20 text-purple-400',
  query: 'bg-amber-500/20 text-amber-400',
  report: 'bg-cyan-500/20 text-cyan-400',
};

interface Props { intent: IntentType; }

export function IntentBadge({ intent }: Props) {
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider', INTENT_STYLES[intent] ?? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]')}>
      {intent}
    </span>
  );
}