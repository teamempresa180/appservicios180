/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Identity controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention used across
 * every controller documented in this prompt (Sprint 4, Etapa 1).
 */
export const IdentitySwagger = {
  create: {
    summary: 'Create an Identity',
    description: 'Registers a new Identity, always in Active status.',
  },
  update: {
    summary: 'Update an Identity',
    description:
      'Updates the mutable fields (fullName/status) of an existing Identity by id.',
  },
  delete: {
    summary: 'Delete an Identity',
    description: 'Deletes an existing Identity by id.',
  },
  get: {
    summary: 'Get an Identity',
    description: 'Fetches a single Identity by id.',
  },
} as const;
