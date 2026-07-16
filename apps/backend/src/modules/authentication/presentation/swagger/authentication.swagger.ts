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
  login: {
    summary: 'Log in',
    description:
      'Authenticates a documentNumber/password pair and issues a new access/refresh token pair.',
  },
  refresh: {
    summary: 'Refresh the access token',
    description:
      'Exchanges a valid, not-yet-used refresh token for a new access/refresh pair (rotation).',
  },
  logout: {
    summary: 'Log out',
    description: 'Revokes a refresh token, ending that session.',
  },
  me: {
    summary: 'Get the current user',
    description:
      'Returns the id/role of the Identity behind the presented access token.',
  },
} as const;
