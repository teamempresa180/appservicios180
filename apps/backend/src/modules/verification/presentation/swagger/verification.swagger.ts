/**
 * Centralized Swagger metadata (`@ApiOperation` summary/description)
 * for the Verification controller. No business rules are documented
 * here — only what the endpoint does at the HTTP level. Response
 * schemas and status codes are attached directly on each controller
 * method via `@ApiResponse`/`@ApiBody`, following the convention
 * established in Sprint 4, Etapa 1 (Identity/Authentication/
 * Credentials). No Delete endpoint — there is no
 * `DeleteVerificationUseCase` in the Application layer.
 */
export const VerificationSwagger = {
  create: {
    summary: 'Create a Verification',
    description: 'Registers a new Verification for an Identity.',
  },
  update: {
    summary: 'Update a Verification',
    description: 'Updates the status of an existing Verification by id.',
  },
  get: {
    summary: 'Get a Verification',
    description: 'Fetches a single Verification by id.',
  },
  list: {
    summary: 'List Verifications',
    description: 'Lists Verifications page by page.',
  },
  search: {
    summary: 'Search Verifications',
    description: 'Free-text search over type/status.',
  },
  uploadDocument: {
    summary: 'Upload a Verification document',
    description:
      'Uploads a supporting document (e.g. criminal-record check, certification) for an existing Verification and stores its path on the record. Accepts application/pdf, image/png, or image/jpeg.',
  },
} as const;
