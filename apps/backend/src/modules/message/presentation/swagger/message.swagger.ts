/**
 * Centralized Swagger metadata (summary/description only) for the Message
 * controller. No business rules are documented here.
 */
export const MessageSwagger = {
  send: {
    summary: 'Send a Message',
    description: 'Sends a new Message in a Chat.',
  },
  delete: {
    summary: 'Delete a Message',
    description: 'Deletes an existing Message by id.',
  },
  get: {
    summary: 'Get a Message',
    description: 'Fetches a single Message by id.',
  },
} as const;
