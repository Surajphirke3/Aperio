import { NextResponse } from 'next/server';
import { mockVendors } from '@/infrastructure/mock';

export async function GET() {
  try {
    return NextResponse.json({ data: mockVendors });
  } catch (error) {
    console.error('Vendors API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
