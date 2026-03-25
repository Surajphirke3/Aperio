import { BatchList } from '@/features/batches';
import { PageHeader } from '@/shared/components/PageHeader';

export default function BatchesPage() {
  return (
    <div>
      <PageHeader title="Batches" description="View and manage recycling batches" />
      <BatchList />
    </div>
  );
}