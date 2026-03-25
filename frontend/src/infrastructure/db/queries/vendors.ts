import { prisma } from '../prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = any;

export async function findVendors() {
  return prisma.vendor.findMany({
    orderBy: { name: 'asc' },
  } as AnyRecord) as unknown as AnyRecord[];
}

export async function findVendorByName(name: string) {
  return prisma.vendor.findUnique({
    where: { name },
  } as AnyRecord) as AnyRecord | null;
}
