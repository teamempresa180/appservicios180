import { Notification } from '../../domain/entities/notification.entity';
import { NotificationDto } from '../dto/notification.dto';

/**
 * Translates between the Notification domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class NotificationMapper {
  static toDto(notification: Notification): NotificationDto {
    const dto = new NotificationDto();
    dto.id = notification.id.value;
    dto.identityId = notification.identityId.value;
    dto.title = notification.title;
    dto.body = notification.body;
    dto.type = notification.type;
    dto.status = notification.status;
    dto.createdAt = notification.createdAt;
    dto.readAt = notification.readAt;
    return dto;
  }
}
