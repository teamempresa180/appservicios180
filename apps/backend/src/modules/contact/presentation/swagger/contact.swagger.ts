/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Contact controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials).
 */
export const ContactSwagger = {
  create: {
    summary: 'Create a Contact',
    description: 'Registers a new Contact channel.',
  },
  update: {
    summary: 'Update a Contact',
    description: 'Updates an existing Contact by id.',
  },
  delete: {
    summary: 'Delete a Contact',
    description: 'Deletes an existing Contact by id.',
  },
  get: {
    summary: 'Get a Contact',
    description: 'Fetches a single Contact by id.',
  },
  list: {
    summary: 'List Contacts',
    description: 'Lists Contacts page by page.',
  },
  search: {
    summary: 'Search Contacts',
    description: 'Free-text search over value.',
  },
} as const;
