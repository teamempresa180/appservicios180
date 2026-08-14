import type { AuthenticatedUser } from '../../../common/auth/authenticated-user.interface';
import { Role } from '../../../common/auth/role.enum';

/**
 * Who is making the request, as the Application layer sees it.
 *
 * Deliberately *not* `AuthenticatedUser` (`src/common/auth`): that
 * type is the HTTP/Passport shape and carries a `Role` enum the
 * Application layer has no reason to know about. Use Cases only ever
 * need two facts to authorize a per-record decision — which Identity
 * is calling, and whether that caller may bypass ownership entirely —
 * so the Presentation layer flattens the role down to `isAdmin` when
 * it builds a command/query. Keeps ownership rules testable without
 * any Nest/Passport import in `application/`.
 */
export interface Caller {
  /** `Identity.id` of the authenticated user. */
  identityId: string;
  /** `true` only for `Role.Admin` — skips every ownership check. */
  isAdmin: boolean;
}

/**
 * Flattens the HTTP-layer `AuthenticatedUser` into a `Caller`. Lives
 * here rather than in `common/auth` so the single definition of "what
 * the Application layer knows about the caller" — the interface and
 * the one function that produces it — stays in one file. Only
 * imports `Role`, a plain enum with no framework dependency.
 */
export function toCaller(user: AuthenticatedUser): Caller {
  return { identityId: user.id, isAdmin: user.role === Role.Admin };
}
