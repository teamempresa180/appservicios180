import 'package:dio/dio.dart';

import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_id.dart';
import '../../../quote/models/quote_status.dart';
import '../../../quote/models/quote_type.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_orders_data.dart';
import '../mock/mock_provider_requests_data.dart';
import 'orders_repository.dart';

/// In-memory `OrdersRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README. Keeps its own
/// mutable copy of [mockOrders] (same pattern as
/// `MockProfileRepository`'s `_profile` field) so [rejectOrder]/
/// [cancelOrder] actually change what [getOrders] returns afterwards,
/// plus a separate mutable copy of [mockProviderRequestOrders]/
/// [mockProviderRequestQuotes] (see `mock_provider_requests_data.dart`)
/// for the provider-facing methods ([getRelevantOrders] onward), kept
/// independent so neither feature's fixtures/tests affect the other's.
class MockOrdersRepository implements OrdersRepository {
  final List<Order> _orders = List.of(mockOrders);
  final List<Order> _relevantOrders = List.of(mockProviderRequestOrders);
  final List<Quote> _providerQuotes = List.of(mockProviderRequestQuotes);

  @override
  Future<List<Order>> getOrders({CancelToken? cancelToken}) =>
      Future.value(List.unmodifiable(_orders));

  @override
  Future<Service> getServiceFor(Order order, {CancelToken? cancelToken}) =>
      Future.value(
        mockOrderServices[order.id] ?? mockProviderRequestServices[order.id]!,
      );

  @override
  Future<Provider> getProviderFor(Order order, {CancelToken? cancelToken}) =>
      Future.value(mockOrderProviders[order.id] ?? mockOrdersProvider);

  @override
  Future<Profile> getProfileFor(Order order, {CancelToken? cancelToken}) =>
      Future.value(mockOrderProfiles[order.id] ?? mockOrdersProfile);

  @override
  Future<Category> getCategoryFor(Order order, {CancelToken? cancelToken}) =>
      Future.value(
        mockOrderCategories[order.id] ??
            mockProviderRequestCategories[order.id]!,
      );

  @override
  Future<Quote> getQuoteFor(Order order, {CancelToken? cancelToken}) =>
      Future.value(
        mockOrderQuotes[order.id] ??
            _providerQuotes.firstWhere((quote) => quote.orderId == order.id),
      );

  @override
  Future<Profile> getClientProfileFor(Order order) => Future.value(
    mockOrderClientProfiles[order.id] ??
        mockProviderRequestClientProfiles[order.id]!,
  );

  Order _replace(Order order, OrderStatus status) {
    final updated = order.copyWith(status: status);
    final ordersIndex = _orders.indexWhere(
      (existing) => existing.id == order.id,
    );
    if (ordersIndex != -1) {
      _orders[ordersIndex] = updated;
      return updated;
    }
    final relevantIndex = _relevantOrders.indexWhere(
      (existing) => existing.id == order.id,
    );
    if (relevantIndex != -1) _relevantOrders[relevantIndex] = updated;
    return updated;
  }

  @override
  Future<Order> rejectOrder(Order order) =>
      Future.value(_replace(order, OrderStatus.rejected));

  @override
  Future<Order> cancelOrder(Order order) =>
      Future.value(_replace(order, OrderStatus.cancelled));

  @override
  Future<List<Order>> getRelevantOrders() =>
      Future.value(List.unmodifiable(_relevantOrders));

  @override
  Future<Provider> getCurrentProvider() => Future.value(mockOrdersProvider);

  @override
  Future<Quote?> getMyQuoteFor(Order order, Provider provider) {
    final matches = _providerQuotes.where(
      (quote) => quote.orderId == order.id && quote.providerId == provider.id,
    );
    return Future.value(matches.isEmpty ? null : matches.first);
  }

  @override
  Future<Quote> submitQuote({
    required Order order,
    required Provider provider,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  }) {
    final now = DateTime.now();
    final quote = Quote(
      id: QuoteId.create(),
      orderId: order.id,
      providerId: provider.id,
      proposedPrice: proposedPrice,
      estimatedDuration: estimatedDuration,
      notes: notes,
      status: QuoteStatus.pending,
      type: type,
      createdAt: now,
      updatedAt: now,
    );
    _providerQuotes.add(quote);
    return Future.value(quote);
  }

  @override
  Future<Order> startOrder(Order order) =>
      Future.value(_replace(order, OrderStatus.inProgress));

  @override
  Future<Order> completeOrder(Order order) =>
      Future.value(_replace(order, OrderStatus.completed));
}
