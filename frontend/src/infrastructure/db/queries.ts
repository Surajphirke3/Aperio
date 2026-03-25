import { prisma } from './prisma';

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
  const batches = await prisma.batch.findMany({
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
