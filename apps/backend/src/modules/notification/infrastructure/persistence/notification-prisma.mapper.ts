import { NotificationModel as PrismaNotification } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';

/**
 * Translates between the `Notification` domain entity and its Prisma
 * row shape (`NotificationModel`, mapped to the `notifications`
 * table). The only place in this module that imports from
 * `@prisma/client` — Domain/Application never do.
 */
export class NotificationPrismaMapper {
  static toDomain(row: PrismaNotification): Notification {
    return new Notification(NotificationId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      title: row.title,
      body: row.body,
      type: row.type as unknown as NotificationType,
      status: row.status as unknown as NotificationStatus,
      createdAt: row.createdAt,
      readAt: row.readAt,
    });
  }

  static toPersistence(notification: Notification): PrismaNotification {
    return {
      id: notification.id.value,
      identityId: notification.identityId.value,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      status: notification.status,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    };
  }
}
