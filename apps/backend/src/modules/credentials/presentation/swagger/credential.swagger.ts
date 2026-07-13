/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Credential controller. Response schemas and status codes
 * are attached directly on each controller method via
 * `@ApiResponse`/`@ApiBody` — same convention as `IdentitySwagger`
 * (Sprint 4, Etapa 1).
 */
export const CredentialSwagger = {
  create: {
    summary: 'Create a Credential',
    description: 'Registers a new Credential record for an Identity.',
  },
  update: {
    summary: 'Update a Credential',
    description: 'Updates the status of an existing Credential by id.',
  },
  delete: {
    summary: 'Delete a Credential',
    description: 'Deletes an existing Credential by id.',
  },
  get: {
    summary: 'Get a Credential',
    description: 'Fetches a single Credential by id.',
  },
} as const;
