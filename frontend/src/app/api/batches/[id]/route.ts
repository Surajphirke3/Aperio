import { NextRequest, NextResponse } from 'next/server';
import { getBatchById } from '@/infrastructure/db/queries';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const batch = await getBatchById(id);
    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    return NextResponse.json({ data: batch });
  } catch (error) {
    console.error('Batch detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
