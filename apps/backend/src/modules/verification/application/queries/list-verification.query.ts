import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Verifications with pagination. Plain data — no
 * behavior. Carries the authenticated `caller`: the listing is scoped
 * to that caller's own Identity unless it is an Admin.
 */
export class ListVerificationQuery {
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
