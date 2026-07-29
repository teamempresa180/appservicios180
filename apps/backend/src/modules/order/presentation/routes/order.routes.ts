/**
 * Centralized route path constants for the Order controller.
 */
export const OrderRoutes = {
  base: 'orders',
  search: 'search',
  mine: 'mine',
  relevantForProvider: 'relevant-for-provider',
  byId: ':id',
  cancel: ':id/cancel',
  start: ':id/start',
  complete: ':id/complete',
} as const;
