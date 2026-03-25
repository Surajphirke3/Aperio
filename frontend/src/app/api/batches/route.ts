import { NextRequest, NextResponse } from 'next/server';
import { mockBatches } from '@/infrastructure/mock';

export async function GET() {
  try {
    return NextResponse.json({ 
      data: { 
        batches: mockBatches, 
        total: mockBatches.length 
      } 
    });
  } catch (error) {
    console.error('Batches API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
