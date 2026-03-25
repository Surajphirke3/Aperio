import { cn } from '@/shared/utils/cn';

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  variant?: 'default' | 'warning' | 'danger';
}

export function KPICard({ label, value, change, variant = 'default' }: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-6 shadow-sm',
        variant === 'warning' && 'border-yellow-200 bg-yellow-50',
        variant === 'danger' && 'border-red-200 bg-red-50',
      )}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {change && <p className="mt-1 text-xs text-gray-400">{change}</p>}
    </div>
  );
}
