import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../review/entities/review.dart';
import 'provider_dashboard_repository.dart';

/// [ProviderDashboardRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed provider's
/// dashboard (see `provider_dashboard_repository.dart`'s own doc
/// comment: "no id-based lookup yet"). The backend mirrors that
/// limitation — there is no "dashboard for the current provider"
/// endpoint, only `GET /providers` (paginated, unfiltered) and
/// `GET /providers/:id`. [getProvider] (via the private [_fetchProvider]
/// helper) takes the first item of the list as the one provider this
/// screen shows, exactly matching what the previous mock data
/// represented (a single fixed provider) — just sourced from the real
/// backend now instead of a hardcoded object.
///
/// [getProfile] follows the id already carried by the fetched
/// [Provider] (`providerProfileId`) via `GET /profiles/:id` — a direct,
/// correctly-scoped lookup, same shape as `HttpOrdersRepository`'s
/// relation getters.
///
/// [getOrders] now calls `GET /orders/relevant-for-provider` instead of
/// the old unfiltered `GET /orders` + client-side `providerId` filter —
/// that previous shape both leaked every other provider's orders to
/// this call site and missed open (unassigned) requests in this
/// provider's own category entirely, a real scoping bug fixed the same
/// way as `HttpOrdersRepository.getRelevantOrders`. The endpoint
/// resolves the calling identity's Provider record server-side, so it
/// doesn't need [_fetchProvider] at all.
///
/// [getQuotes] and [getReviews] still have the same interim shape as
/// `HttpChatRepository`'s list getters: the backend has no
/// `GET /quotes?providerId=` or `GET /reviews?providerId=` filter, so
/// each lists the full unfiltered collection and matches `providerId`
/// client-side. [getPayments] does the same against `GET /payments`,
/// matching `receiverProviderId` instead (`Payment` has no `providerId`
/// field — see `payment/entities/payment.dart`). That is safe at this
/// app's current data scale but not how a real paginated backend query
/// should work long-term — adding those query filters is the natural
/// Prompt 76 follow-up once more than a handful of records per provider
/// exist.
class HttpProviderDashboardRepository implements ProviderDashboardRepository {
  HttpProviderDashboardRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<Provider> _fetchProvider() async {
    final json = await _apiClient.get('/providers');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No providers available for the current session');
    }
    return ProviderHttpMapper.fromJson(items.first);
  }

  @override
  Future<Provider> getProvider() => _fetchProvider();

  @override
  Future<Profile> getProfile() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<List<Order>> getOrders() async {
    final items = await _apiClient.getList('/orders/relevant-for-provider');
    return items
        .cast<Map<String, dynamic>>()
        .map(OrderHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Quote>> getQuotes() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/quotes');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(QuoteHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Review>> getReviews() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(ReviewHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Payment>> getPayments() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/payments');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['receiverProviderId'] == provider.id.value)
        .map(PaymentHttpMapper.fromJson)
        .toList();
  }
}
