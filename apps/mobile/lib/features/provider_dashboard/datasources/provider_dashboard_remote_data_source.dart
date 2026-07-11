import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';

/// Remote (API/Firebase) source for the domain entities the Provider
/// Dashboard screen needs. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ProviderDashboardRemoteDataSource {
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<List<Order>> getOrders();
  Future<List<Quote>> getQuotes();
  Future<List<Review>> getReviews();
  Future<List<Payment>> getPayments();
}
