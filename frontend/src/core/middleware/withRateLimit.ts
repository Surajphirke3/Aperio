import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './rateLimit';

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export function withRateLimit(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 },
      );
    }
    return handler(req);
  };
}
