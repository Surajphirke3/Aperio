import { prisma } from './prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBatch = any;

export async function getBatches(filters?: {
  materialType?: string;
  stage?: string;
  vendor?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.materialType) where.materialType = filters.materialType;
  if (filters?.vendor) where.vendor = filters.vendor;

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;

  const [batches, total] = await Promise.all([
    prisma.batch.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { stages: true },
    }),
    prisma.batch.count({ where }),
  ]);

  return { batches, total };
}

export async function getBatchById(id: string) {
  return prisma.batch.findUnique({
    where: { id },
    include: { stages: true },
  });
}

export async function getVendors() {
  return prisma.vendor.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getDashboardStats() {
  const [batches, vendorCount] = await Promise.all([
    prisma.batch.findMany({ include: { stages: true } }) as Promise<AnyBatch[]>,
    prisma.vendor.count() as Promise<number>,
  ]);

  let totalInput = 0;
  let totalOutput = 0;
  let totalLoss = 0;

  const materialMap: Record<string, number> = {};
  const stageMap: Record<string, { quantity_kg: number; loss_kg: number }> = {};
  const anomalies: { batch_id: string; stage: string; loss_pct: number; threshold_pct: number; severity: 'warning' | 'critical' }[] = [];
  const LOSS_WARN = 5;
  const LOSS_CRIT = 15;

  for (const batch of batches) {
    totalInput += batch.quantity_kg;
    materialMap[batch.materialType] = (materialMap[batch.materialType] ?? 0) + batch.quantity_kg;

    for (const stage of batch.stages) {
      totalLoss += stage.loss_kg;

      if (!stageMap[stage.stage]) stageMap[stage.stage] = { quantity_kg: 0, loss_kg: 0 };
      stageMap[stage.stage].quantity_kg += stage.input_kg;
      stageMap[stage.stage].loss_kg += stage.loss_kg;

      const lossPct = stage.input_kg > 0 ? (stage.loss_kg / stage.input_kg) * 100 : 0;
      if (lossPct >= LOSS_CRIT) {
        anomalies.push({ batch_id: batch.id, stage: stage.stage, loss_pct: lossPct, threshold_pct: LOSS_CRIT, severity: 'critical' });
      } else if (lossPct >= LOSS_WARN) {
        anomalies.push({ batch_id: batch.id, stage: stage.stage, loss_pct: lossPct, threshold_pct: LOSS_WARN, severity: 'warning' });
      }
    }
    const lastStage = batch.stages[batch.stages.length - 1];
    if (lastStage) totalOutput += lastStage.output_kg;
  }

  const materialBreakdown = Object.entries(materialMap).map(([material, quantity_kg]) => ({ material, quantity_kg }));
  const stageBreakdown = Object.entries(stageMap).map(([stage, v]) => ({ stage, ...v }));

  // Build sankey nodes & links from aggregated stage data
  const stageOrder = ['collection', 'sorting', 'processing', 'output', 'dispatch'];
  const orderedStages = stageOrder.filter((s) => stageMap[s]);
  const sankeyNodes = orderedStages.map((s) => ({ id: s, label: s.charAt(0).toUpperCase() + s.slice(1), value: stageMap[s].quantity_kg }));
  const sankeyLinks: { source: string; target: string; value: number }[] = [];
  for (let i = 1; i < orderedStages.length; i++) {
    sankeyLinks.push({ source: orderedStages[i - 1], target: orderedStages[i], value: stageMap[orderedStages[i]].quantity_kg });
  }

  // Completeness: ratio of batches that have ≥ 3 stages recorded
  const completeBatches = batches.filter((b: { stages: unknown[] }) => b.stages.length >= 3).length;
  const completenessScore = batches.length > 0 ? Math.round((completeBatches / batches.length) * 100) : 0;

  return {
    totalInput,
    totalOutput,
    totalLoss,
    lossPct: totalInput > 0 ? (totalLoss / totalInput) * 100 : 0,
    batchCount: batches.length,
    vendorCount,
    materialBreakdown,
    stageBreakdown,
    sankey: { nodes: sankeyNodes, links: sankeyLinks },
    anomalies,
    completenessScore,
  };
}

// Re-export unique functions from subdirectory modules
export { createBatch } from './queries/batches';
export { findVendorByName } from './queries/vendors';
export { createMaterialEntry } from './queries/entries';
