import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class NotificationDto {
  id!: string;
  identityId!: string;
  title!: string;
  body!: string;
  type!: NotificationType;
  status!: NotificationStatus;
  createdAt!: Date;
  readAt!: Date | null;
}
