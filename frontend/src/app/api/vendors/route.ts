import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const vendorId = url.searchParams.get('id');
    const scorecard = url.searchParams.get('scorecard') === 'true';

    let targetUrl = `${BACKEND_URL}/api/v1/vendors`;
    if (vendorId) {
      targetUrl += `/${vendorId}`;
      if (scorecard) {
        targetUrl += '/scorecard';
      }
    }

    const response = await fetch(targetUrl, {
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
    console.error('Vendors API error:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors from backend' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/vendors`, {
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
    console.error('Vendors POST error:', error);
    return NextResponse.json({ error: 'Failed to create vendor in backend' }, { status: 500 });
  }
}
