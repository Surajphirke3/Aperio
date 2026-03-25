import { NextRequest, NextResponse } from 'next/server';

export function validateRequest(req: NextRequest, requiredFields: string[]) {
  if (req.method === 'POST' || req.method === 'PUT') {
    return req.json().then((body: Record<string, unknown>) => {
      const missing = requiredFields.filter((field) => !(field in body));
      if (missing.length > 0) {
        return NextResponse.json(
          { error: `Missing required fields: ${missing.join(', ')}` },
          { status: 400 },
        );
      }
      return null;
    });
  }
  return Promise.resolve(null);
}
