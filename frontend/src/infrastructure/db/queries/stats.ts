import { prisma } from '../prisma';

export async function runStatsQuery(filters?: Record<string, unknown>) {
  const where: Record<string, unknown> = {};
  if (filters?.materialType) where.materialType = filters.materialType;
  if (filters?.vendor) where.vendor = filters.vendor;

  const batches = await prisma.batch.findMany({
    where,
    include: { stages: true },
  });

  let totalInput = 0;
  let totalOutput = 0;
  let totalLoss = 0;

  for (const batch of batches) {
    totalInput += batch.quantity_kg;
    for (const stage of batch.stages) {
      totalLoss += stage.loss_kg;
    }
    const lastStage = batch.stages[batch.stages.length - 1];
    if (lastStage) totalOutput += lastStage.output_kg;
  }

  return {
    totalInput,
    totalOutput,
    totalLoss,
    lossPct: totalInput > 0 ? (totalLoss / totalInput) * 100 : 0,
    batchCount: batches.length,
  };
}
