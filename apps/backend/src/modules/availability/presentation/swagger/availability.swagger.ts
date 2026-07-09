/**
 * Centralized Swagger metadata (summary/description only) for the
 * Availability controller. No business rules are documented here.
 */
export const AvailabilitySwagger = {
  create: {
    summary: 'Create an Availability',
    description: 'Registers a new Availability for a Provider.',
  },
  update: {
    summary: 'Update an Availability',
    description: 'Updates an existing Availability by id.',
  },
  delete: {
    summary: 'Delete an Availability',
    description: 'Deletes an existing Availability by id.',
  },
  get: {
    summary: 'Get an Availability',
    description: 'Fetches a single Availability by id.',
  },
} as const;
