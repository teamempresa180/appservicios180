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
/// [getPayment]/[getOrder] have no parameter — only used as a fallback
/// when the caller reaches this screen without already knowing which
/// [Order] to show (e.g. a direct/test navigation). The normal path
/// (tapping "Ver detalle" on an in-progress order, which already has
/// the real [Order] in hand) calls [getPaymentFor] instead — a real
/// per-order lookup, not a fixed record.
abstract class PaymentsRepository {
  Future<Payment> getPayment();
  Future<Order> getOrder();
  Future<Payment> getPaymentFor(Order order);
  Future<Quote> getQuoteFor(Payment payment);
  Future<Service> getServiceFor(Order order);
  Future<Provider> getProviderFor(Payment payment);
  Future<Profile> getProfileFor(Provider provider);
}
