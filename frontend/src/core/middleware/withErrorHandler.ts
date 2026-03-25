import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json(
        { success: false, error: message },
        { status: 500 },
      );
    }
  };
}
