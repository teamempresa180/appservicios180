/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Schedule controller. No business rules are documented here
 * — only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials).
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
  list: {
    summary: 'List Schedule blocks',
    description: 'Lists Schedule blocks page by page.',
  },
  search: {
    summary: 'Search Schedule blocks',
    description: 'Free-text search over type/status.',
  },
} as const;
