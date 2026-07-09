/**
 * Centralized Swagger metadata (summary/description only) for the Service
 * controller. No business rules are documented here.
 */
export const ServiceSwagger = {
  create: {
    summary: 'Create a Service',
    description: 'Publishes a new Service.',
  },
  update: {
    summary: 'Update a Service',
    description: 'Updates an existing Service by id.',
  },
  delete: {
    summary: 'Delete a Service',
    description: 'Deletes an existing Service by id.',
  },
  get: {
    summary: 'Get a Service',
    description: 'Fetches a single Service by id.',
  },
} as const;
