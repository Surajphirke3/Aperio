import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

// V1.1 placeholder — currently passes through all requests
export function withAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    // TODO: Implement authentication check
    return handler(req);
  };
}
