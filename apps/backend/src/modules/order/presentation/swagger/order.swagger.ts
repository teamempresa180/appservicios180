/**
 * Centralized Swagger metadata (summary/description only) for the Order
 * controller. No business rules are documented here.
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
} as const;
