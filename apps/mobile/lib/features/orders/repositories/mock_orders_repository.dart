import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_orders_data.dart';
import 'orders_repository.dart';

/// In-memory `OrdersRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README. Keeps its own
/// mutable copy of [mockOrders] (same pattern as
/// `MockProfileRepository`'s `_profile` field) so [acceptOrder]/
/// [rejectOrder] actually change what [getOrders] returns afterwards.
class MockOrdersRepository implements OrdersRepository {
  final List<Order> _orders = List.of(mockOrders);

  @override
  Future<List<Order>> getOrders() => Future.value(List.unmodifiable(_orders));

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

  @override
  Future<Profile> getClientProfileFor(Order order) =>
      Future.value(mockOrderClientProfiles[order.id]!);

  Order _replace(Order order, OrderStatus status) {
    final updated = order.copyWith(status: status);
    final index = _orders.indexWhere((existing) => existing.id == order.id);
    if (index != -1) _orders[index] = updated;
    return updated;
  }

  @override
  Future<Order> acceptOrder(Order order) =>
      Future.value(_replace(order, OrderStatus.accepted));

  @override
  Future<Order> rejectOrder(Order order) =>
      Future.value(_replace(order, OrderStatus.rejected));
}
