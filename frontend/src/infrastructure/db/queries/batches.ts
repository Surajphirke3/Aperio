import { prisma } from '../prisma';

export async function findBatches(filters?: {
  materialType?: string;
  vendor?: string;
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

export async function findBatchById(id: string) {
  return prisma.batch.findUnique({
    where: { id },
    include: { stages: true },
  });
}

export async function createBatch(data: {
  materialType: string;
  quantity_kg: number;
  vendor?: string;
}) {
  return prisma.batch.create({ data });
}
