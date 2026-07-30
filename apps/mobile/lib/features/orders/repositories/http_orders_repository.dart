import 'package:dio/dio.dart';

import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/network/mappers/enum_json.dart';
import '../../../core/session/session_manager.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_type.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'orders_repository.dart';

/// [OrdersRepository] backed by [ApiClient].
///
/// [getOrders] now calls `GET /orders/mine` (JWT-scoped to the calling
/// client's identity) instead of the old unfiltered `GET /orders` —
/// that previous shape returned every order from every user in the
/// system, a real scoping bug.
///
/// [getCategoryFor] now reads `Order.categoryId` directly (added to the
/// domain model alongside nullable `providerId`/`serviceId` — see
/// `Order`'s own doc comment) instead of chaining through the order's
/// service, since `categoryId` is always present regardless of whether
/// this is a direct hire or an open request.
///
/// [getServiceFor]/[getProviderFor] throw `StateError` when
/// [Order.serviceId]/[Order.providerId] is `null` (an open request with
/// nothing assigned yet) — same "not found" shape already used by
/// [getQuoteFor] below. [getQuoteFor] additionally throws when the
/// order has no accepted `Quote` yet (still waiting), and now prefers
/// the accepted quote when more than one exists for the order (an open
/// request can receive several).
class HttpOrdersRepository implements OrdersRepository {
  HttpOrdersRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  @override
  Future<List<Order>> getOrders({CancelToken? cancelToken}) async {
    final items = await _apiClient.getList(
      '/orders/mine',
      cancelToken: cancelToken,
    );
    return items
        .cast<Map<String, dynamic>>()
        .map(OrderHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<Service> getServiceFor(Order order, {CancelToken? cancelToken}) async {
    final serviceId = order.serviceId;
    if (serviceId == null) {
      throw StateError('Order ${order.id.value} has no service assigned yet');
    }
    final json = await _apiClient.get(
      '/services/${serviceId.value}',
      cancelToken: cancelToken,
    );
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<Provider> getProviderFor(
    Order order, {
    CancelToken? cancelToken,
  }) async {
    final providerId = order.providerId;
    if (providerId == null) {
      throw StateError('Order ${order.id.value} has no provider assigned yet');
    }
    final json = await _apiClient.get(
      '/providers/${providerId.value}',
      cancelToken: cancelToken,
    );
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfileFor(Order order, {CancelToken? cancelToken}) async {
    final provider = await getProviderFor(order, cancelToken: cancelToken);
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
      cancelToken: cancelToken,
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Category> getCategoryFor(
    Order order, {
    CancelToken? cancelToken,
  }) async {
    final json = await _apiClient.get(
      '/categories/${order.categoryId.value}',
      cancelToken: cancelToken,
    );
    return CategoryHttpMapper.fromJson(json);
  }

  @override
  Future<Quote> getQuoteFor(Order order, {CancelToken? cancelToken}) async {
    final json = await _apiClient.get('/quotes', cancelToken: cancelToken);
    final items = json['items'] as List<dynamic>;
    final matches = items
        .cast<Map<String, dynamic>>()
        .where((item) => item['orderId'] == order.id.value)
        .toList();
    if (matches.isEmpty) {
      throw StateError('No quote found for order ${order.id.value}');
    }
    final accepted = matches.where((item) => item['status'] == 'ACCEPTED');
    return QuoteHttpMapper.fromJson(accepted.isNotEmpty ? accepted.first : matches.first);
  }

  /// Same client-side-match shape as [getQuoteFor] above — the backend
  /// has no `GET /profiles?identityId=` filter, so this fetches the
  /// full profiles list and matches `Order.identityId` client-side.
  @override
  Future<Profile> getClientProfileFor(Order order) async {
    final json = await _apiClient.get('/profiles');
    final items = json['items'] as List<dynamic>;
    final match = items.cast<Map<String, dynamic>>().firstWhere(
      (item) => item['identityId'] == order.identityId.value,
      orElse: () => throw StateError(
        'No profile found for identity ${order.identityId.value}',
      ),
    );
    return ProfileHttpMapper.fromJson(match);
  }

  @override
  Future<Order> rejectOrder(Order order) async {
    final json = await _apiClient.put('/orders/${order.id.value}/cancel');
    return OrderHttpMapper.fromJson(json);
  }

  @override
  Future<Order> cancelOrder(Order order) async {
    final json = await _apiClient.put('/orders/${order.id.value}/cancel');
    return OrderHttpMapper.fromJson(json);
  }

  /// Backs the provider-facing "Servicios" screen. `GET
  /// /orders/relevant-for-provider` resolves the calling identity's
  /// Provider record server-side and returns a plain JSON array (not
  /// paginated) — every order already hired to them (any status) plus
  /// every still-`Pending`, unassigned open request in their category.
  @override
  Future<List<Order>> getRelevantOrders() async {
    final items = await _apiClient.getList('/orders/relevant-for-provider');
    return items
        .cast<Map<String, dynamic>>()
        .map(OrderHttpMapper.fromJson)
        .toList();
  }

  /// No "provider for the current session" endpoint exists, so this
  /// lists `GET /providers` (paginated, unfiltered) and matches
  /// `identityId` against the session's own user id client-side — the
  /// same client-side-match shape as [getClientProfileFor] above, but
  /// (unlike `HttpProviderServicesRepository`/
  /// `HttpProviderDashboardRepository`'s own `_fetchProvider`, which
  /// just takes the first provider in the whole system) actually scoped
  /// to the calling identity, since submitting a Quote under the wrong
  /// Provider id would be a real correctness bug, not just a display
  /// one.
  @override
  Future<Provider> getCurrentProvider() async {
    final identityId = _sessionManager.currentUserId;
    if (identityId == null) {
      throw StateError('No authenticated session to resolve a Provider for');
    }
    final json = await _apiClient.get('/providers');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final matches = items.where((item) => item['identityId'] == identityId);
    if (matches.isEmpty) {
      throw StateError('No provider record found for the current session');
    }
    return ProviderHttpMapper.fromJson(matches.first);
  }

  /// Same client-side-match shape as [getQuoteFor] — the backend has no
  /// `GET /quotes?orderId=&providerId=` filter, so this lists the full
  /// unfiltered `/quotes` collection and matches both ids client-side.
  /// Returns `null` (not a thrown error) when this provider hasn't
  /// quoted [order] yet — that is the expected, common case, not a
  /// failure.
  @override
  Future<Quote?> getMyQuoteFor(Order order, Provider provider) async {
    final json = await _apiClient.get('/quotes');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final matches = items.where(
      (item) =>
          item['orderId'] == order.id.value &&
          item['providerId'] == provider.id.value,
    );
    if (matches.isEmpty) return null;
    return QuoteHttpMapper.fromJson(matches.first);
  }

  @override
  Future<Quote> submitQuote({
    required Order order,
    required Provider provider,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  }) async {
    final json = await _apiClient.post(
      '/quotes',
      data: {
        'orderId': order.id.value,
        'providerId': provider.id.value,
        'proposedPrice': proposedPrice,
        'estimatedDuration': estimatedDuration,
        'notes': notes,
        'type': enumToJson(type.name),
      },
    );
    return QuoteHttpMapper.fromJson(json);
  }

  @override
  Future<Order> startOrder(Order order) async {
    final json = await _apiClient.put('/orders/${order.id.value}/start');
    return OrderHttpMapper.fromJson(json);
  }

  @override
  Future<Order> completeOrder(Order order) async {
    final json = await _apiClient.put('/orders/${order.id.value}/complete');
    return OrderHttpMapper.fromJson(json);
  }
}
