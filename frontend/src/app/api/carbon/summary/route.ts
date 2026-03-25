import { NextResponse } from 'next/server';
import { getBatches } from '@/infrastructure/db/queries';
import { estimateEmissions } from '@/infrastructure/carbon/estimator';
import { OFFSET_CREDIT_RATE } from '@/infrastructure/carbon/constants';

export async function GET() {
  try {
    const { batches } = await getBatches({ limit: 10000 });

    let totalEmissions = 0;
    let totalOffset = 0;

    for (const batch of batches) {
      const stageInputs = (batch.stages as { stage: string; input_kg: number }[]).map((s) => ({
        stage: s.stage,
        quantity_kg: s.input_kg,
      }));

      const result = estimateEmissions(stageInputs);
      totalEmissions += result.total_kgCO2;
      totalOffset += batch.quantity_kg * (OFFSET_CREDIT_RATE ?? 0);
    }

    return NextResponse.json({
      data: {
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        totalOffset: Math.round(totalOffset * 100) / 100,
        netEmissions: Math.round((totalEmissions - totalOffset) * 100) / 100,
        batchCount: batches.length,
      },
    });
  } catch (error) {
    console.error('Carbon summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
