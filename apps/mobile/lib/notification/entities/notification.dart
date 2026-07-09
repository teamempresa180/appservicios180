import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/notification_id.dart';
import '../models/notification_type.dart';
import '../models/notification_status.dart';

/// Represents a notification sent by the system to an Identity.
/// Pure data holder — no FCM, no APNs, no email, no SMS, no push, no
/// channels, no delivery logic, no persistence, no business rules.
class Notification extends Entity<NotificationId> {
  const Notification({
    required NotificationId id,
    required this.identityId,
    required this.title,
    required this.body,
    required this.type,
    required this.status,
    required this.createdAt,
    required this.readAt,
  }) : super(id);

  final IdentityId identityId;
  final String title;
  final String body;
  final NotificationType type;
  final NotificationStatus status;
  final DateTime createdAt;
  final DateTime? readAt;
}
