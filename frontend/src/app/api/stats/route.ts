import { NextResponse } from 'next/server';
import { mockDashboardStats } from '@/infrastructure/mock';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ data: mockDashboardStats });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats from backend' }, { status: 500 });
  }
}
