import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';
import { GetNotificationQuery } from '../queries/get-notification.query';

/**
 * Fetches a single Notification by id, returning `null` when not
 * found — matches the `Promise<NotificationDto | null>` signature
 * already declared for this use case.
 */
export class GetNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: GetNotificationQuery): Promise<NotificationDto | null> {
    const notification = await this.notificationRepository.findById(
      NotificationId.fromString(query.id),
    );
    return notification ? NotificationMapper.toDto(notification) : null;
  }
}
