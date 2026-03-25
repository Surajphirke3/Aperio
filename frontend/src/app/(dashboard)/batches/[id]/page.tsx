import { BatchDetail } from '@/features/batches';

interface BatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BatchDetailPage({ params }: BatchDetailPageProps) {
  const { id } = await params;
  return <BatchDetail batchId={id} />;
}
