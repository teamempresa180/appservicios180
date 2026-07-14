/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Address controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials).
 */
export const AddressSwagger = {
  create: {
    summary: 'Create an Address',
    description: 'Registers a new Address.',
  },
  update: {
    summary: 'Update an Address',
    description: 'Updates an existing Address by id.',
  },
  delete: {
    summary: 'Delete an Address',
    description: 'Deletes an existing Address by id.',
  },
  get: {
    summary: 'Get an Address',
    description: 'Fetches a single Address by id.',
  },
  list: {
    summary: 'List Addresses',
    description: 'Lists Addresses page by page.',
  },
  search: {
    summary: 'Search Addresses',
    description: 'Free-text search over alias/fullAddress/city.',
  },
} as const;
