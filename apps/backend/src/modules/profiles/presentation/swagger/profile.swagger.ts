/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Profile controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials).
 */
export const ProfileSwagger = {
  create: {
    summary: 'Create a Profile',
    description: 'Registers a new Profile for an existing Identity.',
  },
  update: {
    summary: 'Update a Profile',
    description: 'Updates the mutable fields of an existing Profile by id.',
  },
  delete: {
    summary: 'Delete a Profile',
    description: 'Deletes an existing Profile by id.',
  },
  get: {
    summary: 'Get a Profile',
    description: 'Fetches a single Profile by id.',
  },
  list: {
    summary: 'List Profiles',
    description: 'Lists Profiles page by page.',
  },
  search: {
    summary: 'Search Profiles',
    description: 'Free-text search over displayName/bio.',
  },
} as const;
