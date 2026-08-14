import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Contacts with pagination. Plain data — no behavior.
 * `caller` is the authenticated user the listing is scoped to:
 * `ListContactUseCase` only returns that Identity's own contact
 * channels (an `Admin` caller sees every Contact).
 */
export class ListContactQuery {
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
