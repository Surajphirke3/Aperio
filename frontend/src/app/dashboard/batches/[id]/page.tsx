'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { LoadingState } from '@/shared/components/LoadingState';
import Link from 'next/link';

export default function BatchDetailPage() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(`/api/batches/${id}`, async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });

  if (isLoading) return <LoadingState message="Loading batch details..." />;
  if (error || !data) return <div className="text-red-500 p-4">Failed to load batch</div>;

  const batch = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/batches" className="text-emerald-600 hover:underline">
          ← Back to Batches
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-2">Batch {batch.id}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Material</p>
            <p className="font-semibold">{batch.materialType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="font-semibold">{batch.quantity_kg} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vendor</p>
            <p className="font-semibold">{batch.vendor || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-semibold">{new Date(batch.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-3">Processing Stages</h2>
        <div className="space-y-2">
          {batch.stages?.map((stage: { stage: string; input_kg: number; output_kg: number; loss_kg: number }, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium capitalize">{stage.stage}</span>
              <div className="flex gap-6 text-sm">
                <span className="text-gray-500">Input: <span className="text-gray-900 font-medium">{stage.input_kg} kg</span></span>
                <span className="text-gray-500">Output: <span className="text-gray-900 font-medium">{stage.output_kg} kg</span></span>
                <span className="text-red-500 font-medium">Loss: {stage.loss_kg} kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}