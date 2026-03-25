import { prisma } from '../prisma';
import type { ParsedIntent } from '@/shared/types';

interface Batch {
  id: string;
  materialType: string;
  quantity_kg: number;
  vendor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createMaterialEntry(entities: ParsedIntent): Promise<Batch> {
  const batch = await prisma.batch.create({
    data: {
      materialType: entities.material,
      quantity_kg: entities.quantity_kg,
      vendor: entities.vendor,
      stages: entities.stage
        ? {
            create: {
              stage: entities.stage,
              input_kg: entities.quantity_kg,
              output_kg: entities.quantity_kg - (entities.loss_kg ?? 0),
              loss_kg: entities.loss_kg ?? 0,
            },
          }
        : undefined,
    },
  } as never);

  return batch as Batch;
}
