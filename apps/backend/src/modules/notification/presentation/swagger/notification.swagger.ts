/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Notification controller. No business rules are documented
 * here — only what the endpoint does at the HTTP level. Response
 * schemas and status codes are attached directly on each controller
 * method via `@ApiResponse`, following the convention established
 * since Sprint 4, Etapa 1. No Update endpoint — there is no
 * `UpdateNotificationUseCase` in the Application layer; `PUT
 * /notifications/:id/read` is the only supported status transition
 * (no archive endpoint despite `NotificationStatus.Archived`).
 */
export const NotificationSwagger = {
  create: {
    summary: 'Create a Notification',
    description: 'Registers a new Notification for an Identity.',
  },
  markAsRead: {
    summary: 'Mark a Notification as read',
    description: 'Marks an existing Notification as read.',
  },
  delete: {
    summary: 'Delete a Notification',
    description: 'Deletes an existing Notification by id.',
  },
  get: {
    summary: 'Get a Notification',
    description: 'Fetches a single Notification by id.',
  },
  list: {
    summary: 'List Notifications',
    description: 'Lists Notifications page by page.',
  },
  search: {
    summary: 'Search Notifications',
    description: 'Free-text search over title/body.',
  },
} as const;
