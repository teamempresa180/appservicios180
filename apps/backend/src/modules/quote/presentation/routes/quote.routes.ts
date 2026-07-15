/**
 * Centralized route path constants for the Quote controller.
 */
export const QuoteRoutes = {
  base: 'quotes',
  search: 'search',
  byId: ':id',
  accept: ':id/accept',
  reject: ':id/reject',
} as const;
