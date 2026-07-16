import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../notification/entities/notification.dart';
import '../../mock/mock_notifications_data.dart';
import '../../models/notification_display.dart';
import '../../repositories/notifications_repository.dart';

enum NotificationsLoadStatus { loading, success, error }

/// Relative-time label for a notification's real `createdAt` against a
/// fixed reference "now" (`mockNotificationsNow`) — there is no live
/// clock here yet, see the feature README.
String _timeAgo(DateTime from, DateTime now) {
  final difference = now.difference(from);
  if (difference.inMinutes < 1) return 'Ahora mismo';
  if (difference.inMinutes < 60) return 'Hace ${difference.inMinutes} min';
  if (difference.inHours < 24) return 'Hace ${difference.inHours} h';
  return 'Hace ${difference.inDays} días';
}

/// Owns the async load of [NotificationsPage]'s data against the real
/// [NotificationsRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). `getOrderFor`/`getPaymentFor`/
/// `getQuoteFor`/`getChatFor` always resolve to `null` on the HTTP
/// repository (no real domain relation exists — see
/// `HttpNotificationsRepository`'s own doc comment), so every
/// [NotificationDisplay] built here ends up in the `system` category
/// until a future prompt adds a real relation.
class NotificationsViewModel extends ChangeNotifier {
  NotificationsViewModel(this._repository);

  final NotificationsRepository _repository;

  NotificationsLoadStatus _status = NotificationsLoadStatus.loading;
  List<NotificationDisplay> _notifications = const [];
  String? _errorMessage;

  NotificationsLoadStatus get status => _status;
  List<NotificationDisplay> get notifications => _notifications;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = NotificationsLoadStatus.loading;
    notifyListeners();
    try {
      final notifications = await _repository.getNotifications();
      _notifications = await Future.wait(notifications.map(_buildDisplay));
      _status = NotificationsLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = NotificationsLoadStatus.error;
    }
    notifyListeners();
  }

  Future<NotificationDisplay> _buildDisplay(Notification notification) async {
    final order = await _repository.getOrderFor(notification);
    final payment = await _repository.getPaymentFor(notification);
    final quote = await _repository.getQuoteFor(notification);
    final chat = await _repository.getChatFor(notification);
    return NotificationDisplay(
      notification: notification,
      order: order,
      payment: payment,
      quote: quote,
      chat: chat,
      timeAgo: _timeAgo(notification.createdAt, mockNotificationsNow),
    );
  }

  Future<void> retry() => load();
}
