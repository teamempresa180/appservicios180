import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'provider_services_repository.dart';

/// [ProviderServicesRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed provider (see
/// `provider_services_repository.dart`'s own doc comment: "no id-based
/// lookup yet"). The backend mirrors that limitation — there is no
/// "provider for the current session" endpoint, only `GET /providers`
/// (paginated, unfiltered) and `GET /providers/:id`. [getProvider]
/// takes the first item of the list as the one provider this screen
/// shows, exactly matching what the previous mock data represented (a
/// single fixed provider) — just sourced from the real backend now
/// instead of a hardcoded object.
///
/// [getProfile] and [getServices] have the same interim shape:
/// `getProfile` follows the provider's `providerProfileId` via a
/// direct `GET /profiles/:id`; `getServices` has no
/// `GET /services?providerId=` filter on the backend, so it lists the
/// full unfiltered `/services` collection and matches `providerId`
/// client-side — the same approach as `HttpChatRepository.getMessages`.
///
/// [getCategoryFor] is the one exception: it is a direct,
/// correctly-scoped `GET /categories/:id` lookup off the id already
/// carried by the [Service] itself (`categoryId`), mirroring
/// `HttpOrdersRepository.getCategoryFor`'s direct-id-lookup methods —
/// no client-side filtering needed.
class HttpProviderServicesRepository implements ProviderServicesRepository {
  HttpProviderServicesRepository(this._apiClient);

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
  Future<List<Service>> getServices() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(ServiceHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<Category> getCategoryFor(Service service) async {
    final json = await _apiClient.get(
      '/categories/${service.categoryId.value}',
    );
    return CategoryHttpMapper.fromJson(json);
  }

  @override
  Future<Service> createService({
    required Provider provider,
    required Category category,
    required String name,
    required String description,
    required num basePrice,
    required int estimatedDuration,
    required ServiceType type,
  }) async {
    final json = await _apiClient.post(
      '/services',
      data: {
        'providerId': provider.id.value,
        'categoryId': category.id.value,
        'name': name,
        'description': description,
        'basePrice': basePrice,
        'estimatedDuration': estimatedDuration,
        'type': type.name.toUpperCase(),
      },
    );
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<Service> updateService(
    Service service, {
    num? basePrice,
    int? estimatedDuration,
    ServiceStatus? status,
  }) async {
    final json = await _apiClient.put(
      '/services/${service.id.value}',
      data: {
        if (basePrice != null) 'basePrice': basePrice,
        if (estimatedDuration != null) 'estimatedDuration': estimatedDuration,
        if (status != null) 'status': status.name.toUpperCase(),
      },
    );
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<void> deleteService(Service service) =>
      _apiClient.delete('/services/${service.id.value}');
}
