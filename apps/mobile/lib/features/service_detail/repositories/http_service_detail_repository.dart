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
/// [getService] has no id parameter (only `GET /services`, paginated,
/// unfiltered) — [_fetchService] takes the first item as a fallback for
/// when the caller doesn't already have a [Service] in hand. The normal
/// path skips it entirely: [getProviderFor], [getProviderProfileFor] and
/// [getCategoryFor] follow the ids already carried by the passed-in
/// [Service]/[Provider] (`providerId`, `categoryId`, `providerProfileId`)
/// via `GET /{resource}/:id`, the same direct-lookup pattern as
/// `HttpOrdersRepository.getProviderFor`/`getCategoryFor`.
///
/// [getReviewsFor] has no backend support at all for filtering by
/// service — `Review` (see `review/entities/review.dart`) has no
/// `serviceId` field, only `orderId` and `providerId`. Reviews shown
/// here are therefore approximated as every review for the service's
/// provider, not strictly for this specific service.
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
  Future<Provider> getProviderFor(Service service) async {
    final json = await _apiClient.get('/providers/${service.providerId.value}');
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProviderProfileFor(Provider provider) async {
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Category> getCategoryFor(Service service) async {
    final json = await _apiClient.get(
      '/categories/${service.categoryId.value}',
    );
    return CategoryHttpMapper.fromJson(json);
  }

  // Review has no serviceId field (only orderId/providerId), so the
  // reviews shown for a service are approximated by the reviews for its
  // provider — see the class doc comment for the full explanation.
  @override
  Future<List<Review>> getReviewsFor(Service service) async {
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == service.providerId.value)
        .map(ReviewHttpMapper.fromJson)
        .toList();
  }
}
