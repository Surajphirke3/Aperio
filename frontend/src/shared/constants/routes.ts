export const ROUTES = {
  DASHBOARD: '/',
  BATCHES: '/batches',
  BATCH_DETAIL: (id: string) => `/batches/${id}`,
  VENDORS: '/vendors',
  CARBON: '/carbon',
} as const;
