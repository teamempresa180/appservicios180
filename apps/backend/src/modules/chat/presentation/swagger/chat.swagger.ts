/**
 * Centralized Swagger metadata (summary/description only) for the Chat
 * controller. No business rules are documented here.
 */
export const ChatSwagger = {
  create: {
    summary: 'Create a Chat',
    description: 'Opens a new Chat for an Order.',
  },
  close: {
    summary: 'Close a Chat',
    description: 'Closes an existing Chat by id.',
  },
  get: { summary: 'Get a Chat', description: 'Fetches a single Chat by id.' },
} as const;
