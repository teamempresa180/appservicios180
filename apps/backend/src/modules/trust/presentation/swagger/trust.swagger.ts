/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Trust controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas and
 * status codes are attached directly on each controller method via
 * `@ApiResponse`/`@ApiBody`, following the convention established in
 * Sprint 4, Etapa 1 (Identity/Authentication/Credentials). No Delete
 * endpoint — there is no `DeleteTrustProfileUseCase` in the
 * Application layer.
 */
export const TrustSwagger = {
  create: {
    summary: 'Create a Trust profile',
    description:
      'Registers a new Trust profile for an Identity. An Identity may have at most one Trust profile.',
  },
  update: {
    summary: 'Update a Trust profile',
    description: 'Updates an existing Trust profile by id.',
  },
  get: {
    summary: 'Get a Trust profile',
    description: 'Fetches a single Trust profile by id.',
  },
  list: {
    summary: 'List Trust profiles',
    description: 'Lists Trust profiles page by page.',
  },
  search: {
    summary: 'Search Trust profiles',
    description: 'Free-text search over level/status.',
  },
} as const;
