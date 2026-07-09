import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { DeleteNotificationCommand } from '../commands/delete-notification.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  execute(command: DeleteNotificationCommand): Promise<void> {
    void this.notificationRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
