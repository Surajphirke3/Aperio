import { NextResponse } from 'next/server';
import { mockInsights } from '@/infrastructure/mock';

export async function GET() {
  try {
    return NextResponse.json({ data: mockInsights });
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
