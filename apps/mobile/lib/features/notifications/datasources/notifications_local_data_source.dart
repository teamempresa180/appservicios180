import '../../../chat/entities/chat.dart';
import '../../../notification/entities/notification.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../quote/entities/quote.dart';

/// Local (on-device) source for the domain entities the Notifications
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class NotificationsLocalDataSource {
  List<Notification> getNotifications();
  Order? getOrderFor(Notification notification);
  Payment? getPaymentFor(Notification notification);
  Quote? getQuoteFor(Notification notification);
  Chat? getChatFor(Notification notification);
}
