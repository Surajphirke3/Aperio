import { BatchDetail } from '@/features/batches/components/BatchDetail';

export default function BatchDetailPage({ params }: { params: { id: string } }) {
  return <BatchDetail batchId={params.id} />;
}