/**
 * Centralized route path constants for the Category controller.
 */
export const CategoryRoutes = {
  base: 'categories',
  search: 'search',
  byId: ':id',
  specializationsByCategory: ':categoryId/specializations',
} as const;
