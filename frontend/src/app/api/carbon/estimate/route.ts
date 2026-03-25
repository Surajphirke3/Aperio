import { NextRequest, NextResponse } from 'next/server';
import { mockBatches } from '@/infrastructure/mock';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');
    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required' }, { status: 400 });
    }

    const batch = mockBatches.find((b) => b.id === batchId);
    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const totalInput = batch.stages.reduce((sum, s) => sum + s.input_kg, 0);
    const totalEmissions = totalInput * 0.5;

    return NextResponse.json({
      data: {
        batchId,
        totalEmissions_kgCO2: Math.round(totalEmissions * 100) / 100,
        byStage: batch.stages.map((s) => ({
          stage: s.stage,
          emissions_kgCO2: Math.round(s.input_kg * 0.5 * 100) / 100,
        })),
        offsetCredits: batch.quantity_kg * 0.3,
        netEmissions_kgCO2: Math.round((totalEmissions - batch.quantity_kg * 0.3) * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Carbon estimate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
