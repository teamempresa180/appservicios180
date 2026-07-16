import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';

/// Contract for reading the domain entities the Provider Dashboard
/// screen needs. Returns only real domain entities — no `Map`, no
/// `dynamic`, no JSON. Implemented today by
/// `MockProviderDashboardRepository` (in-memory) and
/// `HttpProviderDashboardRepository` (real backend, see the feature
/// README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// provider's dashboard (see the feature README for why).
abstract class ProviderDashboardRepository {
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<List<Order>> getOrders();
  Future<List<Quote>> getQuotes();
  Future<List<Review>> getReviews();
  Future<List<Payment>> getPayments();
}
