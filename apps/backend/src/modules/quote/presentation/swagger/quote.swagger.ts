/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Quote controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials). No
 * Delete endpoint — there is no `DeleteQuoteUseCase` in the
 * Application layer; `accept`/`reject` are the only supported status
 * transitions.
 */
export const QuoteSwagger = {
  create: { summary: 'Create a Quote', description: 'Registers a new Quote.' },
  update: {
    summary: 'Update a Quote',
    description: 'Updates an existing Quote by id.',
  },
  accept: {
    summary: 'Accept a Quote',
    description: 'Accepts an existing Quote by id.',
  },
  reject: {
    summary: 'Reject a Quote',
    description: 'Rejects an existing Quote by id.',
  },
  get: { summary: 'Get a Quote', description: 'Fetches a single Quote by id.' },
  list: {
    summary: 'List Quotes',
    description: 'Lists Quotes page by page.',
  },
  search: {
    summary: 'Search Quotes',
    description: 'Free-text search over notes.',
  },
} as const;
