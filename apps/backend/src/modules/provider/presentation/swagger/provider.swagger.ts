/**
 * Centralized Swagger metadata (summary/description only) for the Provider
 * controller. No business rules are documented here.
 */
export const ProviderSwagger = {
  create: {
    summary: 'Create a Provider',
    description: 'Registers a new Provider.',
  },
  update: {
    summary: 'Update a Provider',
    description: 'Updates an existing Provider by id.',
  },
  delete: {
    summary: 'Delete a Provider',
    description: 'Deletes an existing Provider by id.',
  },
  get: {
    summary: 'Get a Provider',
    description: 'Fetches a single Provider by id.',
  },
} as const;
