import '../../../chat/entities/chat.dart';
import '../../../notification/entities/notification.dart';
import '../../../notification/models/notification_status.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../quote/entities/quote.dart';

/// The category a notification relates to. **Derived** from which
/// related entity is present (see [NotificationDisplay.category]) — a
/// plain UI-classification enum, not a domain concept. Resolving an
/// actual `IconData`/`Color` for each value is `notification_icon.dart`'s
/// job alone; nothing here stores an icon or a color.
enum NotificationCategory { order, payment, quote, chat, system }

/// Presentation-only composition of everything a Notifications card
/// needs. Composes a real `Notification` plus, when relevant, the real
/// `Order`/`Payment`/`Quote`/`Chat` it relates to — **at most one of
/// these four is non-null per notification**, since the domain
/// `Notification` entity has no foreign key to any of them (it only
/// carries `identityId`, per its own class doc: "no channels, no
/// delivery logic"). The association between a mock notification and
/// its related entity is a **mock-only, presentation-level pairing**
/// (set up in `mock_notifications_data.dart`), not a real domain
/// relationship — see the feature README.
///
/// - [category]: **derived** from which of [order]/[payment]/[quote]/
///   [chat] is non-null (falls back to `NotificationCategory.system`
///   when none is). Used by `NotificationIcon`/`NotificationActions` to
///   pick an icon and an action label — never stored as a `Color` or
///   `IconData` here.
/// - [isUnread]: **derived**, not simulated — direct passthrough of
///   `Notification.status != NotificationStatus.read` (equivalently,
///   `Notification.readAt == null` for `unread`/`archived`).
/// - [timeAgo]: **derived**, not simulated — computed here from the
///   real `Notification.createdAt` against a fixed reference instant
///   (see `mock_notifications_data.dart`), the same judgment call
///   already documented for `OrderDisplay.scheduledDate` and
///   `PaymentDisplay.paymentDate`: no second, fabricated timestamp.
/// - [actionLabel]: **UI-derived** from [category] — a plain label
///   (e.g. "Ver orden"), not a stored field.
///
/// `Notification.title`/`Notification.body` are real domain fields —
/// used directly as the card's título/descripción, never duplicated
/// under new names.
///
/// Nothing here is added to the domain entities themselves.
class NotificationDisplay {
  const NotificationDisplay({
    required this.notification,
    this.order,
    this.payment,
    this.quote,
    this.chat,
    required this.timeAgo,
  });

  final Notification notification;
  final Order? order;
  final Payment? payment;
  final Quote? quote;
  final Chat? chat;

  /// Derived — see the class doc.
  final String timeAgo;

  /// Real domain data (`Notification.title`).
  String get title => notification.title;

  /// Real domain data (`Notification.body`).
  String get description => notification.body;

  /// Derived — see the class doc.
  bool get isUnread => notification.status != NotificationStatus.read;

  /// Derived — see the class doc.
  NotificationCategory get category {
    if (order != null) return NotificationCategory.order;
    if (payment != null) return NotificationCategory.payment;
    if (quote != null) return NotificationCategory.quote;
    if (chat != null) return NotificationCategory.chat;
    return NotificationCategory.system;
  }

  /// UI label derived from [category] — see the class doc.
  String get actionLabel {
    switch (category) {
      case NotificationCategory.order:
        return 'Ver orden';
      case NotificationCategory.payment:
        return 'Ver pago';
      case NotificationCategory.quote:
        return 'Ver cotización';
      case NotificationCategory.chat:
        return 'Ver mensaje';
      case NotificationCategory.system:
        return 'Ver más';
    }
  }
}
