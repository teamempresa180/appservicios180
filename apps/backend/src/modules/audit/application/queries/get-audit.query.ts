import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Audit record by id. Plain data — no
 * behavior. `caller` is the authenticated user the ownership check is
 * made against in `GetAuditUseCase`.
 */
export class GetAuditQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
