/**
 * Centralized Swagger metadata (summary/description only) for the
 * Credential controller. No business rules are documented here.
 */
export const CredentialSwagger = {
  create: {
    summary: 'Create a Credential',
    description: 'Registers a new Credential record for an Identity.',
  },
  update: {
    summary: 'Update a Credential',
    description: 'Updates an existing Credential by id.',
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
