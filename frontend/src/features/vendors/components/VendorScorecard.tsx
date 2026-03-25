import type { VendorScorecard as VendorScorecardType } from '../types';
import { VendorBadge } from './VendorBadge';

interface VendorScorecardProps {
  scorecard: VendorScorecardType;
}

export function VendorScorecard({ scorecard }: VendorScorecardProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="font-semibold text-lg">{scorecard.vendor.name}</h3>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">Quality</p>
          <VendorBadge score={scorecard.qualityScore} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Reliability</p>
          <VendorBadge score={scorecard.reliabilityScore} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Overall</p>
          <VendorBadge score={scorecard.overallScore} />
        </div>
      </div>
    </div>
  );
}
