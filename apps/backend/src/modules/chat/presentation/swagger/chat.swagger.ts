/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Chat controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`, following the convention established since
 * Sprint 4, Etapa 1. No Update/Delete endpoint — there is no
 * `UpdateChatUseCase`/`DeleteChatUseCase` in the Application layer;
 * `PUT /chats/:id/close` is the only supported status transition.
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
  list: {
    summary: 'List Chats',
    description: 'Lists Chats page by page.',
  },
  search: {
    summary: 'Search Chats',
    description: 'Free-text search over the chat type.',
  },
} as const;
