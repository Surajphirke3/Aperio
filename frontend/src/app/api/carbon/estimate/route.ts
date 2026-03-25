import { NextRequest, NextResponse } from 'next/server';
import { getBatchById } from '@/infrastructure/db/queries';
import { estimateEmissions } from '@/infrastructure/carbon/estimator';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');
    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required' }, { status: 400 });
    }

    const batch = await getBatchById(batchId);
    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const stageInputs = batch.stages.map((s: { stage: string; input_kg: number }) => ({
      stage: s.stage,
      quantity_kg: s.input_kg,
    }));

    const emissions = estimateEmissions(stageInputs);

    return NextResponse.json({
      data: {
        batchId,
        totalEmissions_kgCO2: emissions.total_kgCO2,
        byStage: emissions.byStage,
        offsetCredits: 0,
        netEmissions_kgCO2: emissions.total_kgCO2,
      },
    });
  } catch (error) {
    console.error('Carbon estimate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
