/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Attachment controller. No business rules are documented
 * here — only what the endpoint does at the HTTP level. Response
 * schemas and status codes are attached directly on each controller
 * method via `@ApiResponse`, following the convention established
 * since Sprint 4, Etapa 1. No Update endpoint and no status-transition
 * endpoint — there is no corresponding Use Case in the Application
 * layer despite `AttachmentStatus` having `Available`/`Failed`/
 * `Removed` members; only Create/Delete/Get/List/Search exist.
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
  list: {
    summary: 'List Attachments',
    description: 'Lists Attachments page by page.',
  },
  search: {
    summary: 'Search Attachments',
    description: 'Free-text search over the file name.',
  },
} as const;
