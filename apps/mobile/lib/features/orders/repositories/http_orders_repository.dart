import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'orders_repository.dart';

/// [OrdersRepository] backed by [ApiClient].
///
/// `getOrders()` calls `GET /orders` directly. Every relation getter
/// (`getServiceFor`, `getProviderFor`, etc.) follows the id already
/// carried by the [Order] itself (`serviceId`, `providerId`) via
/// `GET /{resource}/:id` — a direct, correctly-scoped lookup.
///
/// [getCategoryFor] and [getQuoteFor] are the two exceptions: the
/// backend has no `GET /categories/:id` shortcut off an order (it goes
/// through the order's service), and no `GET /quotes?orderId=` filter
/// exists at all, so [getQuoteFor] fetches the full quotes list and
/// matches `orderId` client-side. That is safe at this app's current
/// data scale but not how a real paginated backend query should work
/// long-term — adding a `GET /quotes?orderId=` filter (mirroring what
/// `search` already does for free-text) is the natural Prompt 76
/// follow-up once more than a handful of quotes per order exist.
class HttpOrdersRepository implements OrdersRepository {
  HttpOrdersRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Order>> getOrders() async {
    final json = await _apiClient.get('/orders');
    final items = json['items'] as List<dynamic>;
    return items
        .map((item) => OrderHttpMapper.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<Service> getServiceFor(Order order) async {
    final json = await _apiClient.get('/services/${order.serviceId.value}');
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<Provider> getProviderFor(Order order) async {
    final json = await _apiClient.get('/providers/${order.providerId.value}');
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfileFor(Order order) async {
    final provider = await getProviderFor(order);
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Category> getCategoryFor(Order order) async {
    final service = await getServiceFor(order);
    final json = await _apiClient.get(
      '/categories/${service.categoryId.value}',
    );
    return CategoryHttpMapper.fromJson(json);
  }

  @override
  Future<Quote> getQuoteFor(Order order) async {
    final json = await _apiClient.get('/quotes');
    final items = json['items'] as List<dynamic>;
    final match = items.cast<Map<String, dynamic>>().firstWhere(
      (item) => item['orderId'] == order.id.value,
      orElse: () => throw StateError(
        'No quote found for order ${order.id.value}',
      ),
    );
    return QuoteHttpMapper.fromJson(match);
  }
}
