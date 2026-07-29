/**
 * The lifecycle status of a Provider record.
 *
 * Approval pipeline (new applicants): `Pending` (just applied) →
 * `InReview` (staff reviewing submitted verification documents) →
 * `Active` (approved, operating — this is the only status that grants
 * the `Provider` role, see `login.use-case.ts`) or `Rejected`
 * (verification failed). `Suspended`/`Blocked` apply to a previously
 * `Active` provider (temporary vs. permanent removal); `Inactive` is
 * the provider's own voluntary pause; `Archived` is soft-delete.
 * `Blocked` and `InReview`/`Rejected` are additive — existing rows and
 * behavior (`Active` gating the role) are unchanged.
 */
export enum ProviderStatus {
  Pending = 'PENDING',
  InReview = 'IN_REVIEW',
  Active = 'ACTIVE',
  Rejected = 'REJECTED',
  Inactive = 'INACTIVE',
  Suspended = 'SUSPENDED',
  Blocked = 'BLOCKED',
  Archived = 'ARCHIVED',
}
