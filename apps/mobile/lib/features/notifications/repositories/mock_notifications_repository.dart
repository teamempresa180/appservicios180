import '../../../chat/entities/chat.dart';
import '../../../notification/entities/notification.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../quote/entities/quote.dart';
import '../mock/mock_notifications_data.dart';
import 'notifications_repository.dart';

/// In-memory `NotificationsRepository` backed by fixed mock data. No
/// backend, no Firebase, no FCM, no OneSignal, no sockets, no HTTP —
/// see the feature README.
class MockNotificationsRepository implements NotificationsRepository {
  @override
  List<Notification> getNotifications() => List.unmodifiable(mockNotifications);

  @override
  Order? getOrderFor(Notification notification) =>
      mockNotificationOrders[notification.id];

  @override
  Payment? getPaymentFor(Notification notification) =>
      mockNotificationPayments[notification.id];

  @override
  Quote? getQuoteFor(Notification notification) =>
      mockNotificationQuotes[notification.id];

  @override
  Chat? getChatFor(Notification notification) =>
      mockNotificationChats[notification.id];
}
