/**
 * Centralized Swagger metadata (summary/description only) for the Quote
 * controller. No business rules are documented here.
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
} as const;
