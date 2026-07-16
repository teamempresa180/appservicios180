import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities the Orders screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no JSON.
/// Implemented today by `HttpOrdersRepository` (real backend) and
/// `MockOrdersRepository` (kept for tests/offline fallback, see the
/// feature README).
///
/// Unlike every other feature so far, this one already shows a **list**
/// of orders (not a single fixed record) — but still no id-based
/// lookup for a single order's detail.
abstract class OrdersRepository {
  Future<List<Order>> getOrders();
  Future<Service> getServiceFor(Order order);
  Future<Provider> getProviderFor(Order order);
  Future<Profile> getProfileFor(Order order);
  Future<Category> getCategoryFor(Order order);
  Future<Quote> getQuoteFor(Order order);
}
