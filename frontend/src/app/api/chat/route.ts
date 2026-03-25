import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/infrastructure/ai/provider';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/infrastructure/ai/prompts';
import { checkRateLimit } from '@/core/middleware/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const aiResponse = await getAIResponse([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(message) },
    ]);

    return NextResponse.json({
      data: {
        reply: aiResponse.content,
        model: aiResponse.model,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
