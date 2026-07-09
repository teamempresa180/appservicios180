/**
 * Centralized Swagger metadata (summary/description only) for the
 * Attachment controller. No business rules are documented here.
 */
export const AttachmentSwagger = {
  create: {
    summary: 'Create an Attachment',
    description: 'Registers a new file Attachment for a Message.',
  },
  delete: {
    summary: 'Delete an Attachment',
    description: 'Deletes an existing Attachment by id.',
  },
  get: {
    summary: 'Get an Attachment',
    description: 'Fetches a single Attachment by id.',
  },
} as const;
