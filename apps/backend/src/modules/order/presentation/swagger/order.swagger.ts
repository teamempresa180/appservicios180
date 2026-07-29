/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Order controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials). No
 * Delete endpoint — there is no `DeleteOrderUseCase` in the
 * Application layer. Status transitions: `cancel` (always allowed),
 * `start` (`Accepted` → `InProgress`) and `complete` (`InProgress` →
 * `Completed`) — `Pending` → `Accepted` happens as a side effect of
 * `PUT /quotes/:id/accept`, not a dedicated Order endpoint.
 */
export const OrderSwagger = {
  create: { summary: 'Create an Order', description: 'Registers a new Order.' },
  update: {
    summary: 'Update an Order',
    description: 'Updates an existing Order by id.',
  },
  cancel: {
    summary: 'Cancel an Order',
    description: 'Cancels an existing Order by id.',
  },
  start: {
    summary: 'Start an Order',
    description:
      'Marks an Accepted Order as InProgress (the provider began the work).',
  },
  complete: {
    summary: 'Complete an Order',
    description:
      'Marks an InProgress Order as Completed (the provider finished the work).',
  },
  get: {
    summary: 'Get an Order',
    description: 'Fetches a single Order by id.',
  },
  list: {
    summary: 'List Orders',
    description: 'Lists Orders page by page.',
  },
  search: {
    summary: 'Search Orders',
    description: 'Free-text search over title/description.',
  },
  mine: {
    summary: "List the caller's Orders",
    description: 'Lists every Order belonging to the authenticated client Identity.',
  },
  relevantForProvider: {
    summary: "List the caller's relevant Orders (as a Provider)",
    description:
      'Lists Orders directly hired to the authenticated Provider plus open requests in their Category.',
  },
} as const;
