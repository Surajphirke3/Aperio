import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Aggregate carbon data from all batches
    return NextResponse.json({
      data: {
        totalEmissions: 0,
        totalOffset: 0,
        netEmissions: 0,
        batchCount: 0,
      },
    });
  } catch (error) {
    console.error('Carbon summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
