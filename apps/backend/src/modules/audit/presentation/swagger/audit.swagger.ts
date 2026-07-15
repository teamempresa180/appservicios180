/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Audit controller. No business rules are documented here —
 * only what the endpoint does at the HTTP level. Response schemas and
 * status codes are attached directly on each controller method via
 * `@ApiResponse`/`@ApiBody`, following the convention established in
 * Sprint 4, Etapa 1 (Identity/Authentication/Credentials). No
 * Update/Delete endpoint — audit records are immutable by design (no
 * `UpdateAuditRecordUseCase`/`DeleteAuditRecordUseCase` exist in the
 * Application layer).
 */
export const AuditSwagger = {
  create: {
    summary: 'Create an Audit record',
    description:
      'Registers a new immutable Audit record. There is no update/delete endpoint.',
  },
  get: {
    summary: 'Get an Audit record',
    description: 'Fetches a single Audit record by id.',
  },
  list: {
    summary: 'List Audit records',
    description: 'Lists Audit records page by page.',
  },
  search: {
    summary: 'Search Audit records',
    description: 'Free-text search over description/actionType.',
  },
} as const;
