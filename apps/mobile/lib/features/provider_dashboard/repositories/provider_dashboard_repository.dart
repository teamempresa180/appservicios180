import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';

/// Contract for reading the domain entities the Provider Dashboard
/// screen needs. Returns only real domain entities — no `Map`, no
/// `dynamic`, no JSON. Implemented today by
/// `MockProviderDashboardRepository`; a future
/// `ApiProviderDashboardRepository` would implement this same
/// interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// provider's dashboard (see the feature README for why).
abstract class ProviderDashboardRepository {
  Provider getProvider();
  Profile getProfile();
  List<Order> getOrders();
  List<Quote> getQuotes();
  List<Review> getReviews();
  List<Payment> getPayments();
}
