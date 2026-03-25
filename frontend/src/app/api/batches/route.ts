import { NextRequest, NextResponse } from 'next/server';
import { mockBatches } from '@/infrastructure/mock';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';

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
    return NextResponse.json({ error: 'Failed to fetch batches from backend' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Batches POST error:', error);
    return NextResponse.json({ error: 'Failed to create batch in backend' }, { status: 500 });
  }
}
