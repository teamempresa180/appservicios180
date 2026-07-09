/**
 * Centralized Swagger metadata (summary/description only) for the Profile
 * controller. No business rules are documented here.
 */
export const ProfileSwagger = {
  create: {
    summary: 'Create a Profile',
    description: 'Registers a new Profile.',
  },
  update: {
    summary: 'Update a Profile',
    description: 'Updates an existing Profile by id.',
  },
  delete: {
    summary: 'Delete a Profile',
    description: 'Deletes an existing Profile by id.',
  },
  get: {
    summary: 'Get a Profile',
    description: 'Fetches a single Profile by id.',
  },
} as const;
