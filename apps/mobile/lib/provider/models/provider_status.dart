/// The lifecycle status of a Provider record. [pending] is the status
/// every newly-created Provider starts in; [inReview] while staff is
/// reviewing its submitted verification documents (criminal record +
/// certification); [active] once approved (the only status that
/// grants the Provider role — see backend `login.use-case.ts`); or
/// [rejected] if verification fails. [suspended]/[blocked] apply to a
/// previously [active] provider (temporary vs. permanent removal);
/// [inactive] is the provider's own voluntary pause; [archived] is
/// soft-delete. Mirrors the backend `ProviderStatus` enum 1:1.
enum ProviderStatus {
  pending,
  inReview,
  active,
  rejected,
  inactive,
  suspended,
  blocked,
  archived,
}
