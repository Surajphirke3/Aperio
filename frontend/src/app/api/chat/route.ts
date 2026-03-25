import { NextRequest, NextResponse } from 'next/server';
import { featherlessClient } from '@/infrastructure/ai/featherless/client';
import { parseIntent } from '@/infrastructure/ai/prompts/intentPrompt';
import { extractEntities } from '@/infrastructure/ai/prompts/entityPrompt';
import { buildQueryFilters } from '@/infrastructure/ai/prompts/queryPrompt';
import { getAIResponse } from '@/infrastructure/ai/provider';
import { SYSTEM_PROMPT } from '@/infrastructure/ai/prompts';
import { prisma } from '@/infrastructure/db/prisma';
import { findVendorByName, createMaterialEntry } from '@/infrastructure/db/queries';
import { runStatsQuery } from '@/infrastructure/db/queries/stats';
import type { ParsedIntent } from '@/shared/types';

// Anomaly check types and functions
interface AnomalyResult {
  flagged: boolean;
  message: string;
  severity: 'warning' | 'critical';
}

function generateBatchCode(): string {
  const prefix = 'BATCH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function checkAnomaly(stage: string, inputKg: number, outputKg: number): AnomalyResult | null {
  const lossKg = inputKg - outputKg;
  const lossPct = inputKg > 0 ? (lossKg / inputKg) * 100 : 0;
  
  const LOSS_WARN = 5;
  const LOSS_CRIT = 15;
  
  if (lossPct >= LOSS_CRIT) {
    return {
      flagged: true,
      message: `Critical loss detected at ${stage}: ${lossPct.toFixed(1)}% loss (${lossKg.toFixed(1)}kg)`,
      severity: 'critical',
    };
  } else if (lossPct >= LOSS_WARN) {
    return {
      flagged: true,
      message: `Warning: High loss at ${stage}: ${lossPct.toFixed(1)}% loss (${lossKg.toFixed(1)}kg)`,
      severity: 'warning',
    };
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: unknown = body.message;
    const conversationId: string | undefined = body.conversationId;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Step 1: Classify intent
    const intentResult = await parseIntent(featherlessClient, message);
    const intentType = intentResult.type;

    const isDataEntry = ['purchase', 'processing', 'dispatch'].includes(intentType);
    const isQuery = intentType === 'query' || intentType === 'report';

    // Step 2: Handle data_entry
    if (isDataEntry) {
      const entities: ParsedIntent = await extractEntities(featherlessClient, message, intentType);

      // Find or create vendor
      const vendorName = entities.vendor;
      if (vendorName) {
        const existingVendor = await findVendorByName(vendorName);
        if (!existingVendor) {
          await prisma.vendor.create({
            data: {
              name: vendorName,
              materialTypes: entities.material ? [entities.material] : [],
              totalSupplied_kg: entities.quantity_kg ?? 0,
            },
          });
        } else {
          await prisma.vendor.update({
            where: { name: vendorName },
            data: {
              totalSupplied_kg: { increment: entities.quantity_kg ?? 0 },
              lastDelivery: new Date(),
              materialTypes: existingVendor.materialTypes.includes(entities.material)
                ? existingVendor.materialTypes
                : [...existingVendor.materialTypes, entities.material],
            },
          });
        }
      }

      // Create batch + stage in DB
      const batch = await createMaterialEntry(entities);
      const batchCode = generateBatchCode();

      // Check for anomalies
      let anomaly: AnomalyResult | null = null;
      if (entities.stage && entities.quantity_kg) {
        const outputKg = entities.quantity_kg - (entities.loss_kg ?? 0);
        anomaly = checkAnomaly(entities.stage, entities.quantity_kg, outputKg);
      }

      const responseMsg = anomaly
        ? `\u26a0\ufe0f Logged with alert! Batch ${batchCode}: ${entities.quantity_kg}kg ${entities.material} from ${vendorName ?? 'unknown'}. ${anomaly.message}`
        : `\u2705 Logged! Batch ${batchCode}: ${entities.quantity_kg}kg ${entities.material} from ${vendorName ?? 'unknown'}`;

      return NextResponse.json({
        success: true,
        reply: responseMsg,
        intent: 'data_entry',
        entry: entities,
        batchId: batch.id,
        batchCode,
        anomaly: anomaly ?? undefined,
        conversationId: conversationId ?? batch.id,
        action: 'stored' as const,
        structuredData: entities,
      });
    }

    // Step 3: Handle query
    if (isQuery) {
      const filters = await buildQueryFilters(featherlessClient, message);
      const stats = await runStatsQuery(filters);

      // Get AI to format the answer naturally
      const aiResponse = await getAIResponse([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Answer this question using this data: ${JSON.stringify(stats)}\n\nQuestion: ${message}` },
      ]);

      return NextResponse.json({
        success: true,
        reply: aiResponse.content,
        intent: 'query',
        data: stats,
        conversationId: conversationId ?? crypto.randomUUID(),
        action: 'queried' as const,
      });
    }

    // Step 4: General conversation
    const aiResponse = await getAIResponse([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ]);

    return NextResponse.json({
      success: true,
      reply: aiResponse.content,
      intent: 'general',
      conversationId: conversationId ?? crypto.randomUUID(),
      action: 'queried' as const,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const errMsg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
