import type { Batch } from '../types';
import { formatKg } from '@/shared/utils/numbers';
import { formatDate } from '@/shared/utils/dates';
import { Badge } from '@/shared/ui';
import Link from 'next/link';

interface BatchCardProps {
  batch: Batch;
}

export function BatchCard({ batch }: BatchCardProps) {
  return (
    <Link href={`/batches/${batch.id}`} className="block rounded-xl border bg-white p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Batch {batch.id}</p>
          <p className="text-sm text-gray-500">{formatDate(batch.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{batch.materialType}</Badge>
          <span className="text-sm font-medium">{formatKg(batch.quantity_kg)}</span>
        </div>
      </div>
    </Link>
  );
}
