/**
 * Intent to attach an uploaded document's stored path to an existing
 * Verification. Plain data — no behavior. `documentPath` is the
 * relative path the file was already written to on disk (see
 * `LocalVerificationDocumentStorageService`); this command only carries
 * it through to persistence, it never touches file bytes itself.
 */
export class UploadVerificationDocumentCommand {
  constructor(
    public readonly id: string,
    public readonly documentPath: string,
  ) {}
}
