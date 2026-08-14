import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { DeleteNotificationCommand } from '../commands/delete-notification.command';

/**
 * Deletes an existing Notification addressed to the caller. No
 * cascade rule is documented — same criterion as every other
 * `Delete*UseCase`.
 */
export class DeleteNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(command: DeleteNotificationCommand): Promise<void> {
    const id = NotificationId.fromString(command.id);
    const existing = await this.notificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Notification ${command.id} not found`);
    }
    assertOwnership(command.caller, existing.identityId.value, 'Notification');
    await this.notificationRepository.delete(id);
  }
}
