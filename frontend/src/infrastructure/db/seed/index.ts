import { prisma } from '../prisma';

async function seed() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.batchStage.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.vendor.deleteMany();

  // Create sample vendors
  await prisma.vendor.createMany({
    data: [
      { name: 'EcoPlastics Inc.', materialTypes: ['PET', 'HDPE'], totalSupplied_kg: 50000, avgQualityScore: 85 },
      { name: 'GreenRecycle Co.', materialTypes: ['PP', 'LDPE'], totalSupplied_kg: 35000, avgQualityScore: 78 },
      { name: 'CleanStream Ltd.', materialTypes: ['PET', 'mixed'], totalSupplied_kg: 42000, avgQualityScore: 92 },
    ],
  });

  // Create sample batches
  const batch1 = await prisma.batch.create({
    data: {
      materialType: 'PET',
      quantity_kg: 1000,
      vendor: 'EcoPlastics Inc.',
      stages: {
        create: [
          { stage: 'collection', input_kg: 1000, output_kg: 980, loss_kg: 20 },
          { stage: 'sorting', input_kg: 980, output_kg: 940, loss_kg: 40 },
          { stage: 'processing', input_kg: 940, output_kg: 870, loss_kg: 70 },
          { stage: 'output', input_kg: 870, output_kg: 860, loss_kg: 10 },
        ],
      },
    },
  });

  console.log(`Created batch: ${batch1.id}`);
  console.log('Seeding complete.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
