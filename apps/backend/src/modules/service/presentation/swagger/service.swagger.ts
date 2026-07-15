/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Service controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials).
 */
export const ServiceSwagger = {
  create: {
    summary: 'Create a Service',
    description:
      'Publishes a new Service offered by a Provider within a Category.',
  },
  update: {
    summary: 'Update a Service',
    description: 'Updates an existing Service by id.',
  },
  delete: {
    summary: 'Delete a Service',
    description: 'Deletes an existing Service by id.',
  },
  get: {
    summary: 'Get a Service',
    description: 'Fetches a single Service by id.',
  },
  list: {
    summary: 'List Services',
    description: 'Lists Services page by page.',
  },
  search: {
    summary: 'Search Services',
    description: 'Free-text search over name/description.',
  },
} as const;
