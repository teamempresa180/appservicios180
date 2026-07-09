/**
 * Centralized Swagger metadata (summary/description only) for the
 * Authentication controller. No business rules are documented here.
 */
export const AuthenticationSwagger = {
  create: {
    summary: 'Create an Authentication method',
    description: 'Registers a new Authentication method for an Identity.',
  },
  update: {
    summary: 'Update an Authentication method',
    description: 'Updates an existing Authentication method by id.',
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
