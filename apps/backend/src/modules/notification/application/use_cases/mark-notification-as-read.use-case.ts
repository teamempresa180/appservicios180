import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationDto } from '../dto/notification.dto';
import { MarkNotificationAsReadCommand } from '../commands/mark-notification-as-read.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class MarkNotificationAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  execute(command: MarkNotificationAsReadCommand): Promise<NotificationDto> {
    void this.notificationRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
