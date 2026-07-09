/**
 * Centralized Swagger metadata (summary/description only) for the
 * Notification controller. No business rules are documented here.
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
} as const;
