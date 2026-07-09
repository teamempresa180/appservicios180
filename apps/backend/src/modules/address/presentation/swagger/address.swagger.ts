/**
 * Centralized Swagger metadata (summary/description only) for the Address
 * controller. No business rules are documented here.
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
} as const;
