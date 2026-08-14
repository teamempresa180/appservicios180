import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to delete an existing Notification. Plain data — no
 * behavior. `caller` is the authenticated user the recipient check is
 * made against in `DeleteNotificationUseCase`.
 */
export class DeleteNotificationCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
