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
  Future<List<Notification>> getNotifications() =>
      Future.value(List.unmodifiable(mockNotifications));

  @override
  Future<Order?> getOrderFor(Notification notification) =>
      Future.value(mockNotificationOrders[notification.id]);

  @override
  Future<Payment?> getPaymentFor(Notification notification) =>
      Future.value(mockNotificationPayments[notification.id]);

  @override
  Future<Quote?> getQuoteFor(Notification notification) =>
      Future.value(mockNotificationQuotes[notification.id]);

  @override
  Future<Chat?> getChatFor(Notification notification) =>
      Future.value(mockNotificationChats[notification.id]);
}
