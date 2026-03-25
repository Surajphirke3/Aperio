import { NextRequest, NextResponse } from 'next/server';
import { getBatches } from '@/infrastructure/db/queries';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const filters = {
      materialType: url.searchParams.get('materialType') ?? undefined,
      stage: url.searchParams.get('stage') ?? undefined,
      vendor: url.searchParams.get('vendor') ?? undefined,
      startDate: url.searchParams.get('startDate') ?? undefined,
      endDate: url.searchParams.get('endDate') ?? undefined,
      page: url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined,
      limit: url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined,
    };

    const data = await getBatches(filters);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Batches API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
