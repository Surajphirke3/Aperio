import type { BatchStage } from '../types';
import { formatKg } from '@/shared/utils/numbers';
import { STAGE_LABELS } from '@/shared/constants/stages';

interface BatchTimelineProps {
  stages: BatchStage[];
}

export function BatchTimeline({ stages }: BatchTimelineProps) {
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.stage} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-blue-600" />
            {index < stages.length - 1 && <div className="w-0.5 flex-1 bg-gray-200" />}
          </div>
          <div className="pb-4">
            <p className="font-medium text-sm">{STAGE_LABELS[stage.stage]}</p>
            <p className="text-xs text-gray-500">
              In: {formatKg(stage.input_kg)} → Out: {formatKg(stage.output_kg)} | Loss: {formatKg(stage.loss_kg)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
