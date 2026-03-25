import { prisma } from '../prisma';

export async function findVendors() {
  return prisma.vendor.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function findVendorByName(name: string) {
  return prisma.vendor.findUnique({
    where: { name },
  });
}
