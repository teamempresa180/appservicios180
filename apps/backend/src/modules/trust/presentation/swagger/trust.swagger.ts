/**
 * Centralized Swagger metadata (summary/description only) for the Trust
 * controller. No business rules are documented here.
 */
export const TrustSwagger = {
  create: {
    summary: 'Create a Trust profile',
    description: 'Registers a new Trust profile for an Identity.',
  },
  update: {
    summary: 'Update a Trust profile',
    description: 'Updates an existing Trust profile by id.',
  },
  get: {
    summary: 'Get a Trust profile',
    description: 'Fetches a single Trust profile by id.',
  },
} as const;
