import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Verification by id. Plain data — no
 * behavior. Carries the authenticated `caller`: a Verification is only
 * readable by the Identity it belongs to, or by an Admin.
 */
export class GetVerificationQuery {
  constructor(
    public readonly id: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
