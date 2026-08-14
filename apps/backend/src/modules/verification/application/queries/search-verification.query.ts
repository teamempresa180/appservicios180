import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Verifications by a free-text term. Plain data — no
 * behavior. Carries the authenticated `caller`: results never reach
 * outside that caller's own Identity unless it is an Admin.
 */
export class SearchVerificationQuery {
  constructor(
    public readonly term: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
