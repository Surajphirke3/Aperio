import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint') ?? 'dashboard'; // 'dashboard' or 'sankey'

    const response = await fetch(`${BACKEND_URL}/api/v1/stats/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats from backend' }, { status: 500 });
  }
}
