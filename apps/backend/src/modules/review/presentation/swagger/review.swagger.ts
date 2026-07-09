/**
 * Centralized Swagger metadata (summary/description only) for the Review
 * controller. No business rules are documented here.
 */
export const ReviewSwagger = {
  create: {
    summary: 'Create a Review',
    description: 'Registers a new Review.',
  },
  update: {
    summary: 'Update a Review',
    description: 'Updates an existing Review by id.',
  },
  delete: {
    summary: 'Delete a Review',
    description: 'Deletes an existing Review by id.',
  },
  get: {
    summary: 'Get a Review',
    description: 'Fetches a single Review by id.',
  },
} as const;
