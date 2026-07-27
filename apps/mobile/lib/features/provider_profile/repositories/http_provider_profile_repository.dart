import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'provider_profile_repository.dart';

/// [ProviderProfileRepository] backed by [ApiClient].
///
/// [getProvider] has no id parameter (only `GET /providers`, paginated,
/// unfiltered) — [_fetchProvider] takes the first item as a fallback
/// for when the caller doesn't already have a [Provider] in hand. The
/// normal path skips it: every other getter takes the real [Provider]
/// the caller already resolved (from Marketplace/Service Detail) and
/// looks up its data directly.
///
/// [getAvailabilityFor], [getReviewsFor] and [getServicesFor] have the
/// same interim shape as `HttpChatRepository.getMessages`: the backend
/// has no `GET /availabilities?providerId=`, `GET /reviews?providerId=`
/// or `GET /services?providerId=` filter, so all three list the full
/// unfiltered collection and match `providerId` client-side. Adding
/// those query filters is the natural follow-up.
///
/// [getCategoriesFor] goes one step further: there is no
/// `GET /categories?providerId=` endpoint at all, direct or otherwise.
/// Instead it derives the categories from the already-fetched services
/// list — collects the distinct `categoryId`s they reference, then
/// lists `GET /categories` and keeps only the ones whose id is in that
/// set. This is correct today (a provider's categories are exactly the
/// categories of the services they offer) but is one more client-side
/// join than the other getters need — worth revisiting if the backend
/// ever exposes a direct provider→category relationship.
class HttpProviderProfileRepository implements ProviderProfileRepository {
  HttpProviderProfileRepository(this._apiClient);

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
  Future<Profile> getProfileFor(Provider provider) async {
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Availability> getAvailabilityFor(Provider provider) async {
    final json = await _apiClient.get('/availabilities');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final matches = items
        .where((item) => item['providerId'] == provider.id.value)
        .toList();
    if (matches.isEmpty) {
      throw StateError(
        'No availability found for provider ${provider.id.value}',
      );
    }
    return AvailabilityHttpMapper.fromJson(matches.first);
  }

  @override
  Future<List<Review>> getReviewsFor(Provider provider) async {
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(ReviewHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Service>> getServicesFor(Provider provider) async {
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(ServiceHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Category>> getCategoriesFor(List<Service> services) async {
    final categoryIds = services
        .map((service) => service.categoryId.value)
        .toSet();
    final json = await _apiClient.get('/categories');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final seen = <String>{};
    final categories = <Category>[];
    for (final item in items) {
      final id = item['id'] as String;
      if (categoryIds.contains(id) && seen.add(id)) {
        categories.add(CategoryHttpMapper.fromJson(item));
      }
    }
    return categories;
  }
}
