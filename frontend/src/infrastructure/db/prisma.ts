// Mock Prisma client for demo purposes
// In production, replace with actual PrismaClient

interface MockQueryOptions {
  where?: Record<string, unknown>;
  skip?: number;
  take?: number;
  orderBy?: Record<string, string>;
  include?: Record<string, boolean>;
}

const createMockModel = <T>() => {
  return {
    findMany: async (_options?: MockQueryOptions): Promise<T[]> => [],
    findUnique: async (_options?: MockQueryOptions): Promise<T | null> => null,
    count: async (_options?: { where?: Record<string, unknown> }): Promise<number> => 0,
    create: async (_options?: { data: T }): Promise<T> => ({} as T),
    createMany: async (_options?: { data: T[] }): Promise<{ count: number }> => ({ count: 0 }),
    update: async (_options?: { where: Record<string, unknown>; data: Partial<T> }): Promise<T> => ({} as T),
    delete: async (_options?: { where: Record<string, unknown> }): Promise<void> => {},
    deleteMany: async (_options?: { where?: Record<string, unknown> }): Promise<{ count: number }> => ({ count: 0 }),
  };
};

export const prisma = {
  batch: createMockModel<unknown>(),
  batchStage: createMockModel<unknown>(),
  vendor: createMockModel<unknown>(),
};
