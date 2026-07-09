/**
 * Centralized route path constants for the Order controller.
 */
export const OrderRoutes = {
  base: 'orders',
  byId: ':id',
  cancel: ':id/cancel',
} as const;
