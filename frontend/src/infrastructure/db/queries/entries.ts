import { prisma } from '../prisma';
import type { ParsedIntent } from '@/shared/types';

export async function createMaterialEntry(entities: ParsedIntent) {
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
    include: { stages: true },
  });

  return batch;
}
