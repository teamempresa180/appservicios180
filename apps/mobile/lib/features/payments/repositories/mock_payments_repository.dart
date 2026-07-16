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
class MockPaymentsRepository implements PaymentsRepository {
  @override
  Future<Payment> getPayment() => Future.value(mockPayment);

  @override
  Future<Order> getOrder() => Future.value(mockPaymentOrder);

  @override
  Future<Quote> getQuote() => Future.value(mockPaymentQuote);

  @override
  Future<Service> getService() => Future.value(mockPaymentService);

  @override
  Future<Provider> getProvider() => Future.value(mockPaymentProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockPaymentProfile);
}
