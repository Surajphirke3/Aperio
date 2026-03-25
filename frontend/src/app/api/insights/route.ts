import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/infrastructure/ai/provider';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');
    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required' }, { status: 400 });
    }

    const aiResponse = await getAIResponse([
      {
        role: 'system',
        content: 'You are an AI that provides insights on plastic recycling batch data. Return JSON with "summary" and "recommendations" fields.',
      },
      {
        role: 'user',
        content: `Provide insights for batch ${batchId}. Include a brief summary and actionable recommendations.`,
      },
    ]);

    let parsed;
    try {
      parsed = JSON.parse(aiResponse.content);
    } catch {
      parsed = { summary: aiResponse.content, recommendations: [] };
    }

    return NextResponse.json({ data: parsed });
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
