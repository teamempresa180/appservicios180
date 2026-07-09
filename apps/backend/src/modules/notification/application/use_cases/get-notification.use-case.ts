import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationDto } from '../dto/notification.dto';
import { GetNotificationQuery } from '../queries/get-notification.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  execute(query: GetNotificationQuery): Promise<NotificationDto | null> {
    void this.notificationRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
