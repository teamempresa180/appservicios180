/**
 * Centralized Swagger metadata (summary/description only) for the Category
 * controller. No business rules are documented here.
 */
export const CategorySwagger = {
  create: {
    summary: 'Create a Category',
    description: 'Registers a new Category.',
  },
  update: {
    summary: 'Update a Category',
    description: 'Updates an existing Category by id.',
  },
  delete: {
    summary: 'Delete a Category',
    description: 'Deletes an existing Category by id.',
  },
  get: {
    summary: 'Get a Category',
    description: 'Fetches a single Category by id.',
  },
} as const;
