import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/infrastructure/db/queries';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
