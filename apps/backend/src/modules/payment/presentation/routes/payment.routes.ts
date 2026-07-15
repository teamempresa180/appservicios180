/**
 * Centralized route path constants for the Payment controller.
 */
export const PaymentRoutes = {
  base: 'payments',
  search: 'search',
  byId: ':id',
  cancel: ':id/cancel',
} as const;
