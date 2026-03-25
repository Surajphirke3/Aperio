'use client';

import { useVendors } from '../hooks/useVendors';
import { VendorBadge } from './VendorBadge';
import { LoadingState } from '@/shared/components/LoadingState';
import { formatKg } from '@/shared/utils/numbers';

export function VendorTable() {
  const { vendors, isLoading, isError } = useVendors();

  if (isLoading) return <LoadingState message="Loading vendors..." />;
  if (isError) return <div className="text-red-500 p-4">Failed to load vendors</div>;

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-3">Vendor</th>
            <th className="px-4 py-3">Materials</th>
            <th className="px-4 py-3">Total Supplied</th>
            <th className="px-4 py-3">Quality</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {vendors.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{v.name}</td>
              <td className="px-4 py-3">{v.materialTypes.join(', ')}</td>
              <td className="px-4 py-3">{formatKg(v.totalSupplied_kg)}</td>
              <td className="px-4 py-3"><VendorBadge score={v.avgQualityScore} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
