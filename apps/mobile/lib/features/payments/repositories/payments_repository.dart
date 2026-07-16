import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities the Payments screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no JSON.
/// Implemented today by `MockPaymentsRepository`; a future
/// `ApiPaymentsRepository` or `FirebasePaymentsRepository` would
/// implement this same interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// payment (see the feature README for why).
abstract class PaymentsRepository {
  Future<Payment> getPayment();
  Future<Order> getOrder();
  Future<Quote> getQuote();
  Future<Service> getService();
  Future<Provider> getProvider();
  Future<Profile> getProfile();
}
