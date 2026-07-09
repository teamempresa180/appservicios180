import { NotificationType } from '../../domain/value-objects/notification-type.value-object';

/**
 * Input shape for creating a Notification. No validation.
 */
export class CreateNotificationDto {
  identityId!: string;
  title!: string;
  body!: string;
  type!: NotificationType;
}
