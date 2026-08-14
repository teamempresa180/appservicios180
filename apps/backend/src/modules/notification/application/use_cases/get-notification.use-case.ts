import { assertOwnership } from '../../../core/application/ownership';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';
import { GetNotificationQuery } from '../queries/get-notification.query';

/**
 * Fetches a single Notification by id, returning `null` when not
 * found — matches the `Promise<NotificationDto | null>` signature
 * already declared for this use case, which
 * `NotificationController` turns into a 404. A found Notification
 * addressed to another Identity raises `ForbiddenException`, so a
 * guessed id cannot be used to read someone else's inbox.
 */
export class GetNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: GetNotificationQuery): Promise<NotificationDto | null> {
    const notification = await this.notificationRepository.findById(
      NotificationId.fromString(query.id),
    );
    if (!notification) {
      return null;
    }
    assertOwnership(
      query.caller,
      notification.identityId.value,
      'Notification',
    );
    return NotificationMapper.toDto(notification);
  }
}
