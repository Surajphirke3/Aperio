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

    // Parse structured data if AI returned JSON
    let structuredData = undefined;
    let action: 'stored' | 'queried' | 'error' = 'queried';
    try {
      const parsed = JSON.parse(aiResponse.content);
      if (parsed && typeof parsed === 'object' && 'intent' in parsed) {
        structuredData = parsed;
        action = parsed.intent === 'query' ? 'queried' : 'stored';
      }
    } catch {
      // Not JSON — that's fine, it's a plain text response
    }

    return NextResponse.json({
      success: true,
      reply: aiResponse.content,
      structuredData,
      action,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
