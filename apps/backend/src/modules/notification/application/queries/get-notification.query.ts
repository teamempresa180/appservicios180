import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Notification by id. Plain data — no
 * behavior. `caller` is the authenticated user the recipient check is
 * made against in `GetNotificationUseCase`.
 */
export class GetNotificationQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
