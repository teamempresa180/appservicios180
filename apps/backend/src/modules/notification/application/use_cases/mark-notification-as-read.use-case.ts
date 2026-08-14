import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { MarkNotificationAsReadCommand } from '../commands/mark-notification-as-read.command';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

/**
 * Marks an existing Notification as read, transitioning it to `Read`
 * status and setting `readAt`. No prior-status guard — same criterion
 * as `CancelOrderUseCase`, which applies the change unconditionally
 * to any found entity.
 *
 * Only the recipient may mark their own Notification as read — the
 * read state belongs to the addressee, and letting anyone flip it
 * would let one user hide another's alerts.
 */
export class MarkNotificationAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    command: MarkNotificationAsReadCommand,
  ): Promise<NotificationDto> {
    const id = NotificationId.fromString(command.id);
    const existing = await this.notificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Notification ${command.id} not found`);
    }
    assertOwnership(command.caller, existing.identityId.value, 'Notification');

    const read = new Notification(existing.id, {
      identityId: existing.identityId,
      title: existing.title,
      body: existing.body,
      type: existing.type,
      status: NotificationStatus.Read,
      createdAt: existing.createdAt,
      readAt: new Date(),
    });

    await this.notificationRepository.save(read);
    return NotificationMapper.toDto(read);
  }
}
