import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { CreateNotificationCommand } from '../commands/create-notification.command';

/**
 * Structural validation for Notification commands — required fields,
 * well-formed values. No `validateUpdate`: no
 * `UpdateNotificationCommand` exists in the skeleton, only
 * Create/MarkAsRead/Delete.
 */
export class NotificationValidator {
  static validateCreate(command: CreateNotificationCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!command.title?.trim()) {
      throw new ValidationException('title is required');
    }
    if (!command.body?.trim()) {
      throw new ValidationException('body is required');
    }
    if (!Object.values(NotificationType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(NotificationType).join(', ')}`,
      );
    }
  }
}
