/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Payment controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`, following the convention established since
 * Sprint 4, Etapa 1. No Delete endpoint — there is no
 * `DeletePaymentUseCase` in the Application layer; `PUT
 * /payments/:id/cancel` is the only supported status transition
 * besides the generic `status`-only Update.
 */
export const PaymentSwagger = {
  create: {
    summary: 'Create a Payment',
    description: 'Registers a new Payment.',
  },
  update: {
    summary: 'Update a Payment',
    description: 'Updates the status of an existing Payment by id.',
  },
  cancel: {
    summary: 'Cancel a Payment',
    description: 'Cancels an existing Payment by id.',
  },
  get: {
    summary: 'Get a Payment',
    description: 'Fetches a single Payment by id.',
  },
  list: {
    summary: 'List Payments',
    description: 'Lists Payments page by page.',
  },
  search: {
    summary: 'Search Payments',
    description: 'Free-text search over the payment method.',
  },
} as const;
