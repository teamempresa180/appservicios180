/**
 * Centralized Swagger metadata (summary/description only) for the Identity
 * controller. No business rules are documented here.
 */
export const IdentitySwagger = {
  create: {
    summary: 'Create an Identity',
    description: 'Registers a new Identity.',
  },
  update: {
    summary: 'Update an Identity',
    description: 'Updates an existing Identity by id.',
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
