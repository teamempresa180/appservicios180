import '../../../chat/entities/chat.dart';
import '../../../notification/entities/notification.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../quote/entities/quote.dart';

/// Remote (API/Firebase/push) source for the domain entities the
/// Notifications screen needs. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class NotificationsRemoteDataSource {
  Future<List<Notification>> getNotifications();
  Future<Order?> getOrderFor(Notification notification);
  Future<Payment?> getPaymentFor(Notification notification);
  Future<Quote?> getQuoteFor(Notification notification);
  Future<Chat?> getChatFor(Notification notification);
}
