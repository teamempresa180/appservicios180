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
  List<Order> getOrders() => List.unmodifiable(mockOrders);

  @override
  Service getServiceFor(Order order) => mockOrderServices[order.id]!;

  @override
  Provider getProviderFor(Order order) => mockOrderProviders[order.id]!;

  @override
  Profile getProfileFor(Order order) => mockOrderProfiles[order.id]!;

  @override
  Category getCategoryFor(Order order) => mockOrderCategories[order.id]!;

  @override
  Quote getQuoteFor(Order order) => mockOrderQuotes[order.id]!;
}
