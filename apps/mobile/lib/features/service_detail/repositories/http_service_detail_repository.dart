import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'service_detail_repository.dart';

/// [ServiceDetailRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed service (see
/// `service_detail_repository.dart`'s own doc comment: "no id-based
/// lookup yet"). The backend mirrors that limitation — there is no
/// "service for the current screen" endpoint, only `GET /services`
/// (paginated, unfiltered) and `GET /services/:id`. [_fetchService]
/// takes the first item of the list as the one service this screen
/// shows, exactly matching what the previous mock data represented (a
/// single fixed service) — just sourced from the real backend now
/// instead of a hardcoded object.
///
/// [getProvider], [getProviderProfile] and [getCategory] follow the ids
/// already carried by the [Service] itself (`providerId`, `categoryId`)
/// via `GET /{resource}/:id`, the same direct-lookup pattern as
/// `HttpOrdersRepository.getProviderFor`/`getCategoryFor`.
///
/// [getReviews] has no backend support at all for filtering by service —
/// `Review` (see `review/entities/review.dart`) has no `serviceId` field,
/// only `orderId` and `providerId`. Reviews shown here are therefore
/// approximated as every review for the service's provider, not strictly
/// for this specific service.
class HttpServiceDetailRepository implements ServiceDetailRepository {
  HttpServiceDetailRepository(this._apiClient);

  final ApiClient _apiClient;

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
  Future<Profile> getProviderProfile() async {
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

  // Review has no serviceId field (only orderId/providerId), so the
  // reviews shown for a service are approximated by the reviews for its
  // provider — see the class doc comment for the full explanation.
  @override
  Future<List<Review>> getReviews() async {
    final service = await _fetchService();
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == service.providerId.value)
        .map(ReviewHttpMapper.fromJson)
        .toList();
  }
}
