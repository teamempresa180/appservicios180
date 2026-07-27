import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_payment_data.dart';
import 'payments_repository.dart';

/// In-memory `PaymentsRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
///
/// [getPaymentFor] stays the single fixed mock payment regardless of
/// which order was passed — this feature's mock data only models one
/// order/payment pair, unlike the real backend (`HttpPaymentsRepository`)
/// which genuinely filters `GET /payments` by `orderId`.
class MockPaymentsRepository implements PaymentsRepository {
  @override
  Future<Payment> getPayment() => Future.value(mockPayment);

  @override
  Future<Order> getOrder() => Future.value(mockPaymentOrder);

  @override
  Future<Payment> getPaymentFor(Order order) => Future.value(mockPayment);

  @override
  Future<Quote> getQuoteFor(Payment payment) => Future.value(mockPaymentQuote);

  @override
  Future<Service> getServiceFor(Order order) =>
      Future.value(mockPaymentService);

  @override
  Future<Provider> getProviderFor(Payment payment) =>
      Future.value(mockPaymentProvider);

  @override
  Future<Profile> getProfileFor(Provider provider) =>
      Future.value(mockPaymentProfile);
}
