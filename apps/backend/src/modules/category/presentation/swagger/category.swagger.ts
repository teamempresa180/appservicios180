/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Category controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials).
 */
export const CategorySwagger = {
  create: {
    summary: 'Create a Category',
    description: 'Registers a new Category.',
  },
  update: {
    summary: 'Update a Category',
    description: 'Updates an existing Category by id.',
  },
  delete: {
    summary: 'Delete a Category',
    description: 'Deletes an existing Category by id.',
  },
  get: {
    summary: 'Get a Category',
    description: 'Fetches a single Category by id.',
  },
  list: {
    summary: 'List Categories',
    description: 'Lists Categories page by page.',
  },
  search: {
    summary: 'Search Categories',
    description: 'Free-text search over name/description.',
  },
  specializations: {
    summary: 'List a Category\'s Specializations',
    description:
      'Lists the real Specializations that belong to a Category (e.g. Electricidad -> Residencial/Comercial/Industrial/Domótica/Redes/Paneles solares).',
  },
} as const;
