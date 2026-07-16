import '../../../address/entities/address.dart';
import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'quote_repository.dart';

/// [QuoteRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed quote (see
/// `quote_repository.dart`'s own doc comment: "no id-based lookup
/// yet"). `_fetchQuote()` takes the first item of `GET /quotes`
/// (paginated, unfiltered) as that one quote — the same interim shape
/// as `HttpChatRepository._fetchChat()`.
///
/// `Quote` does not carry a `serviceId` directly — [getService] follows
/// `quote.orderId` to `GET /orders/:id` first, then that order's
/// `serviceId` to `GET /services/:id`. `getProvider` uses
/// `quote.providerId` directly. `getProfile`/`getCategory` chain
/// through the provider's `providerProfileId` and the service's
/// `categoryId`, same style as `HttpOrdersRepository`.
///
/// `Address` has no domain relation to `Quote`/`Order` at all —
/// [getAddress] fetches `GET /addresses` and matches client-side on
/// `identityId == order.identityId` (the order's customer), taking the
/// first match. Same interim shape as `HttpOrdersRepository.getQuoteFor`.
class HttpQuoteRepository implements QuoteRepository {
  HttpQuoteRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<Quote> _fetchQuote() async {
    final json = await _apiClient.get('/quotes');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No quotes available for the current session');
    }
    return QuoteHttpMapper.fromJson(items.first);
  }

  Future<Order> _fetchOrder() async {
    final quote = await _fetchQuote();
    final json = await _apiClient.get('/orders/${quote.orderId.value}');
    return OrderHttpMapper.fromJson(json);
  }

  @override
  Future<Quote> getQuote() => _fetchQuote();

  @override
  Future<Service> getService() async {
    final order = await _fetchOrder();
    final json = await _apiClient.get('/services/${order.serviceId.value}');
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<Provider> getProvider() async {
    final quote = await _fetchQuote();
    final json = await _apiClient.get('/providers/${quote.providerId.value}');
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfile() async {
    final provider = await getProvider();
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Category> getCategory() async {
    final service = await getService();
    final json = await _apiClient.get(
      '/categories/${service.categoryId.value}',
    );
    return CategoryHttpMapper.fromJson(json);
  }

  @override
  Future<Address> getAddress() async {
    final order = await _fetchOrder();
    final json = await _apiClient.get('/addresses');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['identityId'] == order.identityId.value,
      orElse: () => throw StateError(
        'No address found for identity ${order.identityId.value}',
      ),
    );
    return AddressHttpMapper.fromJson(match);
  }
}
