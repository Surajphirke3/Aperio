import { NextResponse } from 'next/server';
import { getVendors } from '@/infrastructure/db/queries';

export async function GET() {
  try {
    const vendors = await getVendors();
    return NextResponse.json({ data: vendors });
  } catch (error) {
    console.error('Vendors API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
