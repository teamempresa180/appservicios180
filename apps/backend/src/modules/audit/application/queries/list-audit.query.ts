import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Audit records with pagination. Plain data — no
 * behavior. `caller` is the authenticated user the listing is scoped
 * to: an Identity reads its own audit trail, and only an `Admin` reads
 * the whole system's.
 */
export class ListAuditQuery {
  public readonly page: number;
  public readonly pageSize: number;

  constructor(
    public readonly caller: AuthenticatedUser,
    page: number = 1,
    pageSize: number = 20,
  ) {
    this.page = normalizePage(page);
    this.pageSize = normalizePageSize(pageSize);
  }
}
