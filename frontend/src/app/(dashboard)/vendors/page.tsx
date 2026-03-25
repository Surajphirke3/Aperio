import { VendorTable } from '@/features/vendors';
import { PageHeader } from '@/shared/components/PageHeader';

export default function VendorsPage() {
  return (
    <div>
      <PageHeader title="Vendors" description="View vendor performance and scorecards" />
      <VendorTable />
    </div>
  );
}
