/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Order controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`/`@ApiBody`, following the convention established
 * in Sprint 4, Etapa 1 (Identity/Authentication/Credentials). No
 * Delete endpoint — there is no `DeleteOrderUseCase` in the
 * Application layer; `PUT /orders/:id/cancel` is the only supported
 * status transition.
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
} as const;
