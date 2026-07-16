/**
 * Roles recognized by `RolesGuard`. Deliberately not a persisted
 * field on `Identity` — the domain has no "role" concept of its own
 * (see Sprint 4, Etapa 7 audit). A role is derived at login time:
 * `Provider` if a `Provider` record exists for the authenticating
 * Identity, `Customer` otherwise. `Admin` is reserved for a future
 * prompt once the domain actually defines administrative accounts —
 * nothing in this codebase issues it yet.
 */
export enum Role {
  Customer = 'CUSTOMER',
  Provider = 'PROVIDER',
  Admin = 'ADMIN',
}
