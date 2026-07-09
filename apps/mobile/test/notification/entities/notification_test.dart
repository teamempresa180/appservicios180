import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/notification/entities/notification.dart' as domain;
import 'package:mobile/notification/models/notification_id.dart';
import 'package:mobile/notification/models/notification_type.dart';
import 'package:mobile/notification/models/notification_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = NotificationId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final notification = domain.Notification(
      id: id,
      identityId: identityId,
      title: 'Nueva cotización recibida',
      body: 'Un proveedor envió una cotización para tu orden',
      type: NotificationType.info,
      status: NotificationStatus.unread,
      createdAt: now,
      readAt: null,
    );

    expect(notification.id, id);
    expect(notification.identityId, identityId);
    expect(notification.title, 'Nueva cotización recibida');
    expect(notification.type, NotificationType.info);
    expect(notification.status, NotificationStatus.unread);
    expect(notification.readAt, isNull);
  });

  test('is equal to another notification with the same id', () {
    final id = NotificationId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    domain.Notification build() => domain.Notification(
      id: id,
      identityId: identityId,
      title: 'Título',
      body: 'Cuerpo',
      type: NotificationType.system,
      status: NotificationStatus.read,
      createdAt: now,
      readAt: now,
    );

    expect(build(), equals(build()));
  });
}
