import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationDto } from '../dto/notification.dto';
import { CreateNotificationCommand } from '../commands/create-notification.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  execute(command: CreateNotificationCommand): Promise<NotificationDto> {
    void this.notificationRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
