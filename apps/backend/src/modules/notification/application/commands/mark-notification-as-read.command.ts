import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to mark an existing Notification as read. Plain data — no
 * behavior. `caller` is the authenticated user the recipient check is
 * made against in `MarkNotificationAsReadUseCase`: only the addressee
 * can clear their own unread badge.
 */
export class MarkNotificationAsReadCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
