/**
 * Centralized Swagger metadata (summary/description only) for the Schedule
 * controller. No business rules are documented here.
 */
export const ScheduleSwagger = {
  create: {
    summary: 'Create a Schedule block',
    description: 'Registers a new time block in a Provider agenda.',
  },
  update: {
    summary: 'Update a Schedule block',
    description: 'Updates an existing Schedule block by id.',
  },
  delete: {
    summary: 'Delete a Schedule block',
    description: 'Deletes an existing Schedule block by id.',
  },
  get: {
    summary: 'Get a Schedule block',
    description: 'Fetches a single Schedule block by id.',
  },
} as const;
