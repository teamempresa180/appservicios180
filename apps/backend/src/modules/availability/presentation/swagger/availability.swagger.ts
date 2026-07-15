/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Availability controller. No business rules are documented
 * here — only what the endpoint does at the HTTP level. Response
 * schemas and status codes are attached directly on each controller
 * method via `@ApiResponse`/`@ApiBody`, following the convention
 * established in Sprint 4, Etapa 1 (Identity/Authentication/
 * Credentials).
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
  list: {
    summary: 'List Availabilities',
    description: 'Lists Availabilities page by page.',
  },
  search: {
    summary: 'Search Availabilities',
    description: 'Free-text search over type/status.',
  },
} as const;
