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
  Payment getPayment() => mockPayment;

  @override
  Order getOrder() => mockPaymentOrder;

  @override
  Quote getQuote() => mockPaymentQuote;

  @override
  Service getService() => mockPaymentService;

  @override
  Provider getProvider() => mockPaymentProvider;

  @override
  Profile getProfile() => mockPaymentProfile;
}
