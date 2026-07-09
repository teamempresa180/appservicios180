/**
 * Centralized Swagger metadata (summary/description only) for the Payment
 * controller. No business rules are documented here.
 */
export const PaymentSwagger = {
  create: {
    summary: 'Create a Payment',
    description: 'Registers a new Payment.',
  },
  update: {
    summary: 'Update a Payment',
    description: 'Updates an existing Payment by id.',
  },
  cancel: {
    summary: 'Cancel a Payment',
    description: 'Cancels an existing Payment by id.',
  },
  get: {
    summary: 'Get a Payment',
    description: 'Fetches a single Payment by id.',
  },
} as const;
