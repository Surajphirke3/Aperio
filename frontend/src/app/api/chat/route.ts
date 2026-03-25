import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/core/middleware/rateLimit';
import { featherlessClient } from '@/infrastructure/ai/featherless/client';
import { parseIntent } from '@/infrastructure/ai/prompts/intentPrompt';
import { extractEntities } from '@/infrastructure/ai/prompts/entityPrompt';
import { buildQueryFilters } from '@/infrastructure/ai/prompts/queryPrompt';
import { getAIResponse } from '@/infrastructure/ai/provider';
import { SYSTEM_PROMPT } from '@/infrastructure/ai/prompts';
import { createMaterialEntry } from '@/infrastructure/db/queries/entries';
import { findVendorByName } from '@/infrastructure/db/queries/vendors';
import { runStatsQuery } from '@/infrastructure/db/queries/stats';
import { prisma } from '@/infrastructure/db/prisma';
import type { ParsedIntent, ProcessStage } from '@/shared/types';

interface AnomalyResult {
  stage: string;
  lossPct: number;
  threshold: number;
  severity: 'warning' | 'critical';
  message: string;
}

const ANOMALY_THRESHOLDS: Record<string, { warn: number; critical: number }> = {
  sorting: { warn: 12, critical: 20 },
  washing: { warn: 8, critical: 15 },
  shredding: { warn: 5, critical: 10 },
  melting: { warn: 18, critical: 25 },
  pelletizing: { warn: 8, critical: 12 },
};

function checkAnomaly(stage: string, inputKg: number, outputKg: number): AnomalyResult | null {
  const lossPct = inputKg > 0 ? ((inputKg - outputKg) / inputKg) * 100 : 0;
  const thresholds = ANOMALY_THRESHOLDS[stage];
  if (!thresholds) return null;

  if (lossPct >= thresholds.critical) {
    return { stage, lossPct, threshold: thresholds.critical, severity: 'critical', message: `CRITICAL: ${stage} loss ${lossPct.toFixed(1)}% exceeds ${thresholds.critical}% threshold` };
  }
  if (lossPct >= thresholds.warn) {
    return { stage, lossPct, threshold: thresholds.warn, severity: 'warning', message: `WARNING: ${stage} loss ${lossPct.toFixed(1)}% exceeds ${thresholds.warn}% threshold` };
  }
  return null;
}

function generateBatchCode(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `B-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

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
      let vendorName = entities.vendor;
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
