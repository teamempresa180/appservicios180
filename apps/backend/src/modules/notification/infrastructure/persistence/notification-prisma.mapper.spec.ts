import { NotificationModel as PrismaNotification } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { NotificationPrismaMapper } from './notification-prisma.mapper';

describe('NotificationPrismaMapper', () => {
  const row: PrismaNotification = {
    id: 'id-1',
    identityId: 'identity-1',
    title: 'Your order was accepted',
    body: 'Provider accepted your order request.',
    type: 'INFO',
    status: 'UNREAD',
    createdAt: new Date('2024-01-01'),
    readAt: null,
  };

  it('maps a Prisma row to the domain entity', () => {
    const notification = NotificationPrismaMapper.toDomain(row);

    expect(notification.id.value).toBe('id-1');
    expect(notification.identityId.value).toBe('identity-1');
    expect(notification.status).toBe(NotificationStatus.Unread);
    expect(notification.type).toBe(NotificationType.Info);
    expect(notification.readAt).toBeNull();
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const notification = new Notification(NotificationId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      title: 'Your order was accepted',
      body: 'Provider accepted your order request.',
      type: NotificationType.Info,
      status: NotificationStatus.Unread,
      createdAt: new Date('2024-01-01'),
      readAt: null,
    });

    expect(NotificationPrismaMapper.toPersistence(notification)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const notification = NotificationPrismaMapper.toDomain(row);
    expect(NotificationPrismaMapper.toPersistence(notification)).toEqual(row);
  });
});
