import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_orders_data.dart';
import 'orders_repository.dart';

/// In-memory `OrdersRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockOrdersRepository implements OrdersRepository {
  @override
  Future<List<Order>> getOrders() => Future.value(List.unmodifiable(mockOrders));

  @override
  Future<Service> getServiceFor(Order order) =>
      Future.value(mockOrderServices[order.id]!);

  @override
  Future<Provider> getProviderFor(Order order) =>
      Future.value(mockOrderProviders[order.id]!);

  @override
  Future<Profile> getProfileFor(Order order) =>
      Future.value(mockOrderProfiles[order.id]!);

  @override
  Future<Category> getCategoryFor(Order order) =>
      Future.value(mockOrderCategories[order.id]!);

  @override
  Future<Quote> getQuoteFor(Order order) =>
      Future.value(mockOrderQuotes[order.id]!);
}
