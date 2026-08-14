import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to attach an uploaded document's stored path to an existing
 * Verification. Plain data — no behavior. `documentPath` is the
 * relative path the file was already written to on disk (see
 * `LocalVerificationDocumentStorageService`); this command only carries
 * it through to persistence, it never touches file bytes itself.
 * Carries the authenticated `caller`: a document may only be attached
 * to the caller's own Verification.
 */
export class UploadVerificationDocumentCommand {
  constructor(
    public readonly id: string,
    public readonly documentPath: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
