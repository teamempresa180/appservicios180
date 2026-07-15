/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Review controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`, following the convention established since
 * Sprint 4, Etapa 1. No publish/hide/archive endpoint — there is no
 * corresponding Use Case in the Application layer despite
 * `ReviewStatus` having `Published`/`Hidden`/`Archived` members;
 * `title`/`comment` are the only fields the `Update` endpoint
 * accepts.
 */
export const ReviewSwagger = {
  create: {
    summary: 'Create a Review',
    description: 'Registers a new Review.',
  },
  update: {
    summary: 'Update a Review',
    description: 'Updates the title/comment of an existing Review by id.',
  },
  delete: {
    summary: 'Delete a Review',
    description: 'Deletes an existing Review by id.',
  },
  get: {
    summary: 'Get a Review',
    description: 'Fetches a single Review by id.',
  },
  list: {
    summary: 'List Reviews',
    description: 'Lists Reviews page by page.',
  },
  search: {
    summary: 'Search Reviews',
    description: 'Free-text search over title/comment.',
  },
} as const;
