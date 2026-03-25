import { CarbonDashboard } from '@/features/carbon';
import { PageHeader } from '@/shared/components/PageHeader';

export default function CarbonPage() {
  return (
    <div>
      <PageHeader title="Carbon Footprint" description="Track emissions and offset credits" />
      <CarbonDashboard />
    </div>
  );
}
