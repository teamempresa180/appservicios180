import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Audit records by a free-text term. Plain data — no
 * behavior. `caller` scopes the search to that Identity's own audit
 * trail, exactly like `ListAuditQuery`.
 */
export class SearchAuditQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly term: string,
  ) {}
}
