import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Notifications by a free-text term. Plain data — no
 * behavior. `caller` scopes the search to that Identity's own inbox,
 * exactly like `ListNotificationQuery` — a notification body quotes
 * order details, names and prices.
 */
export class SearchNotificationQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly term: string,
  ) {}
}
