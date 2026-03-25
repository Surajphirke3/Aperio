import { NextRequest, NextResponse } from 'next/server';
import { mockDashboardStats, mockBatches } from '@/infrastructure/mock';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lowerMsg = message.toLowerCase();
    let reply = '';
    let structuredData = undefined;
    let action: 'stored' | 'queried' | 'error' = 'queried';

    if (lowerMsg.includes('how much') || lowerMsg.includes('total') || lowerMsg.includes('quantity')) {
      if (lowerMsg.includes('input') || lowerMsg.includes('received')) {
        reply = `📊 Total input this period: ${mockDashboardStats.totalInput} kg`;
      } else if (lowerMsg.includes('output') || lowerMsg.includes('dispatch')) {
        reply = `📊 Total output/dispatched: ${mockDashboardStats.totalOutput} kg`;
      } else if (lowerMsg.includes('loss')) {
        reply = `📊 Total loss: ${mockDashboardStats.totalLoss} kg (${mockDashboardStats.lossPct.toFixed(1)}%)`;
      } else {
        reply = `📊 Total input: ${mockDashboardStats.totalInput} kg, Output: ${mockDashboardStats.totalOutput} kg, Loss: ${mockDashboardStats.totalLoss} kg`;
      }
    } else if (lowerMsg.includes('batch')) {
      reply = `📦 You have ${mockDashboardStats.batchCount} batches in the system.\n\n${mockBatches.map(b => `• ${b.id}: ${b.quantity_kg}kg ${b.materialType} from ${b.vendor}`).join('\n')}`;
    } else if (lowerMsg.includes('vendor')) {
      reply = `🏭 You have ${mockDashboardStats.vendorCount} active vendors.`;
    } else if (lowerMsg.includes('material')) {
      reply = `🧪 Material breakdown:\n${mockDashboardStats.materialBreakdown.map(m => `• ${m.material}: ${m.quantity_kg} kg`).join('\n')}`;
    } else if (lowerMsg.includes('purchased') || lowerMsg.includes('received') || lowerMsg.includes('bought')) {
      const match = message.match(/(\d+)\s*(kg|tons?)?\s*(\w+)/i);
      if (match) {
        const qty = parseInt(match[1]) || 0;
        const material = match[3] || 'PET';
        structuredData = {
          intent: 'purchase',
          material: material.toUpperCase(),
          quantity_kg: match[2]?.toLowerCase().includes('ton') ? qty * 1000 : qty,
          date: new Date().toISOString(),
        };
        action = 'stored';
        reply = `✅ Logged: Purchased ${qty} ${match[2] || 'kg'} of ${material.toUpperCase()}`;
      } else {
        reply = 'I can help log that. Please provide: quantity (e.g., "300 kg") and material type (e.g., PET, HDPE)';
      }
    } else if (lowerMsg.includes('dispatch') || lowerMsg.includes('sent')) {
      const match = message.match(/(\d+)\s*(kg|tons?)?\s*(\w+)/i);
      if (match) {
        const qty = parseInt(match[1]) || 0;
        const material = match[3] || 'PET';
        structuredData = {
          intent: 'dispatch',
          material: material.toUpperCase(),
          quantity_kg: match[2]?.toLowerCase().includes('ton') ? qty * 1000 : qty,
          date: new Date().toISOString(),
        };
        action = 'stored';
        reply = `✅ Logged: Dispatched ${qty} ${match[2] || 'kg'} of ${material.toUpperCase()}`;
      } else {
        reply = 'I can help log that dispatch. Please provide: quantity and material type';
      }
    } else {
      reply = `🤖 I'm your recycling assistant. You can ask me things like:\n• "How much was received this month?"\n• "What is the total loss?"\n• "Show me batch details"\n• "Log: purchased 300 kg PET from Vendor A"`;
    }

    return NextResponse.json({
      success: true,
      reply,
      structuredData,
      action,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
