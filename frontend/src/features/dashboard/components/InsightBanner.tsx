import { Lightbulb } from 'lucide-react';
import { Card } from '@/shared/ui';

interface Props {
  narrative?: string;
}

export function InsightBanner({ narrative }: Props) {
  if (!narrative) return null;
  return (
    <Card className="p-4 flex items-start gap-3 border-[var(--border-accent)]">
      <Lightbulb size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{narrative}</p>
    </Card>
  );
}
