import { NextResponse } from 'next/server';
import { mockDashboardStats } from '@/infrastructure/mock';

export async function GET() {
  try {
    return NextResponse.json({ data: mockDashboardStats });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
