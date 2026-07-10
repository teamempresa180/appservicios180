import '../../../chat/entities/chat.dart';
import '../../../notification/entities/notification.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../quote/entities/quote.dart';

/// Contract for reading the domain entities the Notifications screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`,
/// no JSON.
///
/// `Notification` has no foreign key to `Order`/`Payment`/`Quote`/
/// `Chat` in the domain — the `getXFor` methods return the related
/// entity only when the mock data pairs one with that notification
/// (see the feature README); a future real repository would resolve
/// this the same way a backend endpoint decides to enrich a
/// notification payload.
abstract class NotificationsRepository {
  List<Notification> getNotifications();
  Order? getOrderFor(Notification notification);
  Payment? getPaymentFor(Notification notification);
  Quote? getQuoteFor(Notification notification);
  Chat? getChatFor(Notification notification);
}
