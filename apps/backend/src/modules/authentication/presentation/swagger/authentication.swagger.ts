/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Authentication controller. Response schemas and status
 * codes are attached directly on each controller method via
 * `@ApiResponse`/`@ApiBody` — same convention as `IdentitySwagger`
 * (Sprint 4, Etapa 1).
 */
export const AuthenticationSwagger = {
  create: {
    summary: 'Create an Authentication method',
    description: 'Registers a new Authentication method for an Identity.',
  },
  update: {
    summary: 'Update an Authentication method',
    description:
      'Updates the status of an existing Authentication method by id.',
  },
  delete: {
    summary: 'Delete an Authentication method',
    description: 'Deletes an existing Authentication method by id.',
  },
  get: {
    summary: 'Get an Authentication method',
    description: 'Fetches a single Authentication method by id.',
  },
} as const;
