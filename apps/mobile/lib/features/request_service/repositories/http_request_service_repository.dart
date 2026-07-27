import '../../../address/entities/address.dart';
import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import '../models/request_priority.dart';
import 'request_service_repository.dart';

/// [RequestServiceRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed service/provider
/// (see `request_service_repository.dart`'s own doc comment: "no
/// id-based lookup yet"). `_fetchService()` takes the first item of
/// `GET /services` (paginated, unfiltered) as that one service — the
/// same interim shape as `HttpChatRepository._fetchChat()`.
///
/// `getProvider`/`getProfile`/`getCategory` chain through ids already
/// carried by [Service] itself (`providerId`, `categoryId`) and the
/// provider's `providerProfileId`, same style as `HttpOrdersRepository`.
///
/// `getAvailability` fetches `GET /availabilities` and matches
/// client-side on `providerId == service.providerId` (no
/// `GET /availabilities?providerId=` filter exists yet) — same interim
/// shape as `HttpOrdersRepository.getQuoteFor`.
///
/// `getAddress` has no domain relation to a service request at all (a
/// request isn't identity-scoped at this interface) — it fetches
/// `GET /addresses` and simply takes the first item. This is
/// arbitrary/simulated-equivalent, documented here rather than silently
/// picked: there is genuinely no domain link to resolve instead.
class HttpRequestServiceRepository implements RequestServiceRepository {
  HttpRequestServiceRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  Future<Service> _fetchService() async {
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No services available for the current session');
    }
    return ServiceHttpMapper.fromJson(items.first);
  }

  @override
  Future<Service> getService() => _fetchService();

  @override
  Future<Provider> getProvider() async {
    final service = await _fetchService();
    final json = await _apiClient.get('/providers/${service.providerId.value}');
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
    final service = await _fetchService();
    final json = await _apiClient.get(
      '/categories/${service.categoryId.value}',
    );
    return CategoryHttpMapper.fromJson(json);
  }

  @override
  Future<Availability> getAvailability() async {
    final service = await _fetchService();
    final json = await _apiClient.get('/availabilities');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['providerId'] == service.providerId.value,
      orElse: () => throw StateError(
        'No availability found for provider ${service.providerId.value}',
      ),
    );
    return AvailabilityHttpMapper.fromJson(match);
  }

  @override
  Future<Address> getAddress() async {
    final json = await _apiClient.get('/addresses');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No addresses available for the current session');
    }
    return AddressHttpMapper.fromJson(items.first);
  }

  @override
  Future<Order> createOrder({
    required Service service,
    required Provider provider,
    required String title,
    required String description,
    required DateTime scheduledDate,
    required RequestPriority priority,
  }) async {
    final json = await _apiClient.post(
      '/orders',
      data: {
        'identityId': _sessionManager.currentUserId,
        'providerId': provider.id.value,
        'serviceId': service.id.value,
        'title': title,
        'description': description,
        'scheduledDate': scheduledDate.toIso8601String(),
        'priority': priority.asOrderPriority.name.toUpperCase(),
      },
    );
    return OrderHttpMapper.fromJson(json);
  }
}
