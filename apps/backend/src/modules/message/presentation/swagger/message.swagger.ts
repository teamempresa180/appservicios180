/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Message controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas
 * and status codes are attached directly on each controller method
 * via `@ApiResponse`, following the convention established since
 * Sprint 4, Etapa 1. No Update endpoint (no `markAsRead`/
 * `markAsDelivered` either) — there is no corresponding Use Case in
 * the Application layer despite `MessageStatus` having `Delivered`/
 * `Read` members and `MessageDto.readAt`; only Send/Delete exist.
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
  list: {
    summary: 'List Messages',
    description: 'Lists Messages page by page.',
  },
  search: {
    summary: 'Search Messages',
    description: 'Free-text search over the message content.',
  },
} as const;
