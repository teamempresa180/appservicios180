import { NotificationType } from '../../domain/value-objects/notification-type.value-object';

/**
 * Intent to create a new Notification. Plain data — no behavior.
 */
export class CreateNotificationCommand {
  constructor(
    public readonly identityId: string,
    public readonly title: string,
    public readonly body: string,
    public readonly type: NotificationType,
  ) {}
}
