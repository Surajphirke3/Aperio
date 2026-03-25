import { NextResponse } from 'next/server';
import { mockCarbonStats } from '@/infrastructure/mock';

export async function GET() {
  try {
    return NextResponse.json({
      data: {
        totalEmissions: 850,
        totalOffset: mockCarbonStats.totalCarbonSaved_kg,
        netEmissions: Math.round((850 - mockCarbonStats.totalCarbonSaved_kg) * 100) / 100,
        batchCount: 5,
      },
    });
  } catch (error) {
    console.error('Carbon summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
