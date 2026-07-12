import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { CreateNotificationCommand } from '../commands/create-notification.command';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationValidator } from '../validators/notification.validator';

/**
 * Creates a new Notification for an Identity, always in `Unread`
 * status with `readAt` unset. Depends on `IdentityRepository` to
 * verify the referenced Identity exists before creating the
 * notification — Identity already has Infrastructure since Sprint 3
 * Etapa 2, so this check is not deferred.
 */
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateNotificationCommand): Promise<NotificationDto> {
    NotificationValidator.validateCreate(command);

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const notification = new Notification(NotificationId.create(), {
      identityId,
      title: command.title,
      body: command.body,
      type: command.type,
      status: NotificationStatus.Unread,
      createdAt: new Date(),
      readAt: null,
    });

    await this.notificationRepository.save(notification);
    return NotificationMapper.toDto(notification);
  }
}
