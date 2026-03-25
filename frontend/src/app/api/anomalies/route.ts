import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';

// Thresholds matching the backend
const ANOMALY_THRESHOLDS: Record<string, { warn: number; critical: number }> = {
  sorting: { warn: 12, critical: 20 },
  washing: { warn: 8, critical: 15 },
  shredding: { warn: 5, critical: 10 },
  melting: { warn: 18, critical: 25 },
  pelletizing: { warn: 8, critical: 12 },
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');

    // Fetch batches from backend
    let targetUrl = `${BACKEND_URL}/api/v1/batches`;
    if (batchId) {
      targetUrl += `/${batchId}`;
    }

    const response = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    const batches = Array.isArray(result.data) ? result.data : [result.data];

    // Detect anomalies from batch lifecycle data
    const anomalies: Array<{
      batch_id: string;
      stage: string;
      loss_pct: number;
      threshold_pct: number;
      severity: 'warning' | 'critical';
    }> = [];

    for (const batch of batches) {
      if (!batch || !batch.stages) continue;

      for (const stage of batch.stages) {
        const thresholds = ANOMALY_THRESHOLDS[stage.stage];
        if (!thresholds) continue;

        const input = stage.input_kg ?? stage.quantity_kg ?? 0;
        const loss = stage.loss_kg ?? 0;
        const lossPct = input > 0 ? (loss / input) * 100 : 0;

        if (lossPct >= thresholds.critical) {
          anomalies.push({
            batch_id: batch.id,
            stage: stage.stage,
            loss_pct: lossPct,
            threshold_pct: thresholds.critical,
            severity: 'critical',
          });
        } else if (lossPct >= thresholds.warn) {
          anomalies.push({
            batch_id: batch.id,
            stage: stage.stage,
            loss_pct: lossPct,
            threshold_pct: thresholds.warn,
            severity: 'warning',
          });
        }
      }
    }

    return NextResponse.json({ data: anomalies });
  } catch (error) {
    console.error('Anomalies API error:', error);
    return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: 500 });
  }
}
