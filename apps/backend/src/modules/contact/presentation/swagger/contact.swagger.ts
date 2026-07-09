/**
 * Centralized Swagger metadata (summary/description only) for the Contact
 * controller. No business rules are documented here.
 */
export const ContactSwagger = {
  create: {
    summary: 'Create a Contact',
    description: 'Registers a new Contact channel.',
  },
  update: {
    summary: 'Update a Contact',
    description: 'Updates an existing Contact by id.',
  },
  delete: {
    summary: 'Delete a Contact',
    description: 'Deletes an existing Contact by id.',
  },
  get: {
    summary: 'Get a Contact',
    description: 'Fetches a single Contact by id.',
  },
} as const;
