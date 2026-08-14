import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Notifications with pagination. Plain data — no
 * behavior. `caller` is the authenticated user the listing is scoped
 * to: a Notification's `identityId` is its recipient, so callers only
 * see what was addressed to them (an `Admin` caller sees every
 * Notification).
 */
export class ListNotificationQuery {
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
