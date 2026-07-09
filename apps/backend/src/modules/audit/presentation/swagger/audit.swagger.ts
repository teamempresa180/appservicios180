/**
 * Centralized Swagger metadata (summary/description only) for the Audit
 * controller. No business rules are documented here.
 */
export const AuditSwagger = {
  create: {
    summary: 'Create an Audit record',
    description:
      'Registers a new immutable Audit record. There is no update/delete endpoint.',
  },
  get: {
    summary: 'Get an Audit record',
    description: 'Fetches a single Audit record by id.',
  },
} as const;
