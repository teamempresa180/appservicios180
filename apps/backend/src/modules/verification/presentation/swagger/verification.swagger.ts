/**
 * Centralized Swagger metadata (summary/description only) for the
 * Verification controller. No business rules are documented here.
 */
export const VerificationSwagger = {
  create: {
    summary: 'Create a Verification',
    description: 'Registers a new Verification for an Identity.',
  },
  update: {
    summary: 'Update a Verification',
    description: 'Updates an existing Verification by id.',
  },
  get: {
    summary: 'Get a Verification',
    description: 'Fetches a single Verification by id.',
  },
} as const;
