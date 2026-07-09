import { Notification } from './notification.entity';
import { NotificationId } from '../value-objects/notification-id.value-object';
import { NotificationType } from '../value-objects/notification-type.value-object';
import { NotificationStatus } from '../value-objects/notification-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Notification', () => {
  it('holds all the assigned properties', () => {
    const id = NotificationId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const notification = new Notification(id, {
      identityId,
      title: 'Nueva cotización recibida',
      body: 'Un proveedor envió una cotización para tu orden',
      type: NotificationType.Info,
      status: NotificationStatus.Unread,
      createdAt: now,
      readAt: null,
    });

    expect(notification.id).toBe(id);
    expect(notification.identityId).toBe(identityId);
    expect(notification.title).toBe('Nueva cotización recibida');
    expect(notification.type).toBe(NotificationType.Info);
    expect(notification.status).toBe(NotificationStatus.Unread);
    expect(notification.readAt).toBeNull();
  });

  it('is equal to another notification with the same id', () => {
    const id = NotificationId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const props = {
      identityId,
      title: 'Título',
      body: 'Cuerpo',
      type: NotificationType.System,
      status: NotificationStatus.Read,
      createdAt: now,
      readAt: now,
    };
    const a = new Notification(id, props);
    const b = new Notification(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
