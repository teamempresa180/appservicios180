/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Provider controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials).
 */
export const ProviderSwagger = {
  create: {
    summary: 'Create a Provider',
    description:
      'Registers a new Provider for an Identity. An Identity may have at most one Provider record.',
  },
  update: {
    summary: 'Update a Provider',
    description: 'Updates an existing Provider by id.',
  },
  delete: {
    summary: 'Delete a Provider',
    description: 'Deletes an existing Provider by id.',
  },
  get: {
    summary: 'Get a Provider',
    description: 'Fetches a single Provider by id.',
  },
  list: {
    summary: 'List Providers',
    description: 'Lists Providers page by page.',
  },
  search: {
    summary: 'Search Providers',
    description: 'Free-text search over type/biography.',
  },
  compatible: {
    summary: 'Find compatible Providers',
    description:
      'Lists active Providers in a Category, optionally narrowed by specialization — powers the client marketplace search.',
  },
} as const;
