import { AuthenticatedUser } from '../../../common/auth/authenticated-user.interface';
import { Role } from '../../../common/auth/role.enum';
import { ForbiddenException } from '../domain/exceptions/forbidden.exception';

/**
 * Ownership rules shared by the Use Cases of every module whose
 * records are personal data keyed by `IdentityId` (Address, Contact,
 * Audit, Attachment, Notification).
 *
 * Two distinct shapes are needed, and conflating them is what produced
 * the pre-hardening leak: a *listing* must be narrowed at the
 * repository (`ownershipScope`), while a *single record* already
 * fetched by id must be rejected after the fact (`assertOwnership`).
 * An `Admin` caller bypasses both — no code path issues that role
 * today, so in practice every caller is scoped to itself.
 */
export function isAdmin(caller: AuthenticatedUser): boolean {
  return caller.role === Role.Admin;
}

/**
 * The Identity a listing must be restricted to, or `undefined` for an
 * `Admin` — repositories treat `undefined` as "no ownership filter".
 */
export function ownershipScope(caller: AuthenticatedUser): string | undefined {
  return isAdmin(caller) ? undefined : caller.id;
}

/**
 * Throws `ForbiddenException` unless the caller owns the record.
 * `resource` names the entity in the error message (e.g. `'Address'`).
 */
export function assertOwnership(
  caller: AuthenticatedUser,
  ownerIdentityId: string,
  resource: string,
): void {
  if (isAdmin(caller)) {
    return;
  }
  if (ownerIdentityId !== caller.id) {
    throw new ForbiddenException(
      `${resource} does not belong to the authenticated Identity`,
    );
  }
}
