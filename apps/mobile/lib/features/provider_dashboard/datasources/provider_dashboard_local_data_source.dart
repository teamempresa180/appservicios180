import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';

/// Local (on-device) source for the domain entities the Provider
/// Dashboard screen needs. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ProviderDashboardLocalDataSource {
  Provider getProvider();
  Profile getProfile();
  List<Order> getOrders();
  List<Quote> getQuotes();
  List<Review> getReviews();
  List<Payment> getPayments();
}
